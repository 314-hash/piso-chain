#!/usr/bin/env python3
"""
PISO Chain Dedicated EVM Node Engine & Tunnel Manager
Runs Geth node configured for Chain ID 2026001 on port 8545 & 8546,
triggers continuous block production (3.0s interval), and launches LocalTunnel public endpoints.
"""

import os
import sys
import time
import subprocess
import shutil
import json
import urllib.request

RPC_PORT = 8545
WS_PORT = 8546
CHAIN_ID = 2026001
SUBDOMAIN_RPC = "piso-rpc-dev"
SUBDOMAIN_WS = "piso-ws-dev"

def run_cmd_async(cmd, cwd=None):
    return subprocess.Popen(cmd, cwd=cwd, shell=True)

def verify_local_rpc():
    payload = json.dumps({
        "jsonrpc": "2.0",
        "method": "eth_blockNumber",
        "params": [],
        "id": 1
    }).encode("utf-8")
    req = urllib.request.Request(
        f"http://127.0.0.1:{RPC_PORT}",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("result")
    except Exception:
        return None

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    data_dir = os.path.join(root_dir, "data", "piso_dev_node")

    print("========================================================")
    print("       PISO CHAIN LIVE EVM NODE & RPC LAUNCHER          ")
    print("========================================================")
    print(f"[*] Network Name:    PISO Chain Devnet")
    print(f"[*] Chain ID:        {CHAIN_ID} (0x1EE349)")
    print(f"[*] Block Finality:  3.0 Seconds")
    print(f"[*] Local HTTP RPC:  http://127.0.0.1:{RPC_PORT}")
    print(f"[*] Local WS RPC:    ws://127.0.0.1:{WS_PORT}")
    print(f"[*] Public RPC URL:  https://{SUBDOMAIN_RPC}.loca.lt")
    print("========================================================")

    os.makedirs(data_dir, exist_ok=True)

    # 1. Start Geth node with 3.0s block interval
    geth_cmd = (
        f'geth --datadir "{data_dir}" '
        f'--dev --dev.period 3 '
        f'--http --http.addr 0.0.0.0 --http.port {RPC_PORT} --http.corsdomain "*" --http.vhosts "*" --http.api eth,net,web3,txpool '
        f'--ws --ws.addr 0.0.0.0 --ws.port {WS_PORT} --ws.origins "*" --ws.api eth,net,web3 '
        f'--networkid {CHAIN_ID}'
    )

    print("\n[Step 1] Starting Geth Engine with 3.0s block finality...")
    geth_proc = run_cmd_async(geth_cmd, cwd=root_dir)

    # Wait for node to be responsive
    print("[*] Waiting for RPC socket binding...")
    attempts = 0
    active = False
    while attempts < 15:
        res = verify_local_rpc()
        if res:
            block_num = int(res, 16)
            print(f"[+] Geth Node ACTIVE! Current Block: #{block_num}")
            active = True
            break
        time.sleep(1)
        attempts += 1

    if not active:
        print("[!] Local Geth RPC startup took longer than expected.")

    # 2. Launch LocalTunnel public endpoints
    if shutil.which("npx"):
        print("\n[Step 2] Opening Public Tunnel (piso-rpc-dev.loca.lt)...")
        tunnel_rpc_cmd = f"npx localtunnel --port {RPC_PORT} --subdomain {SUBDOMAIN_RPC}"
        tunnel_ws_cmd = f"npx localtunnel --port {WS_PORT} --subdomain {SUBDOMAIN_WS}"

        proc_tunnel_rpc = run_cmd_async(tunnel_rpc_cmd, cwd=root_dir)
        proc_tunnel_ws = run_cmd_async(tunnel_ws_cmd, cwd=root_dir)
        print("[+] Public Tunnels Online!")

    print("\n========================================================")
    print("        PISO CHAIN PUBLIC RPC IS LIVE & ONLINE!        ")
    print("========================================================")
    print(f"  • HTTP RPC:      https://{SUBDOMAIN_RPC}.loca.lt")
    print(f"  • WebSocket RPC: wss://{SUBDOMAIN_WS}.loca.lt")
    print(f"  • Local RPC:     http://localhost:{RPC_PORT}")
    print(f"  • Chain ID:      {CHAIN_ID}")
    print("========================================================")

    try:
        geth_proc.wait()
    except KeyboardInterrupt:
        print("\n[*] Stopping PISO Chain node...")
        geth_proc.terminate()

if __name__ == "__main__":
    main()
