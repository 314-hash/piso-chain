// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOSlashIndicator
 * @notice System Contract for PISO Chain (BSC Parlia / PoSA inspired)
 * Deployed at precompiled system address 0x0000000000000000000000000000000000001001
 * Tracks block miss misdemeanors, double-signing evidence, and triggers jailing/slashing via PISOValidatorSet.
 */

interface IPISOValidatorSet {
    function reportMissedBlock(address validatorAddress) external;
    function jailValidator(address validatorAddress, uint256 durationBlocks) external;
    function slashValidatorStake(address validatorAddress, uint256 percentage) external;
}

contract PISOSlashIndicator {

    // Precompiled system address for Consensus Engine call
    address public constant SYSTEM_ADDRESS = 0x0000000000000000000000000000000000001000;
    address public constant VALIDATOR_SET_ADDR = 0x0000000000000000000000000000000000001000;

    // Thresholds
    uint256 public constant MISDEMEANOR_THRESHOLD = 50; // 50 missed blocks = temporary jail
    uint256 public constant FELONY_THRESHOLD = 150;      // 150 missed blocks = severe jail & stake burn
    uint256 public constant DOUBLE_SIGN_SLASH_PERCENT = 20; // 20% stake slashed on double-sign

    // State Variables
    mapping(address => uint256) public misdemeanorCount;
    mapping(address => uint256) public felonyCount;
    mapping(bytes32 => bool) public processedEvidence;

    // Events
    event MisdemeanorReported(address indexed validator, uint256 count);
    event FelonyReported(address indexed validator, uint256 count);
    event DoubleSignSlashed(address indexed validator, bytes32 indexed evidenceHash, uint256 slashedAmount);

    modifier onlySystem() {
        require(msg.sender == SYSTEM_ADDRESS, "PISOSlashIndicator: Only System Engine");
        _;
    }

    /**
     * @notice Called automatically by the consensus engine when a validator misses their block proposal slot.
     */
    function slash(address validator) external onlySystem {
        misdemeanorCount[validator]++;
        uint256 currentMisses = misdemeanorCount[validator];

        emit MisdemeanorReported(validator, currentMisses);

        if (currentMisses == MISDEMEANOR_THRESHOLD) {
            // Temporary jail via ValidatorSet contract
            IPISOValidatorSet(VALIDATOR_SET_ADDR).reportMissedBlock(validator);
        } else if (currentMisses >= FELONY_THRESHOLD) {
            felonyCount[validator]++;
            misdemeanorCount[validator] = 0;
            emit FelonyReported(validator, felonyCount[validator]);
            
            // Severe jail + 5% stake slash
            IPISOValidatorSet(VALIDATOR_SET_ADDR).slashValidatorStake(validator, 5);
        }
    }

    /**
     * @notice Submit cryptographic proof of double-signing (signing 2 different blocks at the same height).
     */
    function submitDoubleSignEvidence(
        address validator,
        bytes memory header1,
        bytes memory header2
    ) external {
        bytes32 evidenceHash = keccak256(abi.encodePacked(header1, header2));
        require(!processedEvidence[evidenceHash], "PISOSlashIndicator: Evidence already processed");
        
        processedEvidence[evidenceHash] = true;

        // Slash 20% of validator stake immediately and jail indefinitely
        IPISOValidatorSet(VALIDATOR_SET_ADDR).slashValidatorStake(validator, DOUBLE_SIGN_SLASH_PERCENT);
        IPISOValidatorSet(VALIDATOR_SET_ADDR).jailValidator(validator, 1_000_000); // ~34 days

        emit DoubleSignSlashed(validator, evidenceHash, DOUBLE_SIGN_SLASH_PERCENT);
    }

    /**
     * @notice Clears misdemeanor record upon epoch change for healthy nodes.
     */
    function resetRecord(address validator) external onlySystem {
        misdemeanorCount[validator] = 0;
    }
}
