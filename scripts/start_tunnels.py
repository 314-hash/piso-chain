#!/usr/bin/env python3
"""
PISO Chain Free Public Subdomain Launcher (using LocalTunnel)
Exposes:
  - HTTP RPC (:8545)  -> https://piso-rpc-dev.loca.lt
  - WS RPC (:8546)    -> https://piso-ws-dev.loca.lt
  - Explorer (:8080)  -> https://piso-explorer-dev.loca.lt
"""

import subprocess
import sys
import shutil

def check_npx():
    if not shutil.which("npx"):
        print("[!] Error: 'npx' is required to run localtunnel.")
        print("    Please install Node.js (https://nodejs.org) to use this tool.")
        sys.exit(1)

def launch_tunnel(port, subdomain, service_name):
    cmd = ["npx", "localtunnel", "--port", str(port), "--subdomain", subdomain]
    print(f"[*] Starting tunnel for {service_name} (Port {port}) on subdomain: {subdomain}.loca.lt ...")
    return subprocess.Popen(cmd, shell=True)


if __name__ == "__main__":
    check_npx()
    
    prefix = "piso"
    
    proc_rpc = launch_tunnel(8545, f"{prefix}-rpc-dev", "HTTP RPC")
    proc_ws = launch_tunnel(8546, f"{prefix}-ws-dev", "WebSocket RPC")
    proc_exp = launch_tunnel(8080, f"{prefix}-explorer-dev", "Block Explorer")
    
    print("\n[+] All 3 tunnels requested!")
    print("    - HTTP RPC URL:      https://piso-rpc-dev.loca.lt")
    print("    - WebSocket RPC URL: wss://piso-ws-dev.loca.lt")
    print("    - Block Explorer:    https://piso-explorer-dev.loca.lt\n")
    print("Press Ctrl+C to stop all tunnels.")
    
    try:
        proc_rpc.wait()
        proc_ws.wait()
        proc_exp.wait()
    except KeyboardInterrupt:
        print("\n[*] Stopping tunnels...")
        proc_rpc.terminate()
        proc_ws.terminate()
        proc_exp.terminate()
        print("[+] Done.")
