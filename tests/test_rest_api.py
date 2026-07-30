"""
Unit tests for PISO Chain REST API endpoints.
"""

import json
import unittest
from wallet.mnemonic.bip39 import BIP39Mnemonic
from api.rest_server import PISORESTRequestHandler


class MockWfile:

    def __init__(self):
        self.data = b""

    def write(self, b):
        self.data += b


class MockRfile:

    def __init__(self, data: bytes):
        self.data = data

    def read(self, length):
        return self.data


class TestRESTAPI(unittest.TestCase):

    def test_rest_create_wallet_logic(self):
        m = BIP39Mnemonic.generate(12)
        words = m.split()
        self.assertEqual(len(words), 12)
        self.assertTrue(BIP39Mnemonic.validate(m))


if __name__ == "__main__":
    unittest.main()
