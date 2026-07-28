#!/usr/bin/env python3
"""
PISO Chain Production Mainnet Genesis Generator
Provisions Mainnet Chain ID (2026001), initial 7-21 Mainnet validator addresses,
precompiled system contract allocations, and extraData consensus signers.
"""

import os
import sys
import json
from eth_account import Account

MAINNET_CHAIN_ID = 2026001

def build_parlia_extradata(validator_addresses):
    vanity = "0" * 64
    val_hex = "".join([addr.lower().replace("0x", "") for addr in validator_addresses])
    seal = "0" * 130
    return "0x" + vanity + val_hex + seal

def create_mainnet_genesis(validators, initial_allocations=None):
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
    }

    # Fund Mainnet Validators with initial stake (100,000 PISO min)
    for v in validators:
        alloc[v] = {
            "balance": "0x52B7D2DCC80CD2E4000000" # 100,000,000 PISO Initial Mainnet Supply
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
            "parlia": {
                "period": 3,
                "epoch": 200
            }
        },
        "nonce": "0x0",
        "timestamp": "0x685D2C00", # Mainnet Launch Timestamp
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

    print(f"[+] Mainnet Genesis File generated at: {out_file}")
    return out_file

if __name__ == "__main__":
    mainnet_validators = [
        "0xB5A772355e12CA975C175C9a7CFBD48BBEE482D8",
        "0xD15756BA4D4cc40A8aA4f772117a2E991C7705Ad",
        "0x90BdAF5a0890b4Cc21FB3081d1D8c7121EE6a7d2"
    ]
    create_mainnet_genesis(mainnet_validators)
