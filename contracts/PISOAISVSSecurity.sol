// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOAISVSSecurity
 * @dev On-chain AI Security Verification Standard (OWASP AISVS v1.0) audit logger,
 * execution token budget limiter, and security compliance attestation contract.
 * Inspired by OWASP/AISVS (https://github.com/OWASP/AISVS.git).
 */
contract PISOAISVSSecurity {
    address public owner;
    uint256 public totalAuditProofs;

    struct AISVSAuditAttestation {
        bytes32 proofHash;
        address agentAddress;
        uint256 complianceScoreScaled; // 0 - 1000 (e.g. 1000 = 100.0%)
        uint256 executionBudgetLimit;
        string assuranceLevel; // L1, L2, L3
        uint256 timestamp;
        bool isApproved;
    }

    mapping(bytes32 => AISVSAuditAttestation) public auditProofs;
    bytes32[] public proofHistory;

    event SecurityAuditLogged(bytes32 indexed proofHash, address indexed agentAddress, uint256 score, string level);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOAISVSSecurity: Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register an AISVS security verification audit proof.
     */
    function logSecurityAudit(
        bytes32 _proofHash,
        address _agentAddress,
        uint256 _scoreScaled,
        uint256 _budgetLimit,
        string calldata _assuranceLevel
    ) external returns (bool) {
        require(auditProofs[_proofHash].timestamp == 0, "PISOAISVSSecurity: Proof already registered");

        auditProofs[_proofHash] = AISVSAuditAttestation({
            proofHash: _proofHash,
            agentAddress: _agentAddress,
            complianceScoreScaled: _scoreScaled,
            executionBudgetLimit: _budgetLimit,
            assuranceLevel: _assuranceLevel,
            timestamp: block.timestamp,
            isApproved: true
        });

        proofHistory.push(_proofHash);
        totalAuditProofs++;

        emit SecurityAuditLogged(_proofHash, _agentAddress, _scoreScaled, _assuranceLevel);
        return true;
    }

    function getAuditProof(bytes32 _proofHash) external view returns (
        address agent,
        uint256 score,
        uint256 budget,
        string memory level,
        bool approved,
        uint256 timestamp
    ) {
        AISVSAuditAttestation memory p = auditProofs[_proofHash];
        return (p.agentAddress, p.complianceScoreScaled, p.executionBudgetLimit, p.assuranceLevel, p.isApproved, p.timestamp);
    }
}
