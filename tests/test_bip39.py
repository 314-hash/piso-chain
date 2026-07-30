"""
Unit tests for BIP-39 Mnemonic Generator and Seed Derivation.
"""

import unittest
from wallet.mnemonic.bip39 import BIP39Mnemonic


class TestBIP39(unittest.TestCase):

    def test_generate_12_words(self):
        m = BIP39Mnemonic.generate(12)
        words = m.split()
        self.assertEqual(len(words), 12)
        self.assertTrue(BIP39Mnemonic.validate(m))

    def test_generate_18_words(self):
        m = BIP39Mnemonic.generate(18)
        words = m.split()
        self.assertEqual(len(words), 18)
        self.assertTrue(BIP39Mnemonic.validate(m))

    def test_generate_24_words(self):
        m = BIP39Mnemonic.generate(24)
        words = m.split()
        self.assertEqual(len(words), 24)
        self.assertTrue(BIP39Mnemonic.validate(m))

    def test_seed_derivation(self):
        m = BIP39Mnemonic.generate(12)
        seed1 = BIP39Mnemonic.to_seed(m, passphrase="")
        seed2 = BIP39Mnemonic.to_seed(m, passphrase="secret_password")
        self.assertEqual(len(seed1), 64)
        self.assertEqual(len(seed2), 64)
        self.assertNotEqual(seed1, seed2)

    def test_invalid_mnemonic(self):
        self.assertFalse(BIP39Mnemonic.validate("invalid word list that should fail checksum verification"))


if __name__ == "__main__":
    unittest.main()
