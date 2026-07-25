// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISO Chain AI Validator Telemetry & Dynamic Gas Oracle
 * @notice Provides real-time validator metrics, network security threat scoring,
 * and dynamic gas price recommendation for smart contracts on PISO Chain.
 */
contract PISOAIOracle {
    address public owner;
    
    struct ValidatorNode {
        address validatorAddress;
        uint256 uptimePercentage;   // Basis points (e.g. 9995 = 99.95%)
        uint256 blocksProduced;
        uint256 latencyMs;
        bool active;
    }

    struct NetworkTelemetry {
        uint256 activeValidatorCount;
        uint256 averageBlockTimeMs;
        uint256 suggestedGasPriceWei;
        uint256 networkThreatLevel;  // 0 = Normal, 1 = Elevated, 2 = High Alert
        uint256 lastUpdatedTimestamp;
    }

    mapping(address => ValidatorNode) public validators;
    address[] public validatorList;
    NetworkTelemetry public currentTelemetry;

    event ValidatorTelemetryUpdated(address indexed validator, uint256 uptime, uint256 latencyMs);
    event NetworkTelemetryUpdated(uint256 activeValidators, uint256 avgBlockTime, uint256 suggestedGasPrice, uint256 threatLevel);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOAIOracle: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        currentTelemetry = NetworkTelemetry({
            activeValidatorCount: 1,
            averageBlockTimeMs: 5000,
            suggestedGasPriceWei: 1000000000, // 1 Gwei
            networkThreatLevel: 0,
            lastUpdatedTimestamp: block.timestamp
        });
    }

    /**
     * @notice Submit validator performance metrics from telemetry agents.
     */
    function reportValidatorMetrics(
        address validatorAddr,
        uint256 uptimePercentage,
        uint256 blocksProduced,
        uint256 latencyMs
    ) external onlyOwner {
        if (!validators[validatorAddr].active) {
            validators[validatorAddr].active = true;
            validatorList.push(validatorAddr);
        }

        validators[validatorAddr].validatorAddress = validatorAddr;
        validators[validatorAddr].uptimePercentage = uptimePercentage;
        validators[validatorAddr].blocksProduced = blocksProduced;
        validators[validatorAddr].latencyMs = latencyMs;

        emit ValidatorTelemetryUpdated(validatorAddr, uptimePercentage, latencyMs);
    }

    /**
     * @notice Update holistic network telemetry & dynamic gas recommendation.
     */
    function updateNetworkTelemetry(
        uint256 activeValidators,
        uint256 avgBlockTime,
        uint256 suggestedGasPrice,
        uint256 threatLevel
    ) external onlyOwner {
        currentTelemetry = NetworkTelemetry({
            activeValidatorCount: activeValidators,
            averageBlockTimeMs: avgBlockTime,
            suggestedGasPriceWei: suggestedGasPrice,
            networkThreatLevel: threatLevel,
            lastUpdatedTimestamp: block.timestamp
        });

        emit NetworkTelemetryUpdated(activeValidators, avgBlockTime, suggestedGasPrice, threatLevel);
    }

    /**
     * @notice Query current network status and dynamic gas price suggestion.
     */
    function getRecommendedGasPrice() external view returns (uint256 suggestedGas, uint256 threatLevel) {
        return (currentTelemetry.suggestedGasPriceWei, currentTelemetry.networkThreatLevel);
    }

    /**
     * @notice Get count of registered validators.
     */
    function getValidatorCount() external view returns (uint256) {
        return validatorList.length;
    }
}
