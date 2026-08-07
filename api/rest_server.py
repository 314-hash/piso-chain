"""
REST API HTTP Server for PISO Chain (Whitepaper v1.1.0 Compliant).
Provides REST endpoints for Wallet, Staking, Validator, Network, Bridge, AI Agent OS,
Legendary OSINT, PraisonAI, JobSync, OWASP AISVS, IRONSIGHT, L0p4Map, and MinerU.
"""

import json
import os

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
from wallet.mnemonic.bip39 import BIP39Mnemonic
from wallet.recovery.recovery import WalletRecovery
from wallet.validator.validator_key import ValidatorKey, KeyRole
from wallet.slip39.shamir import ShamirSecretSharing, Share

# Enterprise 7-Repo Modules Integration
from core.legendary_osint import LegendaryOSINTEngine
from core.praison_agent_engine import PraisonAgentEngine
from core.jobsync_engine import JobSyncEngine
from core.aisvs_security_verifier import AISVSSecurityVerifier
from core.ironsight_command_center import IRONSIGHTCommandCenter
from core.l0p4map_scanner import L0p4MapScanner
from core.mineru_parser import MinerUParser
from core.treasury_mining import PISOTreasuryMiningEngine
from core.refref_referral_engine import RefRefReferralEngine
from core.nethermind_engine import NethermindEngine

# Singletons
osint_engine = LegendaryOSINTEngine()
praison_engine = PraisonAgentEngine()
jobsync_engine = JobSyncEngine()
aisvs_verifier = AISVSSecurityVerifier()
ironsight_cc = IRONSIGHTCommandCenter()
l0p4_scanner = L0p4MapScanner()
mineru_parser = MinerUParser()
treasury_engine = PISOTreasuryMiningEngine()
refref_engine = RefRefReferralEngine()
nethermind_engine = NethermindEngine()


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
                "rpc_url_remote": "https://piso-rpc-dev.loca.lt",
                "recommendation": "Use http://127.0.0.1:8545 for local development & MetaMask to bypass localtunnel rate limits",
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

        # --- Integrated Enterprise Endpoints ---
        elif path == "/api/v1/jobsync/tasks":
            self._send_json(200, {
                "tasks": jobsync_engine.get_all_jobs(),
                "stats": jobsync_engine.get_queue_stats(),
            })

        elif path == "/api/v1/ironsight/telemetry":
            self._send_json(200, ironsight_cc.get_live_telemetry())

        elif path == "/api/v1/l0p4map/topology":
            self._send_json(200, l0p4_scanner.generate_topology_graph())

        elif path == "/api/v1/aisvs/compliance":
            self._send_json(200, aisvs_verifier.evaluate_aisvs_compliance())

        elif path == "/api/v1/treasury/status":
            current_block = int(query.get("block", [104521])[0])
            self._send_json(200, treasury_engine.get_treasury_status(current_block))

        elif path == "/api/v1/refref/stats":
            referrer = query.get("referrer", [None])[0]
            self._send_json(200, refref_engine.get_referral_stats(referrer))

        elif path == "/api/v1/nethermind/status":
            self._send_json(200, nethermind_engine.get_client_status())

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

        # --- Integrated Enterprise 7-Repo POST Endpoints ---
        elif path == "/api/v1/osint/investigate":
            target = body.get("target", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
            report = osint_engine.generate_osint_report(target)
            self._send_json(200, report)

        elif path == "/api/v1/praison/orchestrate":
            task_prompt = body.get("prompt", "Perform multi-agent audit and trading strategy analysis")
            result = praison_engine.execute_workflow(task_prompt)
            self._send_json(200, result)

        elif path == "/api/v1/jobsync/schedule":
            name = body.get("name", "Custom Job")
            category = body.get("category", "AI Task")
            priority = body.get("priority", 1)
            scheduled = jobsync_engine.schedule_job(name, category, priority)
            self._send_json(200, scheduled)

        elif path == "/api/v1/aisvs/verify":
            prompt = body.get("prompt", "")
            if prompt:
                res = aisvs_verifier.verify_prompt_security(prompt)
            else:
                res = aisvs_verifier.evaluate_aisvs_compliance()
            self._send_json(200, res)

        elif path == "/api/v1/l0p4map/scan":
            target = body.get("target", "127.0.0.1")
            res = l0p4_scanner.scan_target_node(target)
            self._send_json(200, res)

        elif path == "/api/v1/mineru/parse":
            content = body.get("content", "PISO Chain Whitepaper Technical Specification")
            filename = body.get("filename", "PISO_WHITEPAPER.pdf")
            res = mineru_parser.parse_document_text(content, filename)
            self._send_json(200, res)

        elif path == "/api/v1/refref/campaign/create":
            name = body.get("name", "Validator Referral Campaign")
            reward = float(body.get("reward_piso", 50.0))
            reward_type = body.get("reward_type", "FIXED")
            desc = body.get("description", "Referral program for PISO Chain validator operators.")
            res = refref_engine.create_campaign(name, reward, reward_type, desc)
            self._send_json(200, res)

        elif path == "/api/v1/refref/code/generate":
            referrer = body.get("referrer", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
            campaign_id = body.get("campaign_id", None)
            res = refref_engine.generate_referral_code(referrer, campaign_id)
            self._send_json(200, res)

        elif path == "/api/v1/refref/track/conversion":
            ref_code = body.get("referral_code", "")
            referred_user = body.get("referred_user", "0x3C44CdD47a356F4300374a3287339661161B406B")
            tx_hash = body.get("tx_hash", "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e")
            res = refref_engine.track_conversion(ref_code, referred_user, tx_hash)
            self._send_json(200, res)

        elif path == "/api/v1/nethermind/trace":
            tx_hash = body.get("tx_hash", "0x6f8dcf508309dcea2a30e89f801ea7df105a308e0a4886617fd6c5f2cf65a040")
            res = nethermind_engine.trace_transaction(tx_hash)
            self._send_json(200, res)

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
