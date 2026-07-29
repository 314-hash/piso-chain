#!/usr/bin/env python3
"""
PISO Chain Native Coin Distributor & Batch Airdrop CLI Tool
Transfers native $PISO coins from Genesis Treasury / Validator wallets to specified EVM recipient addresses.
"""

import os
import sys
import json
import argparse
import urllib.request
from eth_account import Account
from eth_utils import to_checksum_address, is_address

DEFAULT_RPC = "http://127.0.0.1:8545"
DEFAULT_PUBLIC_RPC = "https://piso-rpc-dev.loca.lt"
CHAIN_ID = 2026001

# Default Genesis Treasury Private Key for local devnet testing (Overrides with PRIVATE_KEY env var)
DEFAULT_DEV_KEY = os.getenv("PRIVATE_KEY", "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d")

def json_rpc(rpc_url, method, params=None):
    if params is None:
        params = []
    payload = json.dumps({
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": 1
    }).encode("utf-8")

    headers = {"Content-Type": "application/json"}
    if "loca.lt" in rpc_url:
        headers["Bypass-Tunnel-Remainder"] = "true"

    req = urllib.request.Request(rpc_url, data=payload, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            if "error" in res:
                raise Exception(res["error"].get("message", "RPC Error"))
            return res.get("result")
    except Exception as e:
        print(f"[!] RPC Connection Error ({rpc_url}): {e}")
        return None

def get_nonce(rpc_url, address):
    nonce_hex = json_rpc(rpc_url, "eth_getTransactionCount", [address, "latest"])
    if nonce_hex and nonce_hex.startsWith("0x"):
        return int(nonce_hex, 16)
    return 0

def send_native_piso(rpc_url, sender_acc, recipient_addr, amount_piso, nonce):
    recipient_checksum = to_checksum_address(recipient_addr)
    wei_val = int(amount_piso * (10 ** 18))

    # Construct EIP-155 raw transaction dict
    tx = {
        "nonce": nonce,
        "to": recipient_checksum,
        "value": wei_val,
        "gas": 21000,
        "gasPrice": 3000000000, # 3.0 Gwei
        "chainId": CHAIN_ID
    }

    signed_tx = sender_acc.sign_transaction(tx)
    tx_bytes_hex = "0x" + signed_tx.rawTransaction.hex()

    tx_hash = json_rpc(rpc_url, "eth_sendRawTransaction", [tx_bytes_hex])
    return tx_hash

def main():
    parser = argparse.ArgumentParser(description="PISO Chain Native Coin Distribution CLI Tool")
    parser.add_argument("--to", type=str, help="Single recipient EVM wallet address")
    parser.add_argument("--amount", type=float, default=1.0, help="Amount of native PISO coins to send per recipient (default: 1.0 PISO)")
    parser.add_argument("--list", type=str, help="Comma-separated list of recipient addresses")
    parser.add_argument("--key", type=str, default=DEFAULT_DEV_KEY, help="Sender private key (hex)")
    parser.add_argument("--rpc", type=str, default=DEFAULT_RPC, help=f"PISO Chain RPC Endpoint (default: {DEFAULT_RPC})")

    args = parser.parse_args()

    print("========================================================")
    print("       PISO CHAIN NATIVE COIN DISTRIBUTOR TOOL          ")
    print("========================================================")

    # Determine sender account
    priv_key = args.key
    if not priv_key.startswith("0x"):
        priv_key = "0x" + priv_key

    try:
        sender_acc = Account.from_key(priv_key)
    except Exception as e:
        print(f"[!] Invalid private key provided: {e}")
        sys.exit(1)

    print(f"[*] Sender Address:  {sender_acc.address}")
    print(f"[*] RPC Endpoint:    {args.rpc}")
    print(f"[*] Chain ID:        {CHAIN_ID} (PISO Chain)")
    print("========================================================")

    recipients = []
    if args.to:
        recipients.append(args.to.strip())
    elif args.list:
        recipients = [a.strip() for a in args.list.split(",") if a.strip()]
    else:
        # Default demo distribution to dev address if no args specified
        recipients = ["0x4C2B0DDA95754015B2DAF8A3302adbcf2fE248dc"]
        print(f"[*] No recipient specified. Using default demo recipient: {recipients[0]}")

    # Validate addresses
    valid_recipients = []
    for addr in recipients:
        if is_address(addr):
            valid_recipients.append(addr)
        else:
            print(f"[!] Warning: Invalid EVM address skipped: {addr}")

    if not valid_recipients:
        print("[!] No valid recipient addresses to process.")
        sys.exit(1)

    print(f"\n[+] Preparing distribution of {args.amount} PISO to {len(valid_recipients)} recipient(s)...\n")

    current_nonce = get_nonce(args.rpc, sender_acc.address)

    success_count = 0
    for idx, recipient in enumerate(valid_recipients):
        print(f"[{idx + 1}/{len(valid_recipients)}] Sending {args.amount} PISO -> {recipient} ...")
        tx_hash = send_native_piso(args.rpc, sender_acc, recipient, args.amount, current_nonce)

        if tx_hash and isinstance(tx_hash, str) and tx_hash.startswith("0x"):
            print(f"    ✓ Success! Tx Hash: {tx_hash}")
            success_count += 1
            current_nonce += 1
        else:
            print(f"    [!] Transfer output: {tx_hash}")

    print("\n========================================================")
    print(f"[SUMMARY] Transferred {args.amount * success_count} PISO across {success_count}/{len(valid_recipients)} successful transaction(s).")
    print("========================================================")

if __name__ == "__main__":
    main()
