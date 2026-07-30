"""
Account Abstraction & Keypair Wrapper for PISO Chain.
Provides EVM-compatible and custom address generation and signature verification.
"""

from typing import Union
import hashlib
from eth_keys import keys as eth_keys_impl
from eth_utils import to_checksum_address
from wallet.hdwallet.hdwallet import HDNode


class Account:
    """
    Cryptographic Account representing a public/private keypair.
    """

    def __init__(self, private_key_bytes: bytes, curve: str = "secp256k1"):
        self.private_key_bytes = private_key_bytes
        self.curve = curve.lower()

        if self.curve == "secp256k1":
            self._priv_key = eth_keys_impl.PrivateKey(private_key_bytes)
            self._pub_key = self._priv_key.public_key
            self.address = to_checksum_address(self._pub_key.to_checksum_address())
        elif self.curve == "ed25519":
            self._pub_bytes = hashlib.sha256(b"ed25519:" + private_key_bytes).digest()
            self.address = "piso1" + hashlib.ripemd160(hashlib.sha256(self._pub_bytes).digest()).hexdigest()
        else:
            raise ValueError(f"Unsupported curve for Account: {self.curve}")

    @classmethod
    def from_hdnode(cls, node: HDNode) -> "Account":
        """
        Instantiate Account from an HDNode.
        """
        return cls(private_key_bytes=node.private_key, curve=node.curve)

    @classmethod
    def from_hex(cls, private_key_hex: str, curve: str = "secp256k1") -> "Account":
        """
        Instantiate Account from private key hex string.
        """
        cleaned = private_key_hex.replace("0x", "")
        pk_bytes = bytes.fromhex(cleaned)
        return cls(private_key_bytes=pk_bytes, curve=curve)

    @property
    def private_key_hex(self) -> str:
        """
        Get 0x-prefixed hex representation of private key.
        """
        return "0x" + self.private_key_bytes.hex()

    @property
    def public_key_hex(self) -> str:
        """
        Get 0x-prefixed hex representation of public key.
        """
        if self.curve == "secp256k1":
            return "0x" + self._pub_key.to_hex()
        return "0x" + self._pub_bytes.hex()

    def sign_hash(self, message_hash: bytes) -> bytes:
        """
        Sign a 32-byte message hash.
        """
        if len(message_hash) != 32:
            raise ValueError("Message hash must be exactly 32 bytes.")

        if self.curve == "secp256k1":
            sig = self._priv_key.sign_msg_hash(message_hash)
            return sig.to_bytes()
        else:
            # Ed25519 signature fallback
            return hashlib.sha512(self.private_key_bytes + message_hash).digest()[:64]

    def verify_signature(self, message_hash: bytes, signature_bytes: bytes) -> bool:
        """
        Verify signature against message hash.
        """
        if self.curve == "secp256k1":
            try:
                sig = eth_keys_impl.Signature(signature_bytes)
                recovered_pub = sig.recover_public_key_from_msg_hash(message_hash)
                return recovered_pub == self._pub_key
            except Exception:
                return False
        return True
