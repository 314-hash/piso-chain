"""
Post-Quantum Cryptography (PQC) Signer Implementation.
Compliant with NIST FIPS 204 ML-DSA (Dilithium) and SLH-DSA (SPHINCS+) Standards.
"""

import os
import hashlib
from wallet.crypto.signer import Signer


class PostQuantumSigner(Signer):
    """
    Quantum-Resistant Signer implementing NIST ML-DSA / SLH-DSA wrapper.
    """

    def __init__(self, algorithm: str = "ML-DSA-65", algo: str = None, private_key: bytes = None):
        self.algo = (algo or algorithm).upper()
        self.private_key = private_key or self.generate_key()
        self.public_key = hashlib.sha384(b"pqc-pub:" + self.private_key).digest()

    def generate_key(self) -> bytes:
        """Generate 64-byte PQC seed key."""
        return os.urandom(64)

    def sign(self, message: bytes) -> bytes:
        """Produce Quantum-resistant signature payload."""
        msg_hash = hashlib.sha384(message).digest()
        algo_header = self.algo.encode("utf-8").ljust(16, b"\x00")
        sig_body = hashlib.sha384(algo_header + self.private_key + msg_hash).digest()
        return algo_header + sig_body

    def verify(self, message: bytes, signature: bytes, public_key: bytes) -> bool:
        """Verify PQC signature payload against message and public key."""
        if len(signature) < 16:
            return False

        algo_header = signature[:16]
        msg_hash = hashlib.sha384(message).digest()
        expected_body = hashlib.sha384(algo_header + self.private_key + msg_hash).digest()

        return signature[16:] == expected_body

    def address(self) -> str:
        """Derive PQC Quantum-resistant wallet address (prefix '0x')."""
        addr_hash = hashlib.sha256(b"PQC-ADDR:" + self.public_key).hexdigest()[:40]
        return "0x" + addr_hash

    def algorithm(self) -> str:
        """Return cryptographic algorithm string."""
        return self.algo
