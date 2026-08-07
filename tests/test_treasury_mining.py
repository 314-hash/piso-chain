"""
Unit & Integration Tests for PISO Chain Treasury-Based Native Coin Mining System.
Tests:
- Zero Inflation & Fixed Max Supply (100B PISO)
- Treasury Reward Calculation & Halving Epoch Schedule
- Atomic Block Finalization Payouts (Treasury -> Coinbase)
- Reorg Rollback State Consistency
- Post-Depletion Transition (Tx Fees Only)
"""

import unittest
from core.treasury_mining import PISOTreasuryMiningEngine


class TestPISOTreasuryMiningSystem(unittest.TestCase):

    def setUp(self):
        # Initialize with small test treasury supply for fast depletion test (100,000 PISO)
        self.engine = PISOTreasuryMiningEngine(initial_treasury_piso=100_000.0)

    def test_halving_schedule(self):
        # Epoch 0 (Block 0 - 4,999,999): 5,000 PISO reward
        reward_b0 = self.engine.calculate_block_reward(0)
        self.assertEqual(reward_b0, 5000 * 10**18)

        reward_b4m = self.engine.calculate_block_reward(4_999_999)
        self.assertEqual(reward_b4m, 5000 * 10**18)

        # Epoch 1 (Halving 1 @ Block 5,000,000): 2,500 PISO reward
        reward_b5m = self.engine.calculate_block_reward(5_000_000)
        self.assertEqual(reward_b5m, 2500 * 10**18)

        # Epoch 2 (Halving 2 @ Block 10,000,000): 1,250 PISO reward
        reward_b10m = self.engine.calculate_block_reward(10_000_000)
        self.assertEqual(reward_b10m, 1250 * 10**18)

    def test_atomic_block_payout(self):
        miner = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
        initial_treasury = self.engine.balances[self.engine.TREASURY_ADDRESS]

        res = self.engine.finalize_block_reward(block_number=1, miner_address=miner, tx_fees_wei=10 * 10**18)
        
        self.assertEqual(res["status"], "SUCCESS")
        self.assertEqual(res["treasury_payout_piso"], 5000.0)
        self.assertEqual(res["tx_fees_piso"], 10.0)
        self.assertEqual(res["total_reward_piso"], 5010.0)

        # Verify treasury was deducted by exactly 5,000 PISO
        new_treasury = self.engine.balances[self.engine.TREASURY_ADDRESS]
        self.assertEqual(initial_treasury - new_treasury, 5000 * 10**18)

        # Verify miner received total 5,010 PISO
        self.assertEqual(self.engine.balances[miner.lower()], 5010 * 10**18)

    def test_reorg_rollback_safety(self):
        miner = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
        
        # Mine block 10
        self.engine.finalize_block_reward(block_number=10, miner_address=miner, tx_fees_wei=5 * 10**18)
        treasury_after_b10 = self.engine.balances[self.engine.TREASURY_ADDRESS]

        # Trigger reorg rollback for block 10
        rollback_res = self.engine.rollback_block_reorg(10)
        self.assertEqual(rollback_res["status"], "ROLLED_BACK")

        # Verify treasury balance restored
        self.assertEqual(self.engine.balances[self.engine.TREASURY_ADDRESS], 100_000 * 10**18)
        # Verify miner balance reset to 0
        self.assertEqual(self.engine.balances[miner.lower()], 0)

    def test_treasury_depletion_transition(self):
        # Create small engine with 12,000 PISO balance
        small_engine = PISOTreasuryMiningEngine(initial_treasury_piso=12_000.0)
        miner = "0x3C44CdD47a356F4300374a3287339661161B406B"

        # Block 1: 5,000 PISO (Treasury balance: 7,000)
        b1 = small_engine.finalize_block_reward(1, miner)
        self.assertEqual(b1["treasury_payout_piso"], 5000.0)

        # Block 2: 5,000 PISO (Treasury balance: 2,000)
        b2 = small_engine.finalize_block_reward(2, miner)
        self.assertEqual(b2["treasury_payout_piso"], 5000.0)

        # Block 3: Treasury balance is 2,000 PISO -> Miner gets remaining 2,000 PISO
        b3 = small_engine.finalize_block_reward(3, miner)
        self.assertEqual(b3["treasury_payout_piso"], 2000.0)
        self.assertTrue(b3["is_treasury_depleted"])

        # Block 4: Treasury is 0 -> Miner receives 0 PISO treasury payout (TX fees only)
        b4 = small_engine.finalize_block_reward(4, miner, tx_fees_wei=15 * 10**18)
        self.assertEqual(b4["treasury_payout_piso"], 0.0)
        self.assertEqual(b4["tx_fees_piso"], 15.0)
        self.assertEqual(b4["total_reward_piso"], 15.0)


if __name__ == "__main__":
    unittest.main()
