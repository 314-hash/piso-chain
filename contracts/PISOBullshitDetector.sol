// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOBullshitDetector
 * @dev On-chain precompiled contract for bullshit-detector claim-by-claim verification reports,
 * BS score logging (0-10 scale), and on-chain source proof hashing for PISO Chain AI Agent OS.
 * Inspired by bullshit-detector (https://github.com/SerhiiKorniienko/bullshit-detector.git).
 */
contract PISOBullshitDetector {
    address public owner;
    uint256 public totalAuditsPerformed;

    struct AuditReportProof {
        bytes32 reportHash;
        address verifier;
        string targetUrl;
        uint256 bsScoreScaled; // BS Score * 10 (e.g. 24 = 2.4 / 10)
        uint256 claimsCount;
        uint256 timestamp;
        bool verified;
    }

    mapping(bytes32 => AuditReportProof) public auditProofs;
    bytes32[] public auditHistory;

    event ReportRegistered(bytes32 indexed reportHash, address indexed verifier, string targetUrl, uint256 bsScoreScaled);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOBullshitDetector: Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Submits cryptographic proof of claim-by-claim audit report & BS score.
     */
    function registerAuditReport(
        bytes32 _reportHash,
        string calldata _targetUrl,
        uint256 _bsScoreScaled,
        uint256 _claimsCount
    ) external returns (bool) {
        require(auditProofs[_reportHash].timestamp == 0, "PISOBullshitDetector: Audit report already registered");
        require(_bsScoreScaled <= 100, "PISOBullshitDetector: BS Score out of bounds (max 100)");

        auditProofs[_reportHash] = AuditReportProof({
            reportHash: _reportHash,
            verifier: msg.sender,
            targetUrl: _targetUrl,
            bsScoreScaled: _bsScoreScaled,
            claimsCount: _claimsCount,
            timestamp: block.timestamp,
            verified: true
        });

        auditHistory.push(_reportHash);
        totalAuditsPerformed++;

        emit ReportRegistered(_reportHash, msg.sender, _targetUrl, _bsScoreScaled);
        return true;
    }

    function getAuditProof(bytes32 _reportHash) external view returns (address verifier, string memory url, uint256 bsScore, uint256 claims, bool verified) {
        AuditReportProof memory p = auditProofs[_reportHash];
        return (p.verifier, p.targetUrl, p.bsScoreScaled, p.claimsCount, p.verified);
    }
}
