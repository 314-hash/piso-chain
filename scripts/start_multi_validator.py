#!/usr/bin/env python3
"""
PISO Chain Multi-Validator Automated Launcher
Runs key generator, initializes node databases, and launches docker cluster.
"""

import os
import subprocess
import sys

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)

    print("========================================================")
    print("      PISO CHAIN MULTI-VALIDATOR CLUSTER LAUNCHER       ")
    print("========================================================")

    # 1. Run cluster setup script
    setup_script = os.path.join(script_dir, "setup_multi_validator_cluster.py")
    print("\n[Step 1] Provisioning 3-Node Validator Keystores & Genesis...")
    res = subprocess.run([sys.executable, setup_script], cwd=root_dir)
    if res.returncode != 0:
        print("[!] Failed to provision multi-validator genesis and keys.")
        sys.exit(1)

    # 2. Check docker-compose availability
    compose_file = os.path.join(root_dir, "docker-compose.multi-validator.yml")
    print("\n[Step 2] Launching Multi-Validator Cluster via Docker Compose...")
    
    try:
        cmd = ["docker", "compose", "-f", compose_file, "up", "-d"]
        print(f"Executing: {' '.join(cmd)}")
        res = subprocess.run(cmd, cwd=root_dir)
        if res.returncode != 0:
            # Fallback to docker-compose legacy command
            cmd = ["docker-compose", "-f", compose_file, "up", "-d"]
            res = subprocess.run(cmd, cwd=root_dir)

        if res.returncode == 0:
            print("\n========================================================")
            print("[SUCCESS] PISO Multi-Validator Chain is online!")
            print("  - RPC Endpoint:       http://localhost:8545")
            print("  - WebSocket RPC:       ws://localhost:8546")
            print("  - Block Explorer:      http://localhost:8080")
            print("  - Gateways:            http://localhost:80 / https://localhost:443")
            print("  - Active Validators:   3 Signer Nodes (BSC Parlia PoSA)")
            print("========================================================")
        else:
            print("[!] Docker Compose failed to spin up containers. Ensure Docker Desktop is running.")
    except Exception as e:
        print(f"[!] Error starting Docker cluster: {e}")

if __name__ == "__main__":
    main()
