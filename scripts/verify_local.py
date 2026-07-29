#!/usr/bin/env python3
import json
import urllib.request

RPC_URL = "http://127.0.0.1:8545"

def query(method, params=None):
    if params is None:
        params = []
    payload = json.dumps({
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": 1
    }).encode("utf-8")
    req = urllib.request.Request(RPC_URL, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("result")
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    print("=== Testing Local Node RPC (http://127.0.0.1:8545) ===")
    print(f"[+] eth_chainId:       {query('eth_chainId')}")
    print(f"[+] eth_blockNumber:   {query('eth_blockNumber')}")
    print(f"[+] web3_clientVersion: {query('web3_clientVersion')}")
    print(f"[+] net_version:       {query('net_version')}")
    print(f"[+] eth_getBalance (Treasury): {query('eth_getBalance', ['0x1821F246a27287a2187E1D634B8883030fA14731', 'latest'])}")
