#!/usr/bin/env python3
"""
PISO Agent OS — AutoGen Multi-Agent Swarm Consensus Example
Demonstrates a multi-agent swarm (Planner, Coder, Verifier) executing task escrows on PISO Chain.
"""

import time
import hashlib
import json


class SwarmAgent:
    def __init__(self, role, address):
        self.role = role
        self.address = address

    def vote(self, proposal):
        print(f"    - [{self.role}] Voted APPROVED for Proposal #{proposal['id']}")
        return True


def run_swarm_consensus():
    print("=" * 70)
    print("PISO Agent OS -- AutoGen Multi-Agent Swarm Consensus")
    print("=" * 70)

    agents = [
        SwarmAgent("Planner-Agent", "0xfae2294509bf3576E515aB5f4BDF218c3A3F48D6"),
        SwarmAgent("Coder-Agent",   "0x31c527c5D52e41d952b2F75d87e6fE1d4Df4da1c"),
        SwarmAgent("Verifier-Agent","0xf60740aA7D091f80456282E6768Cf3c53E0988b0")
    ]

    proposal = {
        "id": 2042,
        "title": "Automated Cross-Chain Bridge Lock Verification",
        "escrow_piso": "500 PISO",
        "target_contract": "0x0000000000000000000000000000000000001004"
    }

    print(f"\n[*] Swarm Proposal Dispatched: '{proposal['title']}' ({proposal['escrow_piso']})")

    votes = [a.vote(proposal) for a in agents]

    if sum(votes) >= 2:
        proof = hashlib.sha256(json.dumps(proposal).encode('utf-8')).hexdigest()
        print(f"\n[+] Consensus Reached! (3/3 Votes Approved)")
        print(f"[+] Task Escrow Settled: 500 PISO Released to Swarm Address")
        print(f"[+] On-Chain Proof SHA-256: {proof}")


if __name__ == "__main__":
    run_swarm_consensus()
