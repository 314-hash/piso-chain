// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOPublicApisOracle
 * @dev On-chain precompiled contract for public-apis discovery catalog, category indexes,
 * and cryptographic API data proof hashes for PISO Chain AI Agent OS.
 * Inspired by public-apis (https://github.com/public-apis/public-apis.git).
 */
contract PISOPublicApisOracle {
    address public owner;
    uint256 public totalApiQueries;

    struct ApiDataProof {
        bytes32 dataHash;
        address agentAddress;
        string category;
        string apiName;
        uint256 timestamp;
        bool verified;
    }

    mapping(bytes32 => ApiDataProof) public dataProofs;
    bytes32[] public queryHistory;

    event ApiDataProofSubmitted(bytes32 indexed dataHash, address indexed agentAddress, string category, string apiName);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOPublicApisOracle: Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Submits cryptographic proof of Public APIs oracle query data payload.
     */
    function submitApiDataProof(
        bytes32 _dataHash,
        string calldata _category,
        string calldata _apiName
    ) external returns (bool) {
        require(dataProofs[_dataHash].timestamp == 0, "PISOPublicApisOracle: API data proof already registered");

        dataProofs[_dataHash] = ApiDataProof({
            dataHash: _dataHash,
            agentAddress: msg.sender,
            category: _category,
            apiName: _apiName,
            timestamp: block.timestamp,
            verified: true
        });

        queryHistory.push(_dataHash);
        totalApiQueries++;

        emit ApiDataProofSubmitted(_dataHash, msg.sender, _category, _apiName);
        return true;
    }

    function getApiDataProof(bytes32 _dataHash) external view returns (address agent, string memory category, string memory apiName, uint256 time, bool verified) {
        ApiDataProof memory p = dataProofs[_dataHash];
        return (p.agentAddress, p.category, p.apiName, p.timestamp, p.verified);
    }
}
