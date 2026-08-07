"""
Unit & Integration Tests for Nethermind C# Execution Client Integration in PISO Chain.
Inspired by NethermindEth/nethermind.
"""

import os
import json
import unittest
from core.nethermind_engine import NethermindEngine


class TestNethermindIntegration(unittest.TestCase):

    def setUp(self):
        self.engine = NethermindEngine()

    def test_chainspec_schema(self):
        chainspec_path = os.path.join(os.path.dirname(__file__), "..", "config", "nethermind_piso_chainspec.json")
        self.assertTrue(os.path.exists(chainspec_path))
        with open(chainspec_path, "r") as f:
            data = json.load(f)

        self.assertEqual(data["name"], "PISO Chain Mainnet")
        self.assertEqual(data["params"]["chainID"], "0x1EE349")
        self.assertIn("0x0000000000000000000000000000000000001004", data["accounts"])

    def test_client_status(self):
        status = self.engine.get_client_status()
        self.assertEqual(status["chain_id"], 2026001)
        self.assertIn("Nethermind", status["version"])
        self.assertEqual(status["status"], "ONLINE_AND_SYNCED")

    def test_trace_transaction(self):
        trace = self.engine.trace_transaction("0x6f8dcf508309dcea2a30e89f801ea7df105a308e0a4886617fd6c5f2cf65a040")
        self.assertEqual(trace["gas_used"], 21000)
        self.assertFalse(trace["failed"])


if __name__ == "__main__":
    unittest.main()
