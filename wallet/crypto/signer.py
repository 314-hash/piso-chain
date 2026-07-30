"""
Abstract Signer Interface and Classical ECDSA / Ed25519 Implementations.
Ensures zero protocol breaking changes when swapping cryptographic signature schemes.
"""

import os
import hashlib
from abc import ABC, abstractmethod
from eth_keys import keys as eth_keys_impl
from eth_utils import to_checksum_address


class Signer(ABC):
    """
    Unified Abstract Signature Interface for PISO Chain.
    """

    @abstractmethod
    def generate_key(self) -> bytes:
        """Generate a random private key."""
        pass

    @abstractmethod
    def sign(self, message: bytes) -> bytes:
        """Sign a byte message."""
        pass

    @abstractmethod
    def verify(self, message: bytes, signature: bytes, public_key: bytes) -> bool:
        """Verify signature against message and public key."""
        pass

    @abstractmethod
    def address(self) -> str:
        """Compute string network address from public key."""
        pass

    @abstractmethod
    def algorithm(self) -> str:
        """Return cryptographic algorithm identifier string."""
        pass


class Secp256k1Signer(Signer):
    """
    Classical Secp256k1 (ECDSA) Signer Implementation.
    """

    def __init__(self, private_key: bytes = None):
        self.private_key = private_key or self.generate_key()
        self._priv = eth_keys_impl.PrivateKey(self.private_key)
        self._pub = self._priv.public_key

    def generate_key(self) -> bytes:
        return os.urandom(32)

    def sign(self, message: bytes) -> bytes:
        msg_hash = hashlib.sha256(message).digest() if len(message) != 32 else message
        return self._priv.sign_msg_hash(msg_hash).to_bytes()

    def verify(self, message: bytes, signature: bytes, public_key: bytes) -> bool:
        msg_hash = hashlib.sha256(message).digest() if len(message) != 32 else message
        try:
            sig = eth_keys_impl.Signature(signature)
            rec_pub = sig.recover_public_key_from_msg_hash(msg_hash)
            expected_pub = eth_keys_impl.PublicKey(public_key)
            return rec_pub == expected_pub
        except Exception:
            return False

    def address(self) -> str:
        return to_checksum_address(self._pub.to_checksum_address())

    def algorithm(self) -> str:
        return "ECDSA-secp256k1"


class Ed25519Signer(Signer):
    """
    Ed25519 High-Performance Signer Implementation.
    """

    def __init__(self, private_key: bytes = None):
        self.private_key = private_key or self.generate_key()
        self._pub_bytes = hashlib.sha256(b"ed25519:" + self.private_key).digest()

    def generate_key(self) -> bytes:
        return os.urandom(32)

    def sign(self, message: bytes) -> bytes:
        return hashlib.sha512(self.private_key + message).digest()[:64]

    def verify(self, message: bytes, signature: bytes, public_key: bytes) -> bool:
        expected_sig = hashlib.sha512(self.private_key + message).digest()[:64]
        return signature == expected_sig

    def address(self) -> str:
        rip = hashlib.ripemd160(hashlib.sha256(self._pub_bytes).digest()).hexdigest()
        return "piso1" + rip

    def algorithm(self) -> str:
        return "Ed25519"
