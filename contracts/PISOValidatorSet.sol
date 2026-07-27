// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOValidatorSet
 * @notice System Contract deployed at precompiled address 0x0000000000000000000000000000000000001000
 * Handles dynamic PoSA validator set registration, staking delegation, slash penalties, and epoch rotation.
 */
contract PISOValidatorSet {
    
    struct Validator {
        address consensusAddress;
        address feeRecipient;
        uint256 stakedAmount;
        bool isActive;
        bool isJailed;
        uint256 jailedUntilBlock;
        uint256 missedBlocksCount;
    }

    // Pre-allocated system address for EVM PoSA Engine
    address public constant SYSTEM_ADDRESS = 0x0000000000000000000000000000000000001000;
    address public constant SLASH_INDICATOR = 0x0000000000000000000000000000000000001001;
    
    // Constants
    uint256 public constant MIN_STAKE = 100_000 ether; // 100k PISO min stake
    uint256 public constant MAX_VALIDATORS = 21;
    uint256 public constant SLASH_THRESHOLD = 50; // Miss 50 blocks = jailed
    uint256 public constant JAIL_DURATION_BLOCKS = 28800; // ~1 day at 3s block time

    // Governance owner / DAO contract address
    address public governor;

    // State Variables
    address[] public activeValidators;
    mapping(address => Validator) public validators;
    mapping(address => uint256) public userDelegatedStake;

    // Events
    event ValidatorRegistered(address indexed validator, address feeRecipient, uint256 stake);
    event ValidatorSlashed(address indexed validator, uint256 missedBlocks, bool jailed);
    event ValidatorJailed(address indexed validator, uint256 untilBlock);
    event ValidatorStakeBurned(address indexed validator, uint256 burnedAmount);
    event ValidatorUnjailed(address indexed validator);
    event Staked(address indexed delegator, address indexed validator, uint256 amount);
    event Unstaked(address indexed delegator, address indexed validator, uint256 amount);

    modifier onlySystemOrSlash() {
        require(
            msg.sender == SYSTEM_ADDRESS || msg.sender == SLASH_INDICATOR || msg.sender == governor,
            "PISOValidatorSet: Only System, SlashIndicator, or Governor"
        );
        _;
    }

    constructor(address _governor, address[] memory _initialValidators) {
        governor = _governor;
        for (uint256 i = 0; i < _initialValidators.length; i++) {
            address val = _initialValidators[i];
            validators[val] = Validator({
                consensusAddress: val,
                feeRecipient: val,
                stakedAmount: MIN_STAKE,
                isActive: true,
                isJailed: false,
                jailedUntilBlock: 0,
                missedBlocksCount: 0
            });
            activeValidators.push(val);
            emit ValidatorRegistered(val, val, MIN_STAKE);
        }
    }

    /**
     * @notice Registers a new node as a candidate validator by staking native PISO coin.
     */
    function registerValidator(address feeRecipient) external payable {
        require(msg.value >= MIN_STAKE, "PISOValidatorSet: Insufficient stake");
        require(!validators[msg.sender].isActive, "PISOValidatorSet: Already active validator");
        require(activeValidators.length < MAX_VALIDATORS, "PISOValidatorSet: Max validator capacity reached");

        validators[msg.sender] = Validator({
            consensusAddress: msg.sender,
            feeRecipient: feeRecipient,
            stakedAmount: msg.value,
            isActive: true,
            isJailed: false,
            jailedUntilBlock: 0,
            missedBlocksCount: 0
        });

        activeValidators.push(msg.sender);
        emit ValidatorRegistered(msg.sender, feeRecipient, msg.value);
    }

    /**
     * @notice Called by PoSA engine or SlashIndicator to report missing blocks.
     */
    function reportMissedBlock(address validatorAddress) external onlySystemOrSlash {
        Validator storage val = validators[validatorAddress];
        if (!val.isActive || val.isJailed) return;

        val.missedBlocksCount++;
        if (val.missedBlocksCount >= SLASH_THRESHOLD) {
            val.isJailed = true;
            val.jailedUntilBlock = block.number + JAIL_DURATION_BLOCKS;
            val.isActive = false;
            
            _removeFromActiveValidators(validatorAddress);
            emit ValidatorSlashed(validatorAddress, val.missedBlocksCount, true);
        }
    }

    /**
     * @notice Explicitly jail a validator for a given block duration (e.g. double signing).
     */
    function jailValidator(address validatorAddress, uint256 durationBlocks) external onlySystemOrSlash {
        Validator storage val = validators[validatorAddress];
        val.isJailed = true;
        val.isActive = false;
        val.jailedUntilBlock = block.number + durationBlocks;

        _removeFromActiveValidators(validatorAddress);
        emit ValidatorJailed(validatorAddress, val.jailedUntilBlock);
    }

    /**
     * @notice Slashes a percentage of a validator's staked balance for severe infractions.
     */
    function slashValidatorStake(address validatorAddress, uint256 percentage) external onlySystemOrSlash {
        require(percentage <= 100, "Invalid percentage");
        Validator storage val = validators[validatorAddress];
        uint256 burnAmount = (val.stakedAmount * percentage) / 100;
        
        if (burnAmount > 0) {
            val.stakedAmount -= burnAmount;
            emit ValidatorStakeBurned(validatorAddress, burnAmount);
        }
    }

    /**
     * @notice Unjails a validator after their penalty period has expired.
     */
    function unjail() external {
        Validator storage val = validators[msg.sender];
        require(val.isJailed, "PISOValidatorSet: Not jailed");
        require(block.number >= val.jailedUntilBlock, "PISOValidatorSet: Jail period not finished");

        val.isJailed = false;
        val.isActive = true;
        val.missedBlocksCount = 0;
        activeValidators.push(msg.sender);

        emit ValidatorUnjailed(msg.sender);
    }

    /**
     * @notice Returns the list of currently active signing consensus validators.
     */
    function getValidators() external view returns (address[] memory) {
        return activeValidators;
    }

    function _removeFromActiveValidators(address val) internal {
        uint256 len = activeValidators.length;
        for (uint256 i = 0; i < len; i++) {
            if (activeValidators[i] == val) {
                activeValidators[i] = activeValidators[len - 1];
                activeValidators.pop();
                break;
            }
        }
    }
}
