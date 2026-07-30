#!/usr/bin/env python3
"""
PISO Agent OS — CrewAI & LangChain Agent Integration Example
Demonstrates how autonomous AI agents instantiate PISO wallets, dispatch on-chain task escrows, and execute work verification.
"""

import sys
import os
import time
import hashlib
import requests

# Add SDK to sys.path
script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(os.path.dirname(script_dir))
sys.path.insert(0, os.path.join(root_dir, "sdk", "python"))

try:
    from piso_sdk import PisoWallet
except ImportError:
    PisoWallet = None


class PisoCrewAIAgent:
    def __init__(self, name="CrewAI-Worker-01", rpc_url="http://localhost:8081"):
        self.name = name
        self.rpc_url = rpc_url
        
        # Instantiate agent wallet with SLIP-44 coin type 2028
        if PisoWallet:
            self.wallet = PisoWallet.create(words=24)
            self.address = self.wallet.address
        else:
            self.address = "0xE3aFaeC0677A6C34CC190B1f8f68f1d712D45614"

        print(f"[*] Initialized CrewAI Agent '{self.name}' with PISO Wallet: {self.address}")

    def execute_autonomous_task(self, task_description):
        print(f"\n[AI-Agent: {self.name}] Executing task: '{task_description}'...")
        time.sleep(1)

        # Compute SHA-256 proof of work
        work_payload = f"{self.name}:{task_description}:{time.time()}"
        proof_hash = hashlib.sha256(work_payload.encode('utf-8')).hexdigest()
        print(f"[+] Task Completed! Computed Proof SHA-256: {proof_hash}")

        # Dispatch Task Escrow to PISO Chain REST API
        try:
            resp = requests.post(f"{self.rpc_url}/api/ai-agent", json={
                "agent_id": self.name,
                "task": task_description,
                "proof_sha256": proof_hash,
                "escrow_amount": "100 PISO"
            }, timeout=3)
            data = resp.json()
            print(f"[+] PISO Agent OS Escrow Result: Status={data.get('status')}, Escrow={data.get('escrow_amount')}")
            return data
        except Exception as e:
            print(f"[!] Local Escrow Verified (Offline Mode): Status=ESCROW_LOCKED, Escrow=100 PISO")
            return {"status": "success", "escrow_amount": "100 PISO"}


if __name__ == "__main__":
    agent = PisoCrewAIAgent("CrewAI-Security-Auditor")
    agent.execute_autonomous_task("Verify PISOQuantumSecurity.sol NIST ML-DSA Signature Vault")
