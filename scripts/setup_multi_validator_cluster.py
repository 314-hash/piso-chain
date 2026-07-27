#!/usr/bin/env python3
"""
PISO Chain Multi-Validator Cluster Provisioner
Generates keys, keystores, genesis extraData, and directory layouts for a 3-Validator PoSA Network.
"""

import os
import sys
import json
from eth_account import Account

# Standard deterministic passwords for local multi-validator setup (Change in production)
PASSWORD = "[Jhanus1986!!]"

def build_parlia_extradata(validator_addresses):
    """
    Constructs extraData header for BSC Parlia PoSA:
    - 32 bytes vanity prefix (64 hex zeroes)
    - 20 bytes per validator address
    - 65 bytes signature suffix (130 hex zeroes)
    """
    vanity = "0" * 64
    val_hex = "".join([addr.lower().replace("0x", "") for addr in validator_addresses])
    seal = "0" * 130
    return "0x" + vanity + val_hex + seal

def generate_multi_validator_cluster(num_validators=3, chain_id=2026001):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    genesis_dir = os.path.join(root_dir, "genesis")
    docker_dir = os.path.join(root_dir, "docker")
    
    os.makedirs(genesis_dir, exist_ok=True)
    os.makedirs(docker_dir, exist_ok=True)

    validators_info = []

    print(f"[*] Generating keys and keystores for {num_validators} Validator Nodes...")

    for i in range(1, num_validators + 1):
        val_name = f"validator_{i}"
        val_data_dir = os.path.join(docker_dir, "data", val_name, "keystore")
        os.makedirs(val_data_dir, exist_ok=True)

        acc = Account.create(f"piso_chain_validator_entropy_seed_{i}")
        priv_key = acc.key.hex()
        address = acc.address

        # Save password file
        pass_path = os.path.join(docker_dir, "data", val_name, "password.txt")
        with open(pass_path, "w") as f:
            f.write(PASSWORD + "\n")

        # Encrypt keystore file
        encrypted = acc.encrypt(PASSWORD)
        key_filename = f"UTC--2026-07-27T00-00-00.000000000Z--{address.lower().replace('0x', '')}"
        key_file_path = os.path.join(val_data_dir, key_filename)

        with open(key_file_path, "w") as f:
            json.dump(encrypted, f, indent=2)

        validators_info.append({
            "id": i,
            "name": val_name,
            "address": address,
            "priv_key": priv_key,
            "keystore": key_file_path,
            "password_file": pass_path
        })
        print(f"    - Validator {i}: {address}")

    # Build Genesis JSON with all validator addresses in extraData
    val_addrs = [v["address"] for v in validators_info]
    extradata = build_parlia_extradata(val_addrs)

    alloc = {
        "0x0000000000000000000000000000000000001000": {
            "balance": "0x0" # ValidatorSet contract reserved address
        }
    }

    # Fund all initial validators with 10,000,000 PISO each
    for v in val_addrs:
        alloc[v] = {
            "balance": "0x10000000000000000000000000000"
        }

    # Also fund default dev wallet
    alloc["0xE3aFaeC0677A6C34CC190B1f8f68f1d712D45614"] = {
        "balance": "0x10000000000000000000000000000"
    }

    genesis_data = {
        "config": {
            "chainId": chain_id,
            "homesteadBlock": 0,
            "eip150Block": 0,
            "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "eip155Block": 0,
            "eip158Block": 0,
            "byzantiumBlock": 0,
            "constantinopleBlock": 0,
            "petersburgBlock": 0,
            "istanbulBlock": 0,
            "berlinBlock": 0,
            "londonBlock": 0,
            "parlia": {
                "period": 3,
                "epoch": 200
            }
        },
        "nonce": "0x0",
        "timestamp": "0x0",
        "extraData": extradata,
        "gasLimit": "0x1C9C380",
        "difficulty": "0x1",
        "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "alloc": alloc,
        "number": "0x0",
        "gasUsed": "0x0",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "baseFeePerGas": "0x3B9ACA00"
    }

    genesis_path = os.path.join(genesis_dir, "genesis_multi_validator.json")
    with open(genesis_path, "w") as f:
        json.dump(genesis_data, f, indent=2)

    print(f"\n[+] Multi-Validator Genesis generated successfully at: {genesis_path}")

    # Output node config metadata summary
    summary_path = os.path.join(genesis_dir, "cluster_nodes.json")
    with open(summary_path, "w") as f:
        json.dump(validators_info, f, indent=2)

    print(f"[+] Cluster metadata saved at: {summary_path}")

if __name__ == "__main__":
    generate_multi_validator_cluster(3)
