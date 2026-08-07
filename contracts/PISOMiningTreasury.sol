// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOMiningTreasury
 * @dev On-chain precompiled system contract at 0x0000000000000000000000000000000000001004 for PISO Chain.
 * Manages the decentralized pre-minted native PISO mining allocation (60,000,000,000 PISO).
 * 
 * IMPORTANT PROTOCOL INVARIANTS:
 * 1. Zero Additional Minting: Native coin supply is fixed at Genesis (100 Billion PISO).
 * 2. Immutable Consensus Payout: Only the blockchain client state transition engine (consensus)
 *    can deduct funds during block finalization to pay block.coinbase.
 * 3. No Owner / No Keys: No administrative functions, owner keys, or transfer methods exist.
 * 4. Depletion Transition: When balance reaches 0, block rewards automatically transition to tx fees only.
 */
contract PISOMiningTreasury {
    // Protocol Constants
    uint256 public constant INITIAL_BLOCK_REWARD = 5000 * 10**18; // 5,000 PISO
    uint256 public constant HALVING_INTERVAL = 5000000;           // Every 5,000,000 blocks (~6 months @ 3s block time)
    uint256 public constant INITIAL_TREASURY_SUPPLY = 60000000000 * 10**18; // 60 Billion PISO (60% Max Supply)

    // State Tracking Variables
    uint256 public totalRewardsDistributed;
    uint256 public totalBlocksRewarded;

    // Events
    event TreasuryPayout(address indexed miner, uint256 blockNumber, uint256 rewardAmount, uint256 remainingTreasuryBalance);
    event TreasuryDepleted(uint256 blockNumber, uint256 totalDistributed);

    /**
     * @dev Fallback function to accept tx fee refunds or protocol donations into the treasury.
     */
    receive() external payable {}

    /**
     * @dev Get current native PISO balance in the Treasury contract.
     */
    function getTreasuryBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Calculate block reward for a specific block number based on halving schedule.
     * @param blockNumber Height of the block being evaluated.
     */
    function calculateBlockReward(uint256 blockNumber) public view returns (uint256) {
        uint256 halvings = blockNumber / HALVING_INTERVAL;

        // Prevent bit shift overflow beyond 64 halvings
        if (halvings >= 64) {
            return 0;
        }

        uint256 reward = INITIAL_BLOCK_REWARD >> halvings;
        uint256 currentBalance = address(this).balance;

        if (currentBalance == 0) {
            return 0;
        }

        // Cap reward to remaining treasury balance
        return reward > currentBalance ? currentBalance : reward;
    }

    /**
     * @dev Get current halving epoch details.
     * @param blockNumber Target block number.
     */
    function getHalvingInfo(uint256 blockNumber) external view returns (
        uint256 currentEpoch,
        uint256 nextHalvingBlock,
        uint256 blocksUntilHalving,
        uint256 currentReward
    ) {
        currentEpoch = blockNumber / HALVING_INTERVAL;
        nextHalvingBlock = (currentEpoch + 1) * HALVING_INTERVAL;
        blocksUntilHalving = nextHalvingBlock - blockNumber;
        currentReward = calculateBlockReward(blockNumber);
    }

    /**
     * @dev Read-only summary of treasury health and distribution statistics.
     */
    function getTreasuryStats(uint256 currentBlockNumber) external view returns (
        uint256 currentBalance,
        uint256 totalDistributed,
        uint256 blocksRewarded,
        uint256 currentBlockReward,
        bool isDepleted
    ) {
        currentBalance = address(this).balance;
        totalDistributed = totalRewardsDistributed;
        blocksRewarded = totalBlocksRewarded;
        currentBlockReward = calculateBlockReward(currentBlockNumber);
        isDepleted = (currentBalance == 0);
    }
}
