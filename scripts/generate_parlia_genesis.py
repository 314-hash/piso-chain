#!/usr/bin/env python3
"""
PISO Chain BSC Parlia PoSA Mainnet Genesis Generator
Generates genesis file with dynamic validator set (7 validator slots default)
"""

import sys
import json

def build_parlia_extradata(validators):
    # 32 bytes vanity header (64 hex zeros)
    vanity = "0" * 64
    
    # 20 bytes per validator address
    val_hex = ""
    for addr in validators:
        clean_addr = addr.lower().replace("0x", "")
        if len(clean_addr) != 40:
            raise ValueError(f"Invalid Ethereum address: {addr}")
        val_hex += clean_addr
        
    # 65 bytes validator seal suffix (130 hex zeros)
    seal = "0" * 130
    
    return "0x" + vanity + val_hex + seal

def create_parlia_genesis(validators, chain_id=2026001):
    extradata = build_parlia_extradata(validators)
    
    alloc = {
        # System validator contract address on BSC standard
        "0x0000000000000000000000000000000000001000": {
            "balance": "0x0"
        }
    }
    
    # Fund initial validators
    for v in validators:
        alloc[v] = {
            "balance": "0x10000000000000000000000000000"  # 10,000,000 PISO
        }
        
    genesis = {
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
    
    return genesis

import os

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_parlia_genesis.py <validator_address1> [validator2...]")
        sys.exit(1)
        
    validators = sys.argv[1:]
    gen = create_parlia_genesis(validators)
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    piso_dir = os.path.dirname(script_dir)
    genesis_dir = os.path.join(piso_dir, "genesis")
    os.makedirs(genesis_dir, exist_ok=True)
    out_file = os.path.join(genesis_dir, "genesis_parlia.json")
    
    with open(out_file, "w") as f:
        json.dump(gen, f, indent=2)
        
    print(f"[+] Generated BSC Parlia Genesis file at {out_file} with {len(validators)} validator(s)!")

