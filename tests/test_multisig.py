"""
Unit tests for Native Threshold Multisig.
"""

import os
import unittest
from wallet.account.account import Account
from wallet.multisig.multisig import MultisigWallet, MultisigTransaction


class TestMultisig(unittest.TestCase):

    def setUp(self):
        self.acc1 = Account(os.urandom(32))
        self.acc2 = Account(os.urandom(32))
        self.acc3 = Account(os.urandom(32))
        self.owners = [self.acc1.address, self.acc2.address, self.acc3.address]

    def test_multisig_address_generation(self):
        ms = MultisigWallet(self.owners, threshold=2)
        self.assertTrue(ms.address.startswith("0x"))
        self.assertEqual(len(ms.address), 42)

    def test_2_of_3_multisig_verification(self):
        ms = MultisigWallet(self.owners, threshold=2)
        tx_hash = os.urandom(32)
        tx = MultisigTransaction(tx_hash, "0x1111111111111111111111111111111111111111", 1000, b"")

        # Sign by owner 1 and 2
        sig1 = self.acc1.sign_hash(tx_hash)
        sig2 = self.acc2.sign_hash(tx_hash)

        tx.add_signature(self.acc1.address, sig1)
        tx.add_signature(self.acc2.address, sig2)

        self.assertTrue(ms.verify_transaction(tx))

    def test_insufficient_signatures_fail(self):
        ms = MultisigWallet(self.owners, threshold=2)
        tx_hash = os.urandom(32)
        tx = MultisigTransaction(tx_hash, "0x1111111111111111111111111111111111111111", 1000, b"")

        sig1 = self.acc1.sign_hash(tx_hash)
        tx.add_signature(self.acc1.address, sig1)

        self.assertFalse(ms.verify_transaction(tx))


if __name__ == "__main__":
    unittest.main()
