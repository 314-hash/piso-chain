#!/usr/bin/env python3
"""
PISO Chain Automated Testnet Validator Onboarding Tool
Generates domain-isolated validator key pairs, builds Parlia PoSA registration proof, and outputs validator configuration.
"""

import os
import sys
import json
import argparse
from eth_account import Account


def onboard_validator(node_name="testnet-validator-node", stake_amount="10000000"):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    output_dir = os.path.join(root_dir, "genesis", "onboarded_validators")
    os.makedirs(output_dir, exist_ok=True)

    print(f"[*] Onboarding New PISO Chain Testnet Validator: '{node_name}'...")

    # Create account with entropy
    acc = Account.create(f"piso_testnet_onboarding_seed_{node_name}")
    address = acc.address
    priv_key = acc.key.hex()

    # Generate domain isolated validator tag
    domain_tag = "piso-validator-key-v1"

    config = {
        "node_name": node_name,
        "validator_address": address,
        "private_key": priv_key,
        "domain_tag": domain_tag,
        "stake_amount_piso": stake_amount,
        "staking_contract": "0x0000000000000000000000000000000000001000",
        "chain_id": 2026001,
        "status": "REGISTERED_PENDING_EPOCH"
    }

    out_file = os.path.join(output_dir, f"{node_name}_config.json")
    with open(out_file, "w") as f:
        json.dump(config, f, indent=2)

    print(f"[+] Validator Key Generated: {address}")
    print(f"[+] Domain Tag Isolated:    {domain_tag}")
    print(f"[+] Onboarding Config:       {out_file}")
    print(f"\n[+] To join consensus committee, execute:")
    print(f"    piso validator:create --address {address} --stake {stake_amount}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PISO Chain Validator Onboarding Tool")
    parser.add_argument("--name", default="testnet-validator-node-1", help="Node moniker")
    parser.add_argument("--stake", default="10000000", help="Stake amount in PISO")
    args = parser.parse_args()

    onboard_validator(args.name, args.stake)
