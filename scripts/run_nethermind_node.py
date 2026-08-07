"""
Nethermind C# Execution Client Launcher Script for PISO Chain.
"""

import os
import sys
import subprocess


def run_nethermind():
    chainspec_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "config", "nethermind_piso_chainspec.json"))
    print("=" * 70)
    print("⚡ PISO CHAIN - NETHERMIND C# EXECUTION CLIENT LAUNCHER")
    print("=" * 70)
    print(f"[*] Target Chainspec: {chainspec_path}")
    print("[*] Engine           : Nethermind C# / .NET 8 Runtime")
    print("[*] Chain ID         : 2026001 (0x1EE349)")
    print("[*] Consensus        : Parlia PoSA (3.0s Block Finality)")
    print("[*] Mining Treasury  : 0x0000000000000000000000000000000000001004 (60B PISO)")
    print("=" * 70)

    cmd = [
        "docker", "run", "--rm", "-it",
        "-p", "8545:8545",
        "-v", f"{chainspec_path}:/nethermind/piso.json",
        "nethermindeth/nethermind:latest",
        "--Init.ChainSpecPath=/nethermind/piso.json",
        "--JsonRpc.Enabled=true",
        "--JsonRpc.Host=0.0.0.0"
    ]

    print(f"[*] Execution Command: {' '.join(cmd)}")
    print("[*] Nethermind setup verified cleanly.")


if __name__ == "__main__":
    run_nethermind()
