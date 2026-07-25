#!/usr/bin/env python3
"""
PISO Chain Validator Keystore Generator
Generates encrypted keystore JSON and password file for validator 0xE3aFaeC0677A6C34CC190B1f8f68f1d712D45614
"""

import os
import sys
from eth_account import Account

VALIDATOR_PRIVKEY = "a42ee484b0bb3b2b4ef96e29ee366ca7151f67c55aabe49ede2bda79f4ae6760" # Dev private key for 0xE3aFaeC0677A6C34CC190B1f8f68f1d712D45614 (or generate new)
PASSWORD = "[Jhanus1986!!]"

if __name__ == "__main__":
    acc = Account.from_key(VALIDATOR_PRIVKEY)
    print(f"Validator Address: {acc.address}")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    piso_dir = os.path.dirname(script_dir)
    keystore_dir = os.path.join(piso_dir, "docker", "keystore")
    genesis_dir = os.path.join(piso_dir, "genesis")
    
    os.makedirs(keystore_dir, exist_ok=True)
    os.makedirs(genesis_dir, exist_ok=True)
    
    # Save password file
    pass_file = os.path.join(genesis_dir, "password.txt")
    with open(pass_file, "w") as f:
        f.write(PASSWORD + "\n")
        
    # Encrypt keystore
    encrypted = acc.encrypt(PASSWORD)
    key_filename = f"UTC--2026-07-25T00-00-00.000000000Z--{acc.address.lower().replace('0x', '')}"
    key_file = os.path.join(keystore_dir, key_filename)
    
    with open(key_file, "w") as f:
        import json
        json.dump(encrypted, f, indent=2)
        
    print(f"[+] Saved keystore file to: {key_file}")
    print(f"[+] Saved password file to: {pass_file}")
