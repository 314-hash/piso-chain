"""
Unit tests for WalletRecovery Orchestrator.
"""

import os
import unittest
from wallet.mnemonic.bip39 import BIP39Mnemonic
from wallet.recovery.recovery import WalletRecovery
from wallet.encryption.keystore import KeystoreManager
from wallet.slip39.shamir import ShamirSecretSharing


class TestWalletRecovery(unittest.TestCase):

    def test_recover_from_mnemonic(self):
        m = BIP39Mnemonic.generate(12)
        acc = WalletRecovery.recover_from_mnemonic(m, passphrase="", coin_type=2026)
        self.assertTrue(acc.address.startswith("0x"))

    def test_recover_from_keystore(self):
        pk = os.urandom(32)
        passw = "Pass123!"
        keystore = KeystoreManager.encrypt_private_key(pk, passw, "0x1111111111111111111111111111111111111111")
        acc = WalletRecovery.recover_from_keystore(keystore, passw)
        self.assertEqual(acc.private_key_bytes, pk)

    def test_recover_from_shamir(self):
        secret = os.urandom(32)
        shares = ShamirSecretSharing.split(secret, threshold=2, total_shares=3)
        hex_shares = [s.to_hex() for s in shares[:2]]

        recovered = WalletRecovery.recover_from_shamir_shares(hex_shares)
        self.assertEqual(recovered, secret)


if __name__ == "__main__":
    unittest.main()
