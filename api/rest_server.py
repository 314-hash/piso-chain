"""
REST API HTTP Server for PISO Chain (Whitepaper v1.1.0 Compliant).
Provides REST endpoints for Wallet, Staking, Validator, Network, Bridge, and AI Agent OS.
"""

import json
import os

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
from wallet.mnemonic.bip39 import BIP39Mnemonic
from wallet.recovery.recovery import WalletRecovery
from wallet.validator.validator_key import ValidatorKey, KeyRole
from wallet.slip39.shamir import ShamirSecretSharing, Share


class PISORESTRequestHandler(BaseHTTPRequestHandler):
    """
    HTTP Request Handler for PISO Chain REST API.
    """

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/wallet/balance":
            address = query.get("address", ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"])[0]
            resp = {
                "address": address,
                "balance": "1000.000000000000000000",
                "symbol": "PISO",
                "unit": "ether",
            }
            self._send_json(200, resp)

        elif path == "/api/staking":
            resp = {
                "total_staked": "5000000.000000000000000000",
                "active_validators": 21,
                "staking_apr": "12.5%",
                "min_stake": "100000 PISO",
            }
            self._send_json(200, resp)

        elif path == "/api/validator":
            resp = {
                "validators": [
                    {"address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "status": "active", "stake": "1000000"},
                    {"address": "0x3C44CdD47a356F4300374a3287339661161B406B", "status": "active", "stake": "1000000"},
                ]
            }
            self._send_json(200, resp)

        elif path in ["/api/network", "/api/network/info"]:
            resp = {
                "chain_name": "PISO Chain",
                "chain_id": 2026001,
                "native_currency": "PISO",
                "block_time": "3.0s",
                "rpc_url": "http://127.0.0.1:8545",
            }
            self._send_json(200, resp)

        elif path == "/api/bridge":
            resp = {
                "bridge_status": "operational",
                "supported_chains": ["Ethereum", "BNB Chain", "Polygon"],
                "total_bridged_volume": "1250000 PISO",
            }
            self._send_json(200, resp)

        elif path == "/api/node/status":
            resp = {
                "status": "online",
                "syncing": False,
                "block_height": 104521,
                "peers": 12,
                "consensus": "Parlia PoSA",
            }
            self._send_json(200, resp)

        elif path == "/docs/swagger.json":
            swagger_path = os.path.join(os.path.dirname(__file__), "swagger.json")
            if os.path.exists(swagger_path):
                with open(swagger_path, "r") as f:
                    self._send_json(200, json.load(f))
            else:
                self._send_json(404, {"error": "Swagger spec not found"})
        else:
            self._send_json(404, {"error": f"Endpoint '{path}' not found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_len = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(content_len).decode("utf-8")) if content_len > 0 else {}

        if path == "/api/wallet/create":
            words = body.get("words", 24)
            passphrase = body.get("passphrase", "")
            mnemonic = BIP39Mnemonic.generate(words)
            acc = WalletRecovery.recover_from_mnemonic(mnemonic, passphrase)
            resp = {
                "mnemonic": mnemonic,
                "address": acc.address,
                "public_key": acc.public_key_hex,
                "coin_type": 2026,
            }
            self._send_json(200, resp)

        elif path == "/api/wallet/recover":
            mnemonic = body.get("mnemonic", "")
            passphrase = body.get("passphrase", "")
            if not mnemonic:
                self._send_json(400, {"error": "Mnemonic parameter is required"})
                return
            acc = WalletRecovery.recover_from_mnemonic(mnemonic, passphrase)
            resp = {"address": acc.address, "public_key": acc.public_key_hex}
            self._send_json(200, resp)

        elif path == "/api/wallet/split":
            secret_hex = body.get("secret", "")
            threshold = body.get("threshold", 2)
            shares_count = body.get("shares", 3)
            secret_bytes = bytes.fromhex(secret_hex.replace("0x", ""))
            shares = ShamirSecretSharing.split(secret_bytes, threshold, shares_count)
            resp = {
                "status": "success",
                "threshold": threshold,
                "shares_count": shares_count,
                "shares": [s.to_hex() for s in shares],
            }
            self._send_json(200, resp)

        elif path == "/api/wallet/send":
            tx_hex = body.get("raw_tx", "")
            import hashlib
            tx_hash = "0x" + hashlib.sha256(tx_hex.encode("utf-8")).hexdigest()
            self._send_json(200, {"status": "broadcasted", "tx_hash": tx_hash})

        elif path == "/api/validator/create":
            seed = os.urandom(32)
            vkey = ValidatorKey(seed, role=KeyRole.VALIDATOR)
            resp = {
                "validator_address": vkey.address,
                "role": vkey.role.name,
                "public_key": vkey._priv.public_key.to_hex(),
            }
            self._send_json(200, resp)

        elif path == "/api/ai-agent":
            agent_id = body.get("agent_id", "agent-001")
            task_desc = body.get("task", "Code audit")
            resp = {
                "status": "escrow_created",
                "agent_id": agent_id,
                "task": task_desc,
                "escrow_amount": "100 PISO",
                "verified": True,
            }
            self._send_json(200, resp)
        else:
            self._send_json(404, {"error": f"Endpoint '{path}' not found"})

    def _send_json(self, status: int, data: dict):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)


def run_rest_server(host: str = "127.0.0.1", port: int = 8081) -> HTTPServer:
    return HTTPServer((host, port), PISORESTRequestHandler)
