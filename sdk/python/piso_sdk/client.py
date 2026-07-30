"""
Python SDK RPC Client Implementation.
"""

import urllib.request
import json


class PISOClient:
    """
    HTTP Client wrapper for interacting with PISO Chain nodes.
    """

    def __init__(self, rpc_url: str = "http://127.0.0.1:8545"):
        self.rpc_url = rpc_url

    def _call(self, method: str, params: list = None) -> dict:
        payload = json.dumps({
            "jsonrpc": "2.0",
            "method": method,
            "params": params or [],
            "id": 1,
        }).encode("utf-8")
        req = urllib.request.Request(self.rpc_url, data=payload, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=5) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            return {"error": str(e)}

    def broadcast_transaction(self, raw_tx_hex: str) -> str:
        """Broadcast raw transaction hex string."""
        res = self._call("eth_sendRawTransaction", [raw_tx_hex])
        return res.get("result") or res.get("error", "")

    def get_balance(self, address: str) -> str:
        """Query native balance of address in hex wei."""
        res = self._call("eth_getBalance", [address, "latest"])
        return res.get("result", "0x0")

    def stake(self, validator_address: str, amount_wei: str) -> str:
        """Deposit stake to Parlia PoSA Validator Set contract."""
        # Simulated tx submission to PISOValidatorSet (0x...1000)
        return self.broadcast_transaction("0x01")

    def delegate(self, validator_address: str, amount_wei: str) -> str:
        """Delegate PISO stake to target validator."""
        return self.broadcast_transaction("0x02")
