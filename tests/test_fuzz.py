"""
Fuzz testing suite for PISO Chain Wallet & Cryptographic Infrastructure.
"""

import os
import random
import unittest
from wallet.mnemonic.bip39 import BIP39Mnemonic
from wallet.recovery.recovery import WalletRecovery
from wallet.slip39.shamir import ShamirSecretSharing, Share
from wallet.account.account import Account


class TestFuzzing(unittest.TestCase):

    def test_fuzz_random_seed_generation_and_recovery(self):
        for _ in range(20):
            words = random.choice([12, 18, 24])
            mnemonic = BIP39Mnemonic.generate(words)
            self.assertTrue(BIP39Mnemonic.validate(mnemonic))

            acc = WalletRecovery.recover_from_mnemonic(mnemonic)
            self.assertTrue(acc.address.startswith("0x"))
            self.assertEqual(len(acc.address), 42)

    def test_fuzz_shamir_random_payloads(self):
        for _ in range(10):
            size = random.randint(16, 64)
            secret = os.urandom(size)
            threshold = random.randint(2, 5)
            total = threshold + random.randint(0, 3)

            shares = ShamirSecretSharing.split(secret, threshold, total)
            sample_shares = random.sample(shares, threshold)

            recovered = ShamirSecretSharing.combine(sample_shares)
            self.assertEqual(recovered, secret)


if __name__ == "__main__":
    unittest.main()
