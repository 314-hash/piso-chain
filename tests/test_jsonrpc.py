"""
Unit tests for standard JSON-RPC 2.0 API Server handlers.
"""

import unittest
from rpc.jsonrpc_server import JSONRPCHandler, CHAIN_ID_HEX


class TestJSONRPC(unittest.TestCase):

    def setUp(self):
        self.handler = JSONRPCHandler()

    def test_eth_chainId(self):
        resp = self.handler.dispatch({"jsonrpc": "2.0", "method": "eth_chainId", "params": [], "id": 1})
        self.assertEqual(resp["result"], CHAIN_ID_HEX)

    def test_eth_accounts(self):
        resp = self.handler.dispatch({"jsonrpc": "2.0", "method": "eth_accounts", "params": [], "id": 1})
        self.assertIsInstance(resp["result"], list)
        self.assertTrue(len(resp["result"]) > 0)

    def test_eth_blockNumber(self):
        resp = self.handler.dispatch({"jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 1})
        self.assertTrue(resp["result"].startswith("0x"))

    def test_eth_sendRawTransaction(self):
        resp = self.handler.dispatch({"jsonrpc": "2.0", "method": "eth_sendRawTransaction", "params": ["0x1234"], "id": 1})
        self.assertTrue(resp["result"].startswith("0x"))

    def test_web3_clientVersion(self):
        resp = self.handler.dispatch({"jsonrpc": "2.0", "method": "web3_clientVersion", "params": [], "id": 1})
        self.assertIn("PISO-Chain", resp["result"])

    def test_net_version(self):
        resp = self.handler.dispatch({"jsonrpc": "2.0", "method": "net_version", "params": [], "id": 1})
        self.assertEqual(resp["result"], "2026001")


if __name__ == "__main__":
    unittest.main()
