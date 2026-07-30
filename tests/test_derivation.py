"""
Unit tests for BIP-44 Derivation Path Parsing & Resolution.
"""

import unittest
from wallet.mnemonic.bip39 import BIP39Mnemonic
from wallet.hdwallet.hdwallet import HDWallet
from wallet.derivation.path import DerivationPath, BIP44Derivation
from wallet.account.account import Account


class TestDerivationPath(unittest.TestCase):

    def test_parse_path(self):
        indexes = DerivationPath.parse("m/44'/2026'/0'/0/0")
        self.assertEqual(len(indexes), 5)
        self.assertEqual(indexes[0], 44 + 0x80000000)
        self.assertEqual(indexes[1], 2026 + 0x80000000)
        self.assertEqual(indexes[2], 0 + 0x80000000)
        self.assertEqual(indexes[3], 0)
        self.assertEqual(indexes[4], 0)

    def test_derive_account_from_path(self):
        mnemonic = BIP39Mnemonic.generate(12)
        seed = BIP39Mnemonic.to_seed(mnemonic)
        master = HDWallet.from_seed(seed)

        path_piso = BIP44Derivation.build_path(coin_type=2026, account=0, change=0, address_index=0)
        child_piso = DerivationPath.derive_path(master, path_piso)

        acc = Account.from_hdnode(child_piso)
        self.assertTrue(acc.address.startswith("0x"))
        self.assertEqual(len(acc.address), 42)


if __name__ == "__main__":
    unittest.main()
