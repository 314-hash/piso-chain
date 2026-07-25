#!/usr/bin/env python3
"""
PISO Chain Public RPC & Network Connectivity Tester
"""

import json
import urllib.request
import sys

RPC_URL = "https://piso-rpc.loca.lt"
VALIDATOR_ADDR = "0xE3aFaeC0677A6C34CC190B1f8f68f1d712D45614"

def json_rpc(method, params=[]):
    payload = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": 1
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        RPC_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Bypass-Tunnel-Remainder": "true",
            "User-Agent": "PISO-RPC-Test/1.0"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            return res.get("result")
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    print(f"=== Testing PISO Chain Public RPC: {RPC_URL} ===\n")
    
    # 1. Chain ID
    chain_id_hex = json_rpc("eth_chainId")
    if chain_id_hex and isinstance(chain_id_hex, str) and chain_id_hex.startswith("0x"):
        chain_id = int(chain_id_hex, 16)
        print(f"[OK] Chain ID:           {chain_id} ({chain_id_hex})")
    else:
        print(f"[!] Chain ID Result:    {chain_id_hex}")
        
    # 2. Block Number
    block_hex = json_rpc("eth_blockNumber")
    if block_hex and isinstance(block_hex, str) and block_hex.startswith("0x"):
        block_num = int(block_hex, 16)
        print(f"[OK] Current Block:       #{block_num}")
    else:
        print(f"[!] Block Result:       {block_hex}")

    # 3. Client Version
    client = json_rpc("web3_clientVersion")
    print(f"[OK] Geth Client:        {client}")

    # 4. Validator Balance
    bal_hex = json_rpc("eth_getBalance", [VALIDATOR_ADDR, "latest"])
    if bal_hex and isinstance(bal_hex, str) and bal_hex.startswith("0x"):
        bal_wei = int(bal_hex, 16)
        bal_piso = bal_wei / 1e18
        print(f"[OK] Validator Balance:  {bal_piso:,.2f} PISO")
    else:
        print(f"[!] Balance Result:     {bal_hex}")

    print("\n================================================")
