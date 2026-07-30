"""
Unit tests for PISO Chain SDK implementations.
"""

import unittest
from sdk.python.piso_sdk.wallet import SDKWallet


class TestSDK(unittest.TestCase):

    def test_python_sdk_generate_wallet(self):
        w = SDKWallet.generate_wallet(words=12)
        self.assertIn("mnemonic", w)
        self.assertTrue(w["address"].startswith("0x"))
        self.assertEqual(len(w["address"]), 42)

    def test_python_sdk_sign_verify(self):
        w = SDKWallet.generate_wallet(words=12)
        msg_hash = b"\x01" * 32
        sig = SDKWallet.sign_transaction(w["account"], msg_hash)
        self.assertTrue(SDKWallet.verify_signature(w["account"], msg_hash, sig))


if __name__ == "__main__":
    unittest.main()
