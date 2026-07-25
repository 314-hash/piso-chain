#!/usr/bin/env python3
"""
PISO Chain Genesis ExtraData Generator for Clique PoA
Usage:
    python generate_extradata.py 0x1111111111111111111111111111111111111111 [0x2222...]
"""
import sys

def build_clique_extradata(validators):
    # 32 bytes vanity header (64 hex zeros)
    vanity = "0" * 64
    
    # 20 bytes per validator address
    val_hex = ""
    for addr in validators:
        clean_addr = addr.lower().replace("0x", "")
        if len(clean_addr) != 40:
            raise ValueError(f"Invalid Ethereum address length: {addr}")
        val_hex += clean_addr
        
    # 65 bytes validator seal suffix (130 hex zeros)
    seal = "0" * 130
    
    return "0x" + vanity + val_hex + seal

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_extradata.py <validator_address1> [validator_address2...]")
        sys.exit(1)
        
    addrs = sys.argv[1:]
    extradata = build_clique_extradata(addrs)
    print(f"\nGenerated ExtraData for Clique PoA ({len(addrs)} validator(s)):")
    print(extradata)
