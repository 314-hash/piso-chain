"""
Unit tests for Validator Key Management & Role Domain Isolation.
"""

import os
import unittest
from wallet.validator.validator_key import ValidatorKey, KeyRole, KeyDomainError


class TestValidatorKeys(unittest.TestCase):

    def test_validator_key_generation(self):
        seed = os.urandom(32)
        vkey = ValidatorKey(seed, role=KeyRole.VALIDATOR)
        self.assertEqual(vkey.role, KeyRole.VALIDATOR)
        self.assertTrue(vkey.address.startswith("0x"))

    def test_domain_isolation(self):
        seed = os.urandom(32)
        vkey = ValidatorKey(seed, role=KeyRole.VALIDATOR)
        wkey = ValidatorKey(seed, role=KeyRole.WALLET)

        # Same seed produce distinct key representations due to domain tag
        self.assertNotEqual(vkey.private_key_bytes, wkey.private_key_bytes)
        self.assertNotEqual(vkey.address, wkey.address)

        with self.assertRaises(KeyDomainError):
            vkey.assert_role(KeyRole.WALLET)


if __name__ == "__main__":
    unittest.main()
