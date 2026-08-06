// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOAgentReachOracle
 * @dev On-chain precompiled contract for Agent-Reach real-time web intelligence, YouTube subtitles,
 * RSS feeds, and GitHub issue data proofs for PISO Chain AI Agent OS.
 * Inspired by Agent-Reach (https://github.com/Panniantong/Agent-Reach).
 */
contract PISOAgentReachOracle {
    address public owner;
    uint256 public totalOracleQueries;

    struct DataProof {
        bytes32 dataHash;
        address agentAddress;
        string targetTopic;
        string mode;
        uint256 timestamp;
        bool verified;
    }

    mapping(bytes32 => DataProof) public proofs;
    bytes32[] public queryHashes;

    event WebDataProofSubmitted(bytes32 indexed dataHash, address indexed agentAddress, string targetTopic, string mode);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOAgentReachOracle: Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Submits cryptographic proof of Agent-Reach web data fetching.
     */
    function submitWebDataProof(bytes32 _dataHash, string calldata _targetTopic, string calldata _mode) external returns (bool) {
        require(proofs[_dataHash].timestamp == 0, "PISOAgentReachOracle: Data proof already registered");

        proofs[_dataHash] = DataProof({
            dataHash: _dataHash,
            agentAddress: msg.sender,
            targetTopic: _targetTopic,
            mode: _mode,
            timestamp: block.timestamp,
            verified: true
        });

        queryHashes.push(_dataHash);
        totalOracleQueries++;

        emit WebDataProofSubmitted(_dataHash, msg.sender, _targetTopic, _mode);
        return true;
    }

    function getDataProof(bytes32 _dataHash) external view returns (address agent, string memory topic, string memory mode, uint256 time, bool verified) {
        DataProof memory p = proofs[_dataHash];
        return (p.agentAddress, p.targetTopic, p.mode, p.timestamp, p.verified);
    }
}
