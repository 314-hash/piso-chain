"""
Unit tests for SLIP-39 Shamir Secret Sharing Engine.
"""

import os
import unittest
from wallet.slip39.shamir import ShamirSecretSharing, Share


class TestSLIP39(unittest.TestCase):

    def test_2_of_3_threshold_split_combine(self):
        secret = os.urandom(32)
        shares = ShamirSecretSharing.split(secret, threshold=2, total_shares=3)

        self.assertEqual(len(shares), 3)

        # Reconstruct with share 1 & 2
        recovered_12 = ShamirSecretSharing.combine([shares[0], shares[1]])
        self.assertEqual(recovered_12, secret)

        # Reconstruct with share 2 & 3
        recovered_23 = ShamirSecretSharing.combine([shares[1], shares[2]])
        self.assertEqual(recovered_23, secret)

    def test_3_of_5_threshold_split_combine(self):
        secret = os.urandom(32)
        shares = ShamirSecretSharing.split(secret, threshold=3, total_shares=5)

        self.assertEqual(len(shares), 5)
        recovered = ShamirSecretSharing.combine([shares[0], shares[2], shares[4]])
        self.assertEqual(recovered, secret)

    def test_insufficient_shares_fails(self):
        secret = os.urandom(32)
        shares = ShamirSecretSharing.split(secret, threshold=3, total_shares=5)

        with self.assertRaises(ValueError):
            ShamirSecretSharing.combine([shares[0], shares[1]])


if __name__ == "__main__":
    unittest.main()
