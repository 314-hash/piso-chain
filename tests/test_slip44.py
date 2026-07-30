"""
Unit tests for SLIP-44 Coin Type Registry.
"""

import unittest
from wallet.slip44.coin_type import CoinTypeRegistry


class TestSLIP44(unittest.TestCase):

    def test_default_piso_registration(self):
        info = CoinTypeRegistry.get(2026)
        self.assertIsNotNone(info)
        self.assertEqual(info.symbol, "PISO")

    def test_custom_coin_registration(self):
        CoinTypeRegistry.register(9999, "CUSTOM", "Custom Test Token")
        info = CoinTypeRegistry.get(9999)
        self.assertEqual(info.name, "Custom Test Token")
        self.assertEqual(CoinTypeRegistry.get_by_symbol("CUSTOM").coin_type, 9999)


if __name__ == "__main__":
    unittest.main()
