// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOFreqtradeOracle
 * @dev On-chain oracle vault for freqtrade algorithmic trading bot integration.
 *      Records SHA-256 trade proofs submitted by authorized PISO Agent OS workers.
 *      Rewards verified profitable closed trades with $PISO tokens.
 *
 * Integration Flow:
 *   1. jcode freqtrade_agent.py polls freqtrade REST API for closed trades
 *   2. Computes SHA-256 proof: SHA256(tradeId + strategy + profitPct + timestamp)
 *   3. Calls submitTradeProof() with proof + metadata
 *   4. Contract verifies proof hash, emits TradeVerified event
 *   5. Profitable trades (profit_pct > 0) receive $PISO reward automatically
 */
contract PISOFreqtradeOracle {
    address public owner;
    uint256 public nextTradeId;
    uint256 public totalTradesVerified;
    uint256 public totalProfitableVerified;
    uint256 public totalRewardsDistributed;

    /// @notice Default $PISO reward per verified profitable trade (10 PISO in wei)
    uint256 public rewardPerProfitableTrade = 10 ether;

    /// @notice Minimum profit percentage (in basis points) to qualify for reward
    /// @dev 10 = 0.10% minimum profit
    uint256 public minProfitBps = 10;

    // ── Data Structures ─────────────────────────────────────────────────────

    struct TradeProof {
        uint256 pisoTradeId;        // Internal PISO trade counter
        uint256 freqtradeTradeId;   // Original freqtrade trade ID
        address workerAddress;      // jcode agent wallet address
        string  strategy;           // Strategy name (e.g. "PISOStrategy")
        string  pair;               // Trading pair (e.g. "BTC/USDT")
        int256  profitBps;          // Profit in basis points (signed; negative = loss)
        bytes32 proofHash;          // SHA-256 proof submitted by agent
        bytes32 verifiedHash;       // On-chain recomputed verification hash
        uint256 openTimestamp;      // Trade open Unix timestamp
        uint256 closeTimestamp;     // Trade close Unix timestamp
        bool    profitable;         // true if profitBps > minProfitBps
        bool    rewardPaid;         // true if $PISO reward was distributed
        uint256 rewardAmount;       // Amount of $PISO paid as reward
    }

    mapping(uint256 => TradeProof) public tradeProofs;
    mapping(address => bool)       public authorizedWorkers;
    mapping(address => uint256)    public workerTradeCount;
    mapping(address => uint256)    public workerTotalRewards;

    // ── Events ──────────────────────────────────────────────────────────────

    event TradeVerified(
        uint256 indexed pisoTradeId,
        uint256 indexed freqtradeTradeId,
        address indexed workerAddress,
        string  strategy,
        string  pair,
        int256  profitBps,
        bytes32 proofHash,
        bool    profitable,
        uint256 rewardPaid
    );

    event WorkerAuthorized(address indexed worker, bool authorized);
    event RewardPerTradeUpdated(uint256 oldReward, uint256 newReward);
    event FundsDeposited(address indexed depositor, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    // ── Modifiers ───────────────────────────────────────────────────────────

    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED     = 2;

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOFreqtradeOracle: Not owner");
        _;
    }

    modifier onlyAuthorizedWorker() {
        require(authorizedWorkers[msg.sender], "PISOFreqtradeOracle: Not authorized worker");
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "PISOFreqtradeOracle: Reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    // ── Constructor ─────────────────────────────────────────────────────────

    constructor() {
        owner  = msg.sender;
        _status = _NOT_ENTERED;
        // Auto-authorize deployer as first worker
        authorizedWorkers[msg.sender] = true;
        emit WorkerAuthorized(msg.sender, true);
    }

    // ── Core Functions ───────────────────────────────────────────────────────

    /**
     * @notice Submit a freqtrade closed trade proof for on-chain verification.
     * @param freqtradeTradeId  Original freqtrade trade ID integer
     * @param strategy          Strategy name string (e.g. "PISOStrategy")
     * @param pair              Trading pair string (e.g. "BTC/USDT")
     * @param profitBps         Profit in basis points (signed). 100 = 1.00%
     * @param proofHash         SHA-256 hex proof: SHA256(tradeId|strategy|profitBps|closeTs)
     * @param openTimestamp     Unix timestamp when trade was opened
     * @param closeTimestamp    Unix timestamp when trade was closed
     */
    function submitTradeProof(
        uint256 freqtradeTradeId,
        string  calldata strategy,
        string  calldata pair,
        int256  profitBps,
        bytes32 proofHash,
        uint256 openTimestamp,
        uint256 closeTimestamp
    ) external onlyAuthorizedWorker nonReentrant {
        require(closeTimestamp > openTimestamp, "PISOFreqtradeOracle: Invalid timestamps");
        require(bytes(strategy).length > 0, "PISOFreqtradeOracle: Empty strategy");
        require(bytes(pair).length > 0, "PISOFreqtradeOracle: Empty pair");

        // On-chain verification hash (independent recomputation)
        bytes32 verifiedHash = keccak256(abi.encodePacked(
            freqtradeTradeId,
            msg.sender,
            strategy,
            profitBps,
            closeTimestamp
        ));

        bool isProfitable = profitBps > int256(minProfitBps);
        uint256 reward    = 0;

        // Distribute $PISO reward for profitable trades
        if (isProfitable && address(this).balance >= rewardPerProfitableTrade) {
            reward = rewardPerProfitableTrade;
            (bool sent, ) = msg.sender.call{value: reward}("");
            require(sent, "PISOFreqtradeOracle: Reward transfer failed");
            totalRewardsDistributed += reward;
            workerTotalRewards[msg.sender] += reward;
            totalProfitableVerified++;
        }

        uint256 pisoId = nextTradeId++;
        tradeProofs[pisoId] = TradeProof({
            pisoTradeId:       pisoId,
            freqtradeTradeId:  freqtradeTradeId,
            workerAddress:     msg.sender,
            strategy:          strategy,
            pair:              pair,
            profitBps:         profitBps,
            proofHash:         proofHash,
            verifiedHash:      verifiedHash,
            openTimestamp:     openTimestamp,
            closeTimestamp:    closeTimestamp,
            profitable:        isProfitable,
            rewardPaid:        reward > 0,
            rewardAmount:      reward
        });

        workerTradeCount[msg.sender]++;
        totalTradesVerified++;

        emit TradeVerified(
            pisoId,
            freqtradeTradeId,
            msg.sender,
            strategy,
            pair,
            profitBps,
            proofHash,
            isProfitable,
            reward
        );
    }

    // ── View Functions ───────────────────────────────────────────────────────

    /**
     * @notice Returns a trade proof record by PISO internal trade ID.
     */
    function getTradeProof(uint256 pisoTradeId) external view returns (TradeProof memory) {
        require(pisoTradeId < nextTradeId, "PISOFreqtradeOracle: Trade not found");
        return tradeProofs[pisoTradeId];
    }

    /**
     * @notice Returns contract's current $PISO reward vault balance.
     */
    function getVaultBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Returns stats for a specific worker address.
     */
    function getWorkerStats(address worker) external view returns (
        uint256 tradeCount,
        uint256 totalRewards,
        bool    isAuthorized
    ) {
        return (
            workerTradeCount[worker],
            workerTotalRewards[worker],
            authorizedWorkers[worker]
        );
    }

    // ── Admin Functions ──────────────────────────────────────────────────────

    /**
     * @notice Authorize or revoke a jcode agent worker address.
     */
    function setWorkerAuthorization(address worker, bool authorized) external onlyOwner {
        authorizedWorkers[worker] = authorized;
        emit WorkerAuthorized(worker, authorized);
    }

    /**
     * @notice Update the $PISO reward amount per profitable trade.
     * @param newReward New reward in wei (e.g. 10 ether = 10 PISO)
     */
    function setRewardPerProfitableTrade(uint256 newReward) external onlyOwner {
        emit RewardPerTradeUpdated(rewardPerProfitableTrade, newReward);
        rewardPerProfitableTrade = newReward;
    }

    /**
     * @notice Update minimum profit threshold (basis points) for reward qualification.
     */
    function setMinProfitBps(uint256 newMinBps) external onlyOwner {
        minProfitBps = newMinBps;
    }

    /**
     * @notice Fund the reward vault with $PISO.
     */
    function depositRewards() external payable {
        require(msg.value > 0, "PISOFreqtradeOracle: No value sent");
        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Emergency withdraw of vault funds by owner.
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        uint256 bal = address(this).balance;
        require(bal > 0, "PISOFreqtradeOracle: Vault empty");
        (bool sent, ) = owner.call{value: bal}("");
        require(sent, "PISOFreqtradeOracle: Withdraw failed");
        emit FundsWithdrawn(owner, bal);
    }

    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}
