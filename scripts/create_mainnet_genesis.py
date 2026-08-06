#!/usr/bin/env python3
"""
PISO Chain Production Mainnet Genesis Generator
Provisions Mainnet Chain ID (2026001), initial 3 to 7 Mainnet validator addresses,
100 Billion $PISO genesis supply distribution, system contract allocations, and extraData consensus signers.
"""

import os
import sys
import json

MAINNET_CHAIN_ID = 2026001
TOTAL_GENESIS_SUPPLY_PISO = 100_000_000_000 # 100 Billion PISO

def build_parlia_extradata(validator_addresses):
    vanity = "0" * 64
    val_hex = "".join([addr.lower().replace("0x", "") for addr in validator_addresses])
    seal = "0" * 130
    return "0x" + vanity + val_hex + seal

def piso_to_wei_hex(piso_amount):
    wei_val = int(piso_amount * (10 ** 18))
    return hex(wei_val)

def create_mainnet_genesis(validators, treasury_addr="0x1821F246a27287a2187E1D634B8883030fA14731", initial_allocations=None):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    genesis_dir = os.path.join(root_dir, "genesis")
    os.makedirs(genesis_dir, exist_ok=True)

    extradata = build_parlia_extradata(validators)

    alloc = {
        # Precompiled System Contracts
        "0x0000000000000000000000000000000000001000": { "balance": "0x0" }, # PISOValidatorSet
        "0x0000000000000000000000000000000000001001": { "balance": "0x0" }, # PISOSlashIndicator
        "0x0000000000000000000000000000000000001002": { "balance": "0x0" }, # PISOQuantumSecurity
        "0x0000000000000000000000000000000000001003": { "balance": piso_to_wei_hex(1_000_000) }, # PISOProofOfWork Reward Vault (1M PISO)
    }

    # Fund Mainnet Genesis Signers with initial operational balance (100,000 PISO minimum stake)
    per_validator_stake = 100_000 # 100k PISO each
    for v in validators:
        alloc[v] = {
            "balance": piso_to_wei_hex(per_validator_stake)
        }

    # Fund Treasury with remaining Genesis Allocations (100 Billion total supply)
    allocated_so_far = per_validator_stake * len(validators)
    treasury_balance_piso = TOTAL_GENESIS_SUPPLY_PISO - allocated_so_far
    alloc[treasury_addr] = {
        "balance": piso_to_wei_hex(treasury_balance_piso)
    }

    # Additional custom allocations if provided
    if initial_allocations:
        for addr, amount_wei_hex in initial_allocations.items():
            alloc[addr] = { "balance": amount_wei_hex }

    genesis_data = {
        "config": {
            "chainId": MAINNET_CHAIN_ID,
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
            "terminalTotalDifficulty": 0,
            "parlia": {
                "period": 3,
                "epoch": 200
            }
        },
        "nonce": "0x0",
        "timestamp": "0x0",
        "extraData": extradata,
        "gasLimit": "0x1C9C380", # 30,000,000 Gas Limit
        "difficulty": "0x1",
        "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "alloc": alloc,
        "number": "0x0",
        "gasUsed": "0x0",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "baseFeePerGas": "0x3B9ACA00"
    }

    out_file = os.path.join(genesis_dir, "genesis_mainnet.json")
    with open(out_file, "w") as f:
        json.dump(genesis_data, f, indent=2)

    print("========================================================")
    print("     PISO CHAIN PRODUCTION MAINNET GENESIS CREATOR      ")
    print("========================================================")
    print(f"[+] Chain ID:                {MAINNET_CHAIN_ID}")
    print(f"[+] Total Genesis Supply:    {TOTAL_GENESIS_SUPPLY_PISO:,} PISO (100 Billion)")
    print(f"[+] Initial Signer Count:    {len(validators)} Genesis Signers")
    print(f"[+] Genesis Output File:     {out_file}")
    print("========================================================")
    return out_file

if __name__ == "__main__":
    mainnet_validators = [
        "0x4C2B0DDA95754015B2DAF8A3302adbcf2fE248dc",
        "0x50D06b3ad935b9502BCe53b501B233BdFc87A355",
        "0x19b183909fb264a09672E40D65C64f914ff26b41"
    ]
    create_mainnet_genesis(mainnet_validators)
