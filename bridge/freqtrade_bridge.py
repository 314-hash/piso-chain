"""
PISO Chain ↔ Freqtrade Bridge
============================
Polls the freqtrade REST API for newly closed trades, computes SHA-256 trade
proofs, and submits them to the PISOFreqtradeOracle.sol smart contract on
PISO Chain (Chain ID 2026001) via Web3.py.

Usage:
    python bridge/freqtrade_bridge.py                  # live mode
    python bridge/freqtrade_bridge.py --dry-run        # simulate without on-chain tx
    python bridge/freqtrade_bridge.py --once           # single poll then exit

Environment Variables (.env):
    RPC_URL                   PISO Chain RPC (default: http://localhost:8545)
    FREQTRADE_API_URL         Freqtrade REST API (default: http://localhost:8180)
    FREQTRADE_API_USER        Freqtrade API username
    FREQTRADE_API_PASSWORD    Freqtrade API password
    WORKER_PRIVATE_KEY        jcode agent wallet private key (hex)
    FREQTRADE_ORACLE_ADDRESS  Deployed PISOFreqtradeOracle.sol contract address
"""

import os
import sys
import json
import time
import hashlib
import logging
import argparse
from datetime import datetime, timezone
from typing import Optional

import requests
from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware
from dotenv import load_dotenv

# ── Configuration ─────────────────────────────────────────────────────────────

load_dotenv()

PISO_RPC_URL          = os.getenv("RPC_URL", "http://localhost:8545")
FREQTRADE_API_URL     = os.getenv("FREQTRADE_API_URL", "http://localhost:8180")
FREQTRADE_API_USER    = os.getenv("FREQTRADE_API_USER", "pisobot")
FREQTRADE_API_PASS    = os.getenv("FREQTRADE_API_PASSWORD", "changeme")
WORKER_PRIVATE_KEY    = os.getenv("WORKER_PRIVATE_KEY", "")
ORACLE_ADDRESS        = os.getenv("FREQTRADE_ORACLE_ADDRESS", "")

POLL_INTERVAL_SECONDS = int(os.getenv("FREQTRADE_POLL_INTERVAL", "30"))
LOG_FILE              = "bridge/freqtrade_bridge.log"

# Minimal ABI for PISOFreqtradeOracle.submitTradeProof()
ORACLE_ABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "freqtradeTradeId",  "type": "uint256"},
            {"internalType": "string",  "name": "strategy",          "type": "string"},
            {"internalType": "string",  "name": "pair",              "type": "string"},
            {"internalType": "int256",  "name": "profitBps",         "type": "int256"},
            {"internalType": "bytes32", "name": "proofHash",         "type": "bytes32"},
            {"internalType": "uint256", "name": "openTimestamp",     "type": "uint256"},
            {"internalType": "uint256", "name": "closeTimestamp",    "type": "uint256"},
        ],
        "name": "submitTradeProof",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "getVaultBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True,  "name": "pisoTradeId",       "type": "uint256"},
            {"indexed": True,  "name": "freqtradeTradeId",   "type": "uint256"},
            {"indexed": True,  "name": "workerAddress",      "type": "address"},
            {"indexed": False, "name": "strategy",           "type": "string"},
            {"indexed": False, "name": "pair",               "type": "string"},
            {"indexed": False, "name": "profitBps",          "type": "int256"},
            {"indexed": False, "name": "proofHash",          "type": "bytes32"},
            {"indexed": False, "name": "profitable",         "type": "bool"},
            {"indexed": False, "name": "rewardPaid",         "type": "uint256"},
        ],
        "name": "TradeVerified",
        "type": "event",
    },
]

# ── Logging Setup ─────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, mode="a"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger("freqtrade_bridge")


# ── Proof Generation ──────────────────────────────────────────────────────────

def compute_trade_proof(
    trade_id: int,
    strategy: str,
    profit_bps: int,
    close_timestamp: int,
    worker_address: str,
) -> bytes:
    """
    Compute SHA-256 trade proof.
    Mirrors the on-chain keccak256 logic for auditable cross-verification.

    Proof = SHA256(tradeId | workerAddress | strategy | profitBps | closeTimestamp)
    """
    raw = f"{trade_id}|{worker_address.lower()}|{strategy}|{profit_bps}|{close_timestamp}"
    digest = hashlib.sha256(raw.encode("utf-8")).digest()
    log.debug(f"  Proof input : {raw}")
    log.debug(f"  SHA-256     : 0x{digest.hex()}")
    return digest


def profit_ratio_to_bps(profit_ratio: float) -> int:
    """Convert freqtrade's profit_ratio (0.0125 = 1.25%) to basis points (125)."""
    return int(round(profit_ratio * 10_000))


# ── Freqtrade REST API Client ─────────────────────────────────────────────────

class FreqtradeClient:
    """Lightweight freqtrade REST API v1 client."""

    def __init__(self, base_url: str, user: str, password: str):
        self.base_url = base_url.rstrip("/")
        self.session  = requests.Session()
        self.session.auth = (user, password)
        self.session.headers.update({"Content-Type": "application/json"})

    def ping(self) -> bool:
        """Check freqtrade bot is alive."""
        try:
            r = self.session.get(f"{self.base_url}/api/v1/ping", timeout=5)
            return r.status_code == 200
        except Exception:
            return False

    def get_closed_trades(self) -> list:
        """Return all closed trades (is_open=False)."""
        try:
            r = self.session.get(f"{self.base_url}/api/v1/trades?limit=500", timeout=10)
            r.raise_for_status()
            data = r.json()
            return [t for t in data.get("trades", []) if not t.get("is_open", True)]
        except Exception as e:
            log.error(f"FreqtradeClient.get_closed_trades failed: {e}")
            return []

    def get_profit_summary(self) -> dict:
        """Return aggregate profit stats."""
        try:
            r = self.session.get(f"{self.base_url}/api/v1/profit", timeout=10)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            log.error(f"FreqtradeClient.get_profit_summary failed: {e}")
            return {}

    def get_status(self) -> dict:
        """Return bot status."""
        try:
            r = self.session.get(f"{self.base_url}/api/v1/status", timeout=5)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            log.error(f"FreqtradeClient.get_status failed: {e}")
            return {}


# ── PISO Chain Web3 Client ────────────────────────────────────────────────────

class PISOChainClient:
    """Web3.py wrapper for PISO Chain (PoA — uses ExtraDataToPOAMiddleware)."""

    def __init__(self, rpc_url: str, private_key: str, oracle_address: str, dry_run: bool = False):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
        self.account = self.w3.eth.account.from_key(private_key)
        self.is_connected = False

        try:
            if self.w3.is_connected():
                self.is_connected = True
                log.info(f"PISO Chain connected | Worker: {self.account.address}")
                log.info(f"Chain ID : {self.w3.eth.chain_id}")
                log.info(f"Balance  : {self.w3.from_wei(self.w3.eth.get_balance(self.account.address), 'ether'):.4f} PISO")
            else:
                if not dry_run:
                    raise ConnectionError(f"Cannot connect to PISO Chain RPC: {rpc_url}")
                log.warning(f"PISO Chain RPC ({rpc_url}) offline — running bridge in simulated dry-run mode")
        except Exception as e:
            if not dry_run:
                raise ConnectionError(f"Cannot connect to PISO Chain RPC ({rpc_url}): {e}")
            log.warning(f"PISO Chain RPC ({rpc_url}) offline ({e}) — running bridge in simulated dry-run mode")

        if oracle_address and self.is_connected:
            self.oracle = self.w3.eth.contract(
                address=Web3.to_checksum_address(oracle_address),
                abi=ORACLE_ABI,
            )
            try:
                vault_bal = self.oracle.functions.getVaultBalance().call()
                log.info(f"Oracle vault: {self.w3.from_wei(vault_bal, 'ether'):.2f} PISO")
            except Exception as e:
                log.warning(f"Could not fetch oracle balance: {e}")
        else:
            self.oracle = None
            log.warning("FREQTRADE_ORACLE_ADDRESS not set or RPC offline — on-chain submissions simulated")


    def submit_trade_proof(
        self,
        trade_id: int,
        strategy: str,
        pair: str,
        profit_bps: int,
        proof_bytes: bytes,
        open_ts: int,
        close_ts: int,
        dry_run: bool = False,
    ) -> Optional[str]:
        """Submit trade proof to PISOFreqtradeOracle.sol. Returns tx hash or None."""
        if self.oracle is None:
            log.warning("Oracle not configured — skipping on-chain submission")
            return None

        proof_bytes32 = proof_bytes[:32].ljust(32, b"\x00")

        if dry_run:
            log.info(f"  [DRY-RUN] Would submit trade #{trade_id} | {pair} | {profit_bps} bps")
            return "0x" + "0" * 64  # mock tx hash

        try:
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            tx = self.oracle.functions.submitTradeProof(
                trade_id,
                strategy,
                pair,
                profit_bps,
                proof_bytes32,
                open_ts,
                close_ts,
            ).build_transaction({
                "from":     self.account.address,
                "nonce":    nonce,
                "gas":      200_000,
                "gasPrice": self.w3.to_wei("1", "gwei"),
                "chainId":  2026001,
            })

            signed   = self.w3.eth.account.sign_transaction(tx, self.account.key)
            tx_hash  = self.w3.eth.send_raw_transaction(signed.raw_transaction)
            receipt  = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=30)

            status = "✅ SUCCESS" if receipt.status == 1 else "❌ FAILED"
            log.info(f"  {status} | TxHash: {tx_hash.hex()} | Gas: {receipt.gasUsed}")
            return tx_hash.hex()

        except Exception as e:
            log.error(f"  submit_trade_proof exception: {e}")
            return None


# ── Main Bridge Logic ─────────────────────────────────────────────────────────

class FreqtradeBridge:
    """
    Core bridge: polls freqtrade, submits new closed trade proofs to PISO Chain.
    Tracks already-submitted trade IDs in a local state file.
    """

    STATE_FILE = "bridge/freqtrade_bridge_state.json"

    def __init__(self, freqtrade_client: FreqtradeClient, piso_client: PISOChainClient, dry_run: bool = False):
        self.ft      = freqtrade_client
        self.piso    = piso_client
        self.dry_run = dry_run
        self.state   = self._load_state()

    def _load_state(self) -> dict:
        if os.path.exists(self.STATE_FILE):
            with open(self.STATE_FILE) as f:
                return json.load(f)
        return {"submitted_trade_ids": []}

    def _save_state(self):
        with open(self.STATE_FILE, "w") as f:
            json.dump(self.state, f, indent=2)

    def _already_submitted(self, trade_id: int) -> bool:
        return trade_id in self.state["submitted_trade_ids"]

    def _mark_submitted(self, trade_id: int):
        self.state["submitted_trade_ids"].append(trade_id)
        self._save_state()

    def poll_and_submit(self) -> int:
        """Poll freqtrade for new closed trades and submit proofs. Returns count submitted."""
        if not self.ft.ping():
            log.warning("Freqtrade bot is offline — skipping poll")
            return 0

        closed_trades = self.ft.get_closed_trades()
        new_trades    = [t for t in closed_trades if not self._already_submitted(t["trade_id"])]

        if not new_trades:
            log.info(f"No new closed trades to submit (total closed: {len(closed_trades)})")
            return 0

        log.info(f"Found {len(new_trades)} new closed trade(s) to submit")
        submitted = 0

        for trade in new_trades:
            trade_id   = trade["trade_id"]
            strategy   = trade.get("strategy", "PISOStrategy")
            pair       = trade.get("pair", "BTC/USDT")
            profit_r   = trade.get("profit_ratio", 0.0) or 0.0
            profit_bps = profit_ratio_to_bps(profit_r)
            open_ts    = int(datetime.fromisoformat(trade["open_date"]).replace(tzinfo=timezone.utc).timestamp())
            close_ts   = int(datetime.fromisoformat(trade["close_date"]).replace(tzinfo=timezone.utc).timestamp())

            log.info(
                f"  Trade #{trade_id:>5} | {pair:<12} | "
                f"{'📈' if profit_bps > 0 else '📉'} {profit_bps:+} bps | "
                f"{strategy}"
            )

            proof = compute_trade_proof(
                trade_id=trade_id,
                strategy=strategy,
                profit_bps=profit_bps,
                close_timestamp=close_ts,
                worker_address=self.piso.account.address,
            )

            tx_hash = self.piso.submit_trade_proof(
                trade_id=trade_id,
                strategy=strategy,
                pair=pair,
                profit_bps=profit_bps,
                proof_bytes=proof,
                open_ts=open_ts,
                close_ts=close_ts,
                dry_run=self.dry_run,
            )

            if tx_hash is not None:
                self._mark_submitted(trade_id)
                submitted += 1
                log.info(f"  ✔ Proof submitted | TxHash: {tx_hash}")
            else:
                log.error(f"  ✘ Proof submission failed for trade #{trade_id}")

        return submitted

    def run_loop(self, poll_interval: int = POLL_INTERVAL_SECONDS):
        """Main polling loop."""
        mode = "DRY-RUN" if self.dry_run else "LIVE"
        log.info(f"═══ PISO Chain ↔ Freqtrade Bridge [{mode}] ═══")
        log.info(f"Poll interval: {poll_interval}s | Oracle: {ORACLE_ADDRESS or 'NOT SET'}")

        while True:
            try:
                log.info(f"── Polling freqtrade [{datetime.now().strftime('%H:%M:%S')}] ──")
                submitted = self.poll_and_submit()
                if submitted > 0:
                    log.info(f"✅ Submitted {submitted} proof(s) to PISO Chain")
            except KeyboardInterrupt:
                log.info("Bridge stopped by user.")
                break
            except Exception as e:
                log.error(f"Poll error: {e}")
            time.sleep(poll_interval)


# ── CLI Entry Point ───────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="PISO Chain ↔ Freqtrade Bridge")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without on-chain txs")
    parser.add_argument("--once",    action="store_true", help="Poll once then exit")
    args = parser.parse_args()

    if not WORKER_PRIVATE_KEY and not args.dry_run:
        log.error("WORKER_PRIVATE_KEY not set. Use --dry-run or set it in .env")
        sys.exit(1)

    # Use a dummy key for dry-run
    private_key = WORKER_PRIVATE_KEY or "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

    ft_client   = FreqtradeClient(FREQTRADE_API_URL, FREQTRADE_API_USER, FREQTRADE_API_PASS)
    piso_client = PISOChainClient(PISO_RPC_URL, private_key, ORACLE_ADDRESS, dry_run=args.dry_run)
    bridge      = FreqtradeBridge(ft_client, piso_client, dry_run=args.dry_run)

    if args.once:
        submitted = bridge.poll_and_submit()
        log.info(f"Single poll complete. Submitted: {submitted}")
    else:
        bridge.run_loop()


if __name__ == "__main__":
    main()
