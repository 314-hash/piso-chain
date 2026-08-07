"""
PISO Chain Treasury-Based Native Coin Mining Engine.
Provides protocol consensus logic for native PISO treasury payouts, halving schedules,
treasury depletion handling, and block reorg state rollback safety.
"""

import hashlib
import json
import time
from typing import Dict, List, Any, Optional


class PISOTreasuryMiningEngine:
    """
    Core Protocol Treasury Engine managing non-inflationary mining payouts
    from pre-minted native PISO allocation (60 Billion PISO).
    """

    TREASURY_ADDRESS = "0x0000000000000000000000000000000000001004"
    INITIAL_TREASURY_SUPPLY = 60_000_000_000 * 10**18  # 60 Billion PISO (wei)
    MAX_TOTAL_SUPPLY = 100_000_000_000 * 10**18        # 100 Billion PISO (wei)
    INITIAL_BLOCK_REWARD = 5000 * 10**18                # 5,000 PISO per block
    HALVING_INTERVAL = 5_000_000                        # 5M blocks (~6 months @ 3s block time)

    def __init__(self, initial_treasury_piso: float = 60_000_000_000.0):
        self.treasury_balance_wei = int(initial_treasury_piso) * 10**18
        self.balances: Dict[str, int] = {
            self.TREASURY_ADDRESS: self.treasury_balance_wei
        }
        self.block_history: Dict[int, Dict[str, Any]] = {}
        self.total_distributed_wei = 0

    def calculate_block_reward(self, block_number: int) -> int:
        """
        Calculate protocol block reward for a specific block height based on halving schedule.
        """
        halvings = block_number // self.HALVING_INTERVAL
        if halvings >= 64:
            return 0

        reward = self.INITIAL_BLOCK_REWARD >> halvings
        current_treasury = self.balances.get(self.TREASURY_ADDRESS, 0)

        if current_treasury == 0:
            return 0

        # Cap payout to remaining treasury balance
        return min(reward, current_treasury)

    def finalize_block_reward(self, block_number: int, miner_address: str, tx_fees_wei: int = 0) -> Dict[str, Any]:
        """
        Consensus block finalization step: atomically deduct native PISO from treasury
        and credit miner coinbase.
        """
        miner_addr = miner_address.lower()
        treasury_reward = self.calculate_block_reward(block_number)
        
        # Deduct from treasury
        current_treasury = self.balances.get(self.TREASURY_ADDRESS, 0)
        actual_treasury_payout = min(treasury_reward, current_treasury)

        self.balances[self.TREASURY_ADDRESS] = current_treasury - actual_treasury_payout
        
        # Credit miner coinbase (Treasury payout + TX fees)
        miner_balance = self.balances.get(miner_addr, 0)
        total_miner_credit = actual_treasury_payout + tx_fees_wei
        self.balances[miner_addr] = miner_balance + total_miner_credit

        self.total_distributed_wei += actual_treasury_payout

        # Record state snapshot for reorg rollback safety
        snapshot = {
            "block_number": block_number,
            "miner": miner_addr,
            "treasury_payout_wei": actual_treasury_payout,
            "tx_fees_wei": tx_fees_wei,
            "remaining_treasury_wei": self.balances[self.TREASURY_ADDRESS],
            "total_distributed_wei": self.total_distributed_wei,
            "timestamp": time.time(),
        }
        self.block_history[block_number] = snapshot

        return {
            "status": "SUCCESS",
            "block_number": block_number,
            "miner": miner_addr,
            "treasury_payout_piso": actual_treasury_payout / 10**18,
            "tx_fees_piso": tx_fees_wei / 10**18,
            "total_reward_piso": total_miner_credit / 10**18,
            "remaining_treasury_piso": self.balances[self.TREASURY_ADDRESS] / 10**18,
            "is_treasury_depleted": self.balances[self.TREASURY_ADDRESS] == 0,
        }

    def rollback_block_reorg(self, orphaned_block_number: int) -> Dict[str, Any]:
        """
        Handle chain reorganization by rolling back treasury payout state for orphaned blocks.
        """
        if orphaned_block_number not in self.block_history:
            return {"status": "ERROR", "reason": f"Block {orphaned_block_number} not found in history"}

        snapshot = self.block_history.pop(orphaned_block_number)
        miner = snapshot["miner"]
        payout = snapshot["treasury_payout_wei"]
        tx_fees = snapshot["tx_fees_wei"]

        # Restore treasury balance
        self.balances[self.TREASURY_ADDRESS] += payout
        # Deduct from miner
        self.balances[miner] -= (payout + tx_fees)
        self.total_distributed_wei -= payout

        return {
            "status": "ROLLED_BACK",
            "block_number": orphaned_block_number,
            "restored_treasury_piso": self.balances[self.TREASURY_ADDRESS] / 10**18,
            "total_distributed_piso": self.total_distributed_wei / 10**18,
        }

    def get_treasury_status(self, current_block_number: int = 1) -> Dict[str, Any]:
        """
        Return comprehensive status and economic metrics.
        """
        current_treasury_wei = self.balances.get(self.TREASURY_ADDRESS, 0)
        current_reward_wei = self.calculate_block_reward(current_block_number)
        epoch = current_block_number // self.HALVING_INTERVAL
        next_halving = (epoch + 1) * self.HALVING_INTERVAL

        return {
            "treasury_address": self.TREASURY_ADDRESS,
            "max_total_supply_piso": self.MAX_TOTAL_SUPPLY / 10**18,
            "initial_treasury_supply_piso": self.INITIAL_TREASURY_SUPPLY / 10**18,
            "current_treasury_balance_piso": current_treasury_wei / 10**18,
            "total_distributed_piso": self.total_distributed_wei / 10**18,
            "current_block_height": current_block_number,
            "current_block_reward_piso": current_reward_wei / 10**18,
            "current_halving_epoch": epoch,
            "next_halving_block": next_halving,
            "blocks_to_next_halving": next_halving - current_block_number,
            "is_depleted": current_treasury_wei == 0,
            "inflation_rate": "0.00% (Fixed Pre-Minted Supply)",
        }
