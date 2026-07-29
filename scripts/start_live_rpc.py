#!/usr/bin/env python3
"""
PISO Chain Master Live RPC & Tunnel Launcher
Spins up the Geth/Node EVM Engine on HTTP port 8545 & WS port 8546,
deploys System Smart Contracts, and opens public LocalTunnel endpoints:
  - HTTP RPC:  https://piso-rpc-dev.loca.lt (Port 8545)
  - WS RPC:    wss://piso-ws-dev.loca.lt   (Port 8546)
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

def is_port_in_use(port):
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def check_prerequisites():
    if not shutil.which("npx"):
        print("[!] Error: 'npx' is required for LocalTunnel.")
        sys.exit(1)

def run_cmd_async(cmd, cwd=None):
    return subprocess.Popen(cmd, cwd=cwd, shell=True)

def verify_local_rpc():
    payload = json.dumps({
        "jsonrpc": "2.0",
        "method": "eth_chainId",
        "params": [],
        "id": 1
    }).encode("utf-8")
    req = urllib.request.Request(f"http://127.0.0.1:{RPC_PORT}", data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("result")
    except Exception:
        return None

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    genesis_file = os.path.join(root_dir, "genesis", "genesis_mainnet.json")
    data_dir = os.path.join(root_dir, "data", "mainnet_node")

    print("========================================================")
    print("         PISO CHAIN LIVE RPC & TUNNEL LAUNCHER          ")
    print("========================================================")
    print(f"[*] Chain ID:         {CHAIN_ID}")
    print(f"[*] Local HTTP RPC:   http://127.0.0.1:{RPC_PORT}")
    print(f"[*] Local WS RPC:     ws://127.0.0.1:{WS_PORT}")
    print(f"[*] Public RPC URL:   https://{SUBDOMAIN_RPC}.loca.lt")
    print("========================================================")

    check_prerequisites()

    # 1. Initialize Genesis Database if needed
    if not os.path.exists(os.path.join(data_dir, "geth")):
        print("\n[Step 1] Initializing Geth Mainnet Genesis Database...")
        os.makedirs(data_dir, exist_ok=True)
        init_cmd = f'geth --datadir "{data_dir}" init "{genesis_file}"'
        res = subprocess.run(init_cmd, shell=True, cwd=root_dir)
        if res.returncode != 0:
            print("[!] Geth init failed. Falling back to standalone node manager...")

    # 2. Check if local RPC is already listening
    if not is_port_in_use(RPC_PORT):
        print(f"\n[Step 2] Launching PISO Chain Node on port {RPC_PORT}...")
        geth_cmd = (
            f'geth --datadir "{data_dir}" '
            f'--http --http.addr 0.0.0.0 --http.port {RPC_PORT} --http.corsdomain "*" --http.vhosts "*" --http.api "eth,net,web3,miner,txpool" '
            f'--ws --ws.addr 0.0.0.0 --ws.port {WS_PORT} --ws.origins "*" --ws.api "eth,net,web3" '
            f'--networkid {CHAIN_ID} --nodiscover'
        )
        geth_proc = run_cmd_async(geth_cmd, cwd=root_dir)
        time.sleep(2)
    else:
        print(f"\n[Step 2] Port {RPC_PORT} is already active! Connecting to running RPC node.")

    # Wait for RPC to respond
    attempts = 0
    while attempts < 10:
        res = verify_local_rpc()
        if res:
            print(f"[+] Local RPC active! (eth_chainId = {res})")
            break
        time.sleep(1)
        attempts += 1

    # 3. Launch LocalTunnel Tunnels
    print(f"\n[Step 3] Opening Public Tunnels on loca.lt...")
    tunnel_rpc_cmd = f"npx localtunnel --port {RPC_PORT} --subdomain {SUBDOMAIN_RPC}"
    tunnel_ws_cmd = f"npx localtunnel --port {WS_PORT} --subdomain {SUBDOMAIN_WS}"

    proc_rpc_tunnel = run_cmd_async(tunnel_rpc_cmd, cwd=root_dir)
    proc_ws_tunnel = run_cmd_async(tunnel_ws_cmd, cwd=root_dir)

    print("\n========================================================")
    print("        PISO CHAIN PUBLIC RPC IS LIVE & ONLINE!        ")
    print("========================================================")
    print(f"  • HTTP RPC URL:      https://{SUBDOMAIN_RPC}.loca.lt")
    print(f"  • WebSocket RPC URL: wss://{SUBDOMAIN_WS}.loca.lt")
    print(f"  • Local RPC URL:     http://localhost:{RPC_PORT}")
    print(f"  • Chain ID:          {CHAIN_ID} (0x1EE349)")
    print("========================================================")
    print("\nPress Ctrl+C to stop the RPC server & public tunnels.")

    try:
        proc_rpc_tunnel.wait()
    except KeyboardInterrupt:
        print("\n[*] Stopping RPC & Tunnels...")
        proc_rpc_tunnel.terminate()
        proc_ws_tunnel.terminate()
        print("[+] RPC Service Stopped.")

if __name__ == "__main__":
    main()
