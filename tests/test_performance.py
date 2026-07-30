"""
Performance Benchmark Test Suite enforcing Phase 15 latency targets.
Targets:
- Wallet generation: < 50ms
- Transaction signing: < 10ms
- RPC / Balance lookup: < 100ms
"""

import time
import os
import unittest
from wallet.mnemonic.bip39 import BIP39Mnemonic
from wallet.account.account import Account
from rpc.jsonrpc_server import JSONRPCHandler


class TestPerformanceBenchmarks(unittest.TestCase):

    def test_wallet_generation_latency(self):
        start = time.perf_counter()
        mnemonic = BIP39Mnemonic.generate(24)
        seed = BIP39Mnemonic.to_seed(mnemonic)
        acc = Account(seed[:32])
        elapsed_ms = (time.perf_counter() - start) * 1000.0

        self.assertLess(elapsed_ms, 50.0, f"Wallet generation latency {elapsed_ms:.2f}ms exceeded target 50ms")

    def test_transaction_signing_latency(self):
        acc = Account(os.urandom(32))
        msg_hash = os.urandom(32)

        start = time.perf_counter()
        sig = acc.sign_hash(msg_hash)
        elapsed_ms = (time.perf_counter() - start) * 1000.0

        self.assertLess(elapsed_ms, 10.0, f"Transaction signing latency {elapsed_ms:.2f}ms exceeded target 10ms")

    def test_rpc_latency(self):
        handler = JSONRPCHandler()

        start = time.perf_counter()
        res = handler.dispatch({"jsonrpc": "2.0", "method": "eth_getBalance", "params": ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"], "id": 1})
        elapsed_ms = (time.perf_counter() - start) * 1000.0

        self.assertLess(elapsed_ms, 100.0, f"RPC latency {elapsed_ms:.2f}ms exceeded target 100ms")


if __name__ == "__main__":
    unittest.main()
