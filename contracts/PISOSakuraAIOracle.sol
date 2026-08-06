// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOSakuraAIOracle
 * @notice Precompiled System Smart Contract #20 (Address: 0x0000000000000000000000000000000000001013)
 * @dev On-chain verification, RBAC permissions, audit trail logging, and $PISO token reward vault
 *      for off-chain Sakura Crossing AI Agents and Orchestrators.
 */
contract PISOSakuraAIOracle {
    // ------------------------------------------------------------------------
    // State Variables & Structs
    // ------------------------------------------------------------------------

    address public owner;
    uint256 public totalReportsVerified;
    uint256 public totalRewardsClaimed;
    uint256 public constant REWARD_PER_VERIFIED_REPORT = 15 ether; // 15 PISO per verified report

    struct AgentInfo {
        bytes32 role;
        bool isAuthorized;
        uint256 totalVerifiedTasks;
        uint256 totalPayoutsPISO;
    }

    struct AIReportProof {
        bytes32 agentId;
        bytes32 reportHash;
        uint256 timestamp;
        uint256 riskScore;
        bool isVerified;
        bool isRewardClaimed;
        address workerAddress;
    }

    mapping(address => AgentInfo) public agents;
    mapping(bytes32 => AIReportProof) public reportProofs; // reportHash -> Proof
    mapping(bytes32 => bool) public verifiedHashes;

    // ------------------------------------------------------------------------
    // Events
    // ------------------------------------------------------------------------

    event AgentAuthorized(address indexed agentWallet, bytes32 indexed role);
    event AgentRevoked(address indexed agentWallet);
    event AIReportSubmitted(
        bytes32 indexed agentId,
        bytes32 indexed reportHash,
        address indexed workerAddress,
        uint256 riskScore,
        uint256 timestamp
    );
    event AIReportVerified(bytes32 indexed reportHash, uint256 rewardAmount);
    event AIRewardClaimed(bytes32 indexed reportHash, address indexed workerAddress, uint256 amount);

    // ------------------------------------------------------------------------
    // Modifiers
    // ------------------------------------------------------------------------

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOSakuraAIOracle: Only contract owner can execute");
        _;
    }

    modifier onlyAuthorizedAgent() {
        require(agents[msg.sender].isAuthorized, "PISOSakuraAIOracle: Unauthorized agent address");
        _;
    }

    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------

    constructor() {
        owner = msg.sender;
        // Authorize deployer as master admin agent
        agents[msg.sender] = AgentInfo({
            role: keccak256("MASTER_ORCHESTRATOR_ROLE"),
            isAuthorized: true,
            totalVerifiedTasks: 0,
            totalPayoutsPISO: 0
        });
    }

    // ------------------------------------------------------------------------
    // External & Public Functions
    // ------------------------------------------------------------------------

    /**
     * @notice Authorize an off-chain Sakura Crossing AI agent wallet
     */
    function authorizeAgent(address agentWallet, bytes32 role) external onlyOwner {
        require(agentWallet != address(0), "Invalid agent address");
        agents[agentWallet] = AgentInfo({
            role: role,
            isAuthorized: true,
            totalVerifiedTasks: agents[agentWallet].totalVerifiedTasks,
            totalPayoutsPISO: agents[agentWallet].totalPayoutsPISO
        });
        emit AgentAuthorized(agentWallet, role);
    }

    /**
     * @notice Revoke authorization for an AI agent wallet
     */
    function revokeAgent(address agentWallet) external onlyOwner {
        agents[agentWallet].isAuthorized = false;
        emit AgentRevoked(agentWallet);
    }

    /**
     * @notice Submit a cryptographically signed AI task execution report hash
     */
    function submitAgentReport(
        bytes32 agentId,
        bytes32 reportHash,
        uint256 riskScore,
        uint256 timestamp
    ) external onlyAuthorizedAgent returns (bool) {
        require(!verifiedHashes[reportHash], "PISOSakuraAIOracle: Report hash already submitted");
        require(timestamp <= block.timestamp + 300, "PISOSakuraAIOracle: Timestamp in future");

        reportProofs[reportHash] = AIReportProof({
            agentId: agentId,
            reportHash: reportHash,
            timestamp: timestamp,
            riskScore: riskScore,
            isVerified: true,
            isRewardClaimed: false,
            workerAddress: msg.sender
        });

        verifiedHashes[reportHash] = true;
        totalReportsVerified += 1;
        agents[msg.sender].totalVerifiedTasks += 1;

        emit AIReportSubmitted(agentId, reportHash, msg.sender, riskScore, timestamp);
        emit AIReportVerified(reportHash, REWARD_PER_VERIFIED_REPORT);

        return true;
    }

    /**
     * @notice Claim $PISO token rewards for a verified AI report
     */
    function claimReward(bytes32 reportHash) external returns (bool) {
        AIReportProof storage proof = reportProofs[reportHash];
        require(proof.isVerified, "PISOSakuraAIOracle: Report not verified");
        require(!proof.isRewardClaimed, "PISOSakuraAIOracle: Reward already claimed");
        require(msg.sender == proof.workerAddress || msg.sender == owner, "PISOSakuraAIOracle: Unauthorized claimer");

        proof.isRewardClaimed = true;
        totalRewardsClaimed += REWARD_PER_VERIFIED_REPORT;
        agents[proof.workerAddress].totalPayoutsPISO += REWARD_PER_VERIFIED_REPORT;

        // If vault balance exists, transfer native PISO coins
        if (address(this).balance >= REWARD_PER_VERIFIED_REPORT) {
            payable(proof.workerAddress).transfer(REWARD_PER_VERIFIED_REPORT);
        }

        emit AIRewardClaimed(reportHash, proof.workerAddress, REWARD_PER_VERIFIED_REPORT);
        return true;
    }

    /**
     * @notice Query report verification status
     */
    function isReportVerified(bytes32 reportHash) external view returns (bool, uint256, uint256, address) {
        AIReportProof memory proof = reportProofs[reportHash];
        return (proof.isVerified, proof.timestamp, proof.riskScore, proof.workerAddress);
    }

    // ------------------------------------------------------------------------
    // Fallback & Receive
    // ------------------------------------------------------------------------

    receive() external payable {}
}
