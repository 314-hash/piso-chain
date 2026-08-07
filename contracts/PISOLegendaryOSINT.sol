// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOLegendaryOSINT
 * @dev On-chain forensic intelligence registry anchoring OSINT threat intelligence,
 * crypto wallet risk attestations, and infrastructure vulnerability hashes for PISO Chain.
 * Inspired by Legendary_OSINT (https://github.com/K2SOsint/Legendary_OSINT.git).
 */
contract PISOLegendaryOSINT {
    address public owner;
    uint256 public totalReportsRegistered;

    struct OSINTReportAttestation {
        bytes32 reportHash;
        address targetAddress;
        uint256 riskScore; // 0 - 100
        string category;
        string threatTag;
        uint256 timestamp;
        address reporter;
        bool isSanctioned;
    }

    mapping(bytes32 => OSINTReportAttestation) public osintReports;
    bytes32[] public reportHistory;

    event OSINTReportLogged(bytes32 indexed reportHash, address indexed targetAddress, uint256 riskScore, string category);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOLegendaryOSINT: Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register an OSINT forensic investigation attestation on-chain.
     */
    function logOSINTReport(
        bytes32 _reportHash,
        address _targetAddress,
        uint256 _riskScore,
        string calldata _category,
        string calldata _threatTag,
        bool _isSanctioned
    ) external returns (bool) {
        require(osintReports[_reportHash].timestamp == 0, "PISOLegendaryOSINT: Report already registered");
        require(_riskScore <= 100, "PISOLegendaryOSINT: Risk score out of bounds");

        osintReports[_reportHash] = OSINTReportAttestation({
            reportHash: _reportHash,
            targetAddress: _targetAddress,
            riskScore: _riskScore,
            category: _category,
            threatTag: _threatTag,
            timestamp: block.timestamp,
            reporter: msg.sender,
            isSanctioned: _isSanctioned
        });

        reportHistory.push(_reportHash);
        totalReportsRegistered++;

        emit OSINTReportLogged(_reportHash, _targetAddress, _riskScore, _category);
        return true;
    }

    function getReport(bytes32 _reportHash) external view returns (
        address target,
        uint256 riskScore,
        string memory category,
        string memory threatTag,
        bool isSanctioned,
        uint256 timestamp
    ) {
        OSINTReportAttestation memory r = osintReports[_reportHash];
        return (r.targetAddress, r.riskScore, r.category, r.threatTag, r.isSanctioned, r.timestamp);
    }
}
