#!/usr/bin/env python3
"""
PISO Chain Automated Proof of Work (PoW) Miner Worker
Mines nonces for network challenges or continuous PoW block heartbeat tasks.
"""

import sys
import os
import time
import argparse
import json

script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(script_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from core.pow import PoWEngine

def main():
    parser = argparse.ArgumentParser(description="PISO Chain Standalone PoW Miner Worker")
    parser.add_argument("--challenge", type=str, default="0x" + "ab" * 32, help="32-byte target challenge hex")
    parser.add_argument("--miner", type=str, default="0x90F79bf6EB2c4f870365E785982E1f101E93b906", help="Miner wallet address")
    parser.add_argument("--difficulty", type=int, default=16, help="Target difficulty zero-bits")
    parser.add_argument("--iterations", type=int, default=10000000, help="Max hash iterations per batch")
    parser.add_argument("--algo", type=str, choices=["keccak256", "sha256"], default="keccak256", help="Mining hash algorithm")
    args = parser.parse_args()

    print("========================================================")
    print("        PISO CHAIN AUTOMATED POW MINER WORKER           ")
    print("========================================================")
    print(f"[*] Miner Address:     {args.miner}")
    print(f"[*] Target Challenge:  {args.challenge[:18]}...")
    print(f"[*] Target Difficulty: {args.difficulty} zero bits")
    print(f"[*] Algorithm:         {args.algo.upper()}")
    print("========================================================")

    engine = PoWEngine(algo=args.algo)

    # 1. Benchmark local hashing speed
    print("\n[*] Measuring local CPU hashing rate...")
    bench = engine.benchmark(duration_seconds=0.5)
    print(f"[+] Local Hashrate: {bench['hashrate_hs']} H/s ({bench['hashrate_khs']} KH/s)")

    # 2. Execute mining
    print(f"\n[*] Mining nonce for difficulty {args.difficulty} bits...")
    res = engine.mine(
        challenge_hash=args.challenge,
        miner_address=args.miner,
        difficulty_bits=args.difficulty,
        max_iterations=args.iterations
    )

    if res["success"]:
        print("\n========================================================")
        print("          [SUCCESS] PROOF OF WORK SOLUTION FOUND!       ")
        print("========================================================")
        print(f"  • Mined Nonce:       {res['nonce']}")
        print(f"  • Proof Hash:        {res['hash']}")
        print(f"  • Time Elapsed:      {res['time_seconds']}s")
        print(f"  • Hashes Computed:   {res['hashes_computed']}")
        print(f"  • Average Hashrate:  {res['hashrate_hs']} H/s")
        print("========================================================")
        
        # Verify solution
        verified = engine.verify_proof(args.challenge, res['nonce'], args.miner, args.difficulty)
        print(f"[*] On-Chain Verification Simulation: {'PASSED' if verified else 'FAILED'}")
    else:
        print("\n[!] Failed to find valid nonce within max iterations limit.")

if __name__ == "__main__":
    main()
