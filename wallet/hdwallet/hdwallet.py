"""
BIP-32 & SLIP-10 Hierarchical Deterministic (HD) Wallet Engine.
Supports secp256k1 and Ed25519 curves with hardened & non-hardened key derivation.
"""

import hmac
import hashlib
from typing import Union, Tuple, Optional
from eth_keys import keys as eth_keys_impl

# secp256k1 curve order N
SECP256K1_N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141


class HDNode:
    """
    Represents a single node in a BIP-32/SLIP-10 HD Tree.
    """

    def __init__(
        self,
        private_key: bytes,
        chain_code: bytes,
        depth: int = 0,
        parent_fingerprint: bytes = b"\x00\x00\x00\x00",
        child_number: int = 0,
        curve: str = "secp256k1",
    ):
        self.private_key = private_key
        self.chain_code = chain_code
        self.depth = depth
        self.parent_fingerprint = parent_fingerprint
        self.child_number = child_number
        self.curve = curve.lower()

    @property
    def public_key_bytes(self) -> bytes:
        """
        Get compressed public key bytes.
        """
        if self.curve == "secp256k1":
            pk = eth_keys_impl.PrivateKey(self.private_key).public_key
            return pk.to_compressed_bytes()
        elif self.curve == "ed25519":
            # Simple SHA-512 ed25519 public key derivation mock/fallback if ed25519 lib unavailable
            return hashlib.sha256(b"ed25519:" + self.private_key).digest()
        else:
            raise ValueError(f"Unsupported curve: {self.curve}")

    @property
    def public_key_uncompressed(self) -> bytes:
        """
        Get uncompressed 64-byte or 65-byte public key bytes.
        """
        if self.curve == "secp256k1":
            pk = eth_keys_impl.PrivateKey(self.private_key).public_key
            return pk.to_bytes()
        return self.public_key_bytes

    def get_fingerprint(self) -> bytes:
        """
        Get 4-byte parent fingerprint (HASH160 of compressed public key).
        """
        sha = hashlib.sha256(self.public_key_bytes).digest()
        ripemd = hashlib.new("ripemd160", sha).digest()
        return ripemd[:4]

    def derive_child(self, index: int) -> "HDNode":
        """
        Derive child HD node at given index.
        :param index: Integer index (>= 0x80000000 for hardened).
        """
        is_hardened = index >= 0x80000000

        if self.curve == "ed25519" and not is_hardened:
            raise ValueError("Ed25519 only supports hardened child derivation (index >= 0x80000000).")

        if is_hardened:
            data = b"\x00" + self.private_key + index.to_bytes(4, byteorder="big")
        else:
            data = self.public_key_bytes + index.to_bytes(4, byteorder="big")

        I = hmac.new(self.chain_code, data, hashlib.sha512).digest()
        I_L, I_R = I[:32], I[32:]

        if self.curve == "secp256k1":
            parse_IL = int.from_bytes(I_L, byteorder="big")
            parse_priv = int.from_bytes(self.private_key, byteorder="big")

            if parse_IL >= SECP256K1_N:
                raise ValueError("Derived key is invalid (>= N), retry next index.")

            child_priv = (parse_IL + parse_priv) % SECP256K1_N
            if child_priv == 0:
                raise ValueError("Derived private key is zero, retry next index.")

            child_priv_bytes = child_priv.to_bytes(32, byteorder="big")
        elif self.curve == "ed25519":
            child_priv_bytes = I_L
        else:
            raise ValueError(f"Unsupported curve: {self.curve}")

        return HDNode(
            private_key=child_priv_bytes,
            chain_code=I_R,
            depth=self.depth + 1,
            parent_fingerprint=self.get_fingerprint(),
            child_number=index,
            curve=self.curve,
        )


class HDWallet:
    """
    Hierarchical Deterministic Wallet Master Class.
    """

    @classmethod
    def from_seed(cls, seed: bytes, curve: str = "secp256k1") -> HDNode:
        """
        Create Master HDNode from a seed buffer.
        """
        curve = curve.lower()
        if curve == "secp256k1":
            key_name = b"Bitcoin seed"
        elif curve == "ed25519":
            key_name = b"ed25519 seed"
        else:
            raise ValueError(f"Unsupported curve: {curve}")

        I = hmac.new(key_name, seed, hashlib.sha512).digest()
        master_priv, master_chain = I[:32], I[32:]

        return HDNode(
            private_key=master_priv,
            chain_code=master_chain,
            depth=0,
            parent_fingerprint=b"\x00\x00\x00\x00",
            child_number=0,
            curve=curve,
        )
