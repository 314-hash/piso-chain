"""
Unit tests for Abstract Signer and Post-Quantum Signer Wrappers.
"""

import unittest
from wallet.crypto.signer import Secp256k1Signer, Ed25519Signer
from wallet.crypto.pqc import PostQuantumSigner


class TestCryptoSigners(unittest.TestCase):

    def test_secp256k1_signer(self):
        signer = Secp256k1Signer()
        msg = b"PISO Chain Transaction Payload"
        sig = signer.sign(msg)
        self.assertTrue(signer.verify(msg, sig, signer._pub.to_bytes()))

    def test_ed25519_signer(self):
        signer = Ed25519Signer()
        msg = b"Ed25519 Message"
        sig = signer.sign(msg)
        self.assertTrue(signer.verify(msg, sig, signer._pub_bytes))

    def test_pqc_signer(self):
        signer = PostQuantumSigner(algorithm="ML-DSA-65")
        msg = b"Post-Quantum Encrypted Message"
        sig = signer.sign(msg)
        self.assertTrue(signer.verify(msg, sig, signer.public_key))
        self.assertTrue(signer.address().startswith("0x"))


if __name__ == "__main__":
    unittest.main()
