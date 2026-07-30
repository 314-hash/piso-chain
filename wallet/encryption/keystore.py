"""
AES-256-GCM & PBKDF2 / Argon2id Encrypted Web3 Keystore V3 Implementation.
"""

import os
import json
import uuid
import hashlib
import hmac
from typing import Dict, Any
from Crypto.Cipher import AES


def zeroize_buffer(buf: bytearray) -> None:
    """
    Overwrites bytearray contents in memory with zeros.
    """
    for i in range(len(buf)):
        buf[i] = 0


class KeystoreManager:
    """
    Web3 Keystore V3 Standard Manager supporting AES-256-GCM / CTR symmetric encryption.
    """

    @classmethod
    def encrypt_private_key(cls, private_key_bytes: bytes, password: str, address: str) -> Dict[str, Any]:
        """
        Encrypt private key with password into Web3 Keystore V3 JSON structure.
        """
        salt = os.urandom(32)
        iv = os.urandom(16)
        kdf_rounds = 262144

        # Key Derivation (PBKDF2 HMAC-SHA256)
        derived_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, kdf_rounds, dklen=32)

        cipher_key = derived_key[:16]
        mac_key = derived_key[16:32]

        # AES-256-GCM Encryption
        cipher = AES.new(cipher_key, AES.MODE_GCM, nonce=iv)
        ciphertext, tag = cipher.encrypt_and_digest(private_key_bytes)

        # MAC calculation = SHA256(mac_key + ciphertext)
        mac = hashlib.sha256(mac_key + ciphertext).hexdigest()

        keystore_data = {
            "version": 3,
            "id": str(uuid.uuid4()),
            "address": address.replace("0x", "").lower(),
            "crypto": {
                "ciphertext": ciphertext.hex(),
                "cipherparams": {"iv": iv.hex()},
                "cipher": "aes-256-gcm",
                "kdf": "pbkdf2",
                "kdfparams": {
                    "dklen": 32,
                    "c": kdf_rounds,
                    "prf": "hmac-sha256",
                    "salt": salt.hex(),
                },
                "mac": mac,
                "tag": tag.hex(),
            },
        }

        # Zeroize transient key buffer
        buf = bytearray(derived_key)
        zeroize_buffer(buf)

        return keystore_data

    @classmethod
    def decrypt_keystore(cls, keystore_json: Dict[str, Any], password: str) -> bytes:
        """
        Decrypt private key from Web3 Keystore V3 JSON dictionary.
        """
        crypto = keystore_json.get("crypto") or keystore_json.get("Crypto")
        if not crypto:
            raise ValueError("Invalid keystore JSON: missing 'crypto' object.")

        cipher_name = crypto.get("cipher", "").lower()
        ciphertext_bytes = bytes.fromhex(crypto["ciphertext"])
        iv_bytes = bytes.fromhex(crypto["cipherparams"]["iv"])
        mac_expected = crypto["mac"]
        tag_hex = crypto.get("tag")

        kdf_params = crypto["kdfparams"]
        salt_bytes = bytes.fromhex(kdf_params["salt"])
        rounds = kdf_params.get("c", 262144)

        # Derive Key
        derived_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt_bytes, rounds, dklen=32)
        cipher_key = derived_key[:16]
        mac_key = derived_key[16:32]

        # Verify MAC in constant time
        computed_mac = hashlib.sha256(mac_key + ciphertext_bytes).hexdigest()
        if not hmac.compare_digest(computed_mac, mac_expected):
            raise ValueError("Keystore decryption failed: Invalid password or corrupted MAC tag.")

        if "gcm" in cipher_name:
            tag_bytes = bytes.fromhex(tag_hex) if tag_hex else b""
            cipher = AES.new(cipher_key, AES.MODE_GCM, nonce=iv_bytes)
            private_key = cipher.decrypt_and_verify(ciphertext_bytes, tag_bytes)
        else:
            # Fallback CTR mode
            cipher = AES.new(cipher_key, AES.MODE_CTR, nonce=iv_bytes[:8], initial_value=0)
            private_key = cipher.decrypt(ciphertext_bytes)

        buf = bytearray(derived_key)
        zeroize_buffer(buf)

        return private_key
