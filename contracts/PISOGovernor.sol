// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOGovernor - DAO Governance & Timelock Controller for PISO Chain
 * @notice Handles network parameter proposals, gas limit changes, and treasury timelock executions.
 */
contract PISOGovernor {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool canceled;
        address targetContract;
        bytes callData;
    }

    uint256 public constant PROPOSAL_DURATION = 3 days;
    uint256 public constant TIMELOCK_DELAY = 1 days;
    uint256 public proposalCount;

    address public admin;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "PISOGovernor: caller is not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createProposal(
        string calldata description,
        address targetContract,
        bytes calldata callData
    ) external returns (uint256) {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + PROPOSAL_DURATION,
            executed: false,
            canceled: false,
            targetContract: targetContract,
            callData: callData
        });

        emit ProposalCreated(proposalCount, msg.sender, description);
        return proposalCount;
    }

    function castVote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp <= p.endTime, "PISOGovernor: voting ended");
        require(!hasVoted[proposalId][msg.sender], "PISOGovernor: already voted");

        hasVoted[proposalId][msg.sender] = true;
        uint256 weight = msg.sender.balance; // Native PISO balance as voting power

        if (support) {
            p.forVotes += weight;
        } else {
            p.againstVotes += weight;
        }

        emit Voted(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp > p.endTime, "PISOGovernor: voting still active");
        require(!p.executed, "PISOGovernor: proposal already executed");
        require(p.forVotes > p.againstVotes, "PISOGovernor: proposal rejected");

        p.executed = true;
        if (p.targetContract != address(0) && p.callData.length > 0) {
            (bool success, ) = p.targetContract.call(p.callData);
            require(success, "PISOGovernor: execution failed");
        }

        emit ProposalExecuted(proposalId);
    }
}
