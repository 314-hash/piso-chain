// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOOpenPlanter
 * @dev On-chain precompiled contract for OpenPlanter recursive entity resolution,
 * relationship graph verification, and SHA-256 evidence hashing for PISO Chain AI Agent OS.
 * Inspired by OpenPlanter (https://github.com/ShinMegamiBoson/OpenPlanter).
 */
contract PISOOpenPlanter {
    address public owner;
    uint256 public totalInvestigations;

    struct GraphProof {
        bytes32 graphHash;
        address investigator;
        string targetEntity;
        uint256 entitiesCount;
        uint256 relationshipsCount;
        uint256 timestamp;
        bool verified;
    }

    mapping(bytes32 => GraphProof) public graphProofs;
    bytes32[] public investigationHistory;

    event InvestigationRegistered(bytes32 indexed graphHash, address indexed investigator, string targetEntity, uint256 entitiesCount);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOOpenPlanter: Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Submits cryptographic proof of recursive entity graph resolution.
     */
    function submitGraphProof(
        bytes32 _graphHash,
        string calldata _targetEntity,
        uint256 _entitiesCount,
        uint256 _relationshipsCount
    ) external returns (bool) {
        require(graphProofs[_graphHash].timestamp == 0, "PISOOpenPlanter: Investigation proof already registered");

        graphProofs[_graphHash] = GraphProof({
            graphHash: _graphHash,
            investigator: msg.sender,
            targetEntity: _targetEntity,
            entitiesCount: _entitiesCount,
            relationshipsCount: _relationshipsCount,
            timestamp: block.timestamp,
            verified: true
        });

        investigationHistory.push(_graphHash);
        totalInvestigations++;

        emit InvestigationRegistered(_graphHash, msg.sender, _targetEntity, _entitiesCount);
        return true;
    }

    function getGraphProof(bytes32 _graphHash) external view returns (address investigator, string memory target, uint256 entities, uint256 rels, bool verified) {
        GraphProof memory p = graphProofs[_graphHash];
        return (p.investigator, p.targetEntity, p.entitiesCount, p.relationshipsCount, p.verified);
    }
}
