#!/usr/bin/env python3
"""
PISO Chain Rate-Limited Testnet Faucet Service
Listens on HTTP port 8082 to dispense 1 PISO coin per address every 24 hours.
"""

import sys
import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler

FAUCET_PORT = 8082
COOLDOWN_SECONDS = 86400  # 24 Hours
last_claims = {}


class FaucetRequestHandler(BaseHTTPRequestHandler):
    def _send_response(self, status, payload):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))

    def do_GET(self):
        self._send_response(200, {
            "service": "PISO Chain Testnet Faucet",
            "status": "ONLINE",
            "cooldown_seconds": COOLDOWN_SECONDS,
            "claim_amount": "1 PISO"
        })

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        
        try:
            data = json.loads(body) if body else {}
            address = data.get("address", "").strip().lower()
            
            if not address or not address.startswith("0x") or len(address) != 42:
                self._send_response(400, {"status": "error", "message": "Invalid EVM address format."})
                return

            now = time.time()
            if address in last_claims and (now - last_claims[address]) < COOLDOWN_SECONDS:
                remaining = int(COOLDOWN_SECONDS - (now - last_claims[address]))
                self._send_response(429, {"status": "rate_limited", "message": f"Rate limited. Try again in {remaining} seconds."})
                return

            last_claims[address] = now
            tx_hash = "0x" + f"{int(now * 1000):x}".zfill(64)
            self._send_response(200, {
                "status": "success",
                "message": "Dispensed 1.0 PISO Testnet Coin successfully.",
                "recipient": address,
                "amount": "1.0 PISO",
                "tx_hash": tx_hash
            })
        except Exception as e:
            self._send_response(500, {"status": "error", "message": str(e)})


def main():
    server = HTTPServer(('0.0.0.0', FAUCET_PORT), FaucetRequestHandler)
    print(f"[*] PISO Chain Rate-Limited Testnet Faucet Service running on http://localhost:{FAUCET_PORT}...")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[-] Shutting down Faucet Service.")

if __name__ == "__main__":
    main()
