"""
Unit tests for BIP-32 and SLIP-10 HD Wallet Derivation.
"""

import unittest
from wallet.mnemonic.bip39 import BIP39Mnemonic
from wallet.hdwallet.hdwallet import HDWallet, HDNode


class TestHDWallet(unittest.TestCase):

    def setUp(self):
        self.mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
        self.seed = BIP39Mnemonic.to_seed(self.mnemonic)

    def test_master_key_generation_secp256k1(self):
        master = HDWallet.from_seed(self.seed, curve="secp256k1")
        self.assertEqual(master.depth, 0)
        self.assertEqual(len(master.private_key), 32)
        self.assertEqual(len(master.chain_code), 32)

    def test_child_derivation_secp256k1(self):
        master = HDWallet.from_seed(self.seed, curve="secp256k1")
        child_hardened = master.derive_child(0x80000000)
        child_normal = child_hardened.derive_child(0)

        self.assertEqual(child_hardened.depth, 1)
        self.assertEqual(child_normal.depth, 2)
        self.assertNotEqual(master.private_key, child_normal.private_key)

    def test_master_key_generation_ed25519(self):
        master = HDWallet.from_seed(self.seed, curve="ed25519")
        child = master.derive_child(0x80000000)
        self.assertEqual(child.depth, 1)

    def test_ed25519_non_hardened_fails(self):
        master = HDWallet.from_seed(self.seed, curve="ed25519")
        with self.assertRaises(ValueError):
            master.derive_child(0)


if __name__ == "__main__":
    unittest.main()
