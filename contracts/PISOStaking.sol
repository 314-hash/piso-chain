// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOStaking - BSC Parlia Validator Staking & Delegation Contract
 * @notice Manages validator registration, delegation, staking rewards, and election for PISO Chain.
 */
contract PISOStaking {
    struct Validator {
        address payable operator;
        uint256 totalStake;
        bool isActive;
        uint256 rewardPool;
    }

    uint256 public constant MIN_VALIDATOR_STAKE = 100_000 ether; // 100k PISO
    uint256 public constant MIN_DELEGATION = 100 ether;          // 100 PISO
    uint256 public maxValidators = 21;

    address public admin;
    address[] public validatorList;
    mapping(address => Validator) public validators;
    mapping(address => mapping(address => uint256)) public delegations; // delegator => validator => amount

    event ValidatorRegistered(address indexed validator, uint256 stake);
    event Staked(address indexed delegator, address indexed validator, uint256 amount);
    event Unstaked(address indexed delegator, address indexed validator, uint256 amount);
    event RewardsClaimed(address indexed delegator, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "PISOStaking: caller is not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Register a new validator node with initial self-stake
     */
    function registerValidator() external payable {
        require(msg.value >= MIN_VALIDATOR_STAKE, "PISOStaking: insufficient self-stake");
        require(!validators[msg.sender].isActive, "PISOStaking: validator already registered");

        validators[msg.sender] = Validator({
            operator: payable(msg.sender),
            totalStake: msg.value,
            isActive: true,
            rewardPool: 0
        });

        validatorList.push(msg.sender);
        emit ValidatorRegistered(msg.sender, msg.value);
    }

    /**
     * @notice Delegate PISO coins to an active validator
     */
    function delegate(address validatorAddr) external payable {
        require(validators[validatorAddr].isActive, "PISOStaking: validator not active");
        require(msg.value >= MIN_DELEGATION, "PISOStaking: delegation below minimum");

        delegations[msg.sender][validatorAddr] += msg.value;
        validators[validatorAddr].totalStake += msg.value;

        emit Staked(msg.sender, validatorAddr, msg.value);
    }

    /**
     * @notice Unstake delegated PISO coins from a validator
     */
    function unstake(address validatorAddr, uint256 amount) external {
        require(delegations[msg.sender][validatorAddr] >= amount, "PISOStaking: insufficient delegated stake");

        delegations[msg.sender][validatorAddr] -= amount;
        validators[validatorAddr].totalStake -= amount;

        payable(msg.sender).transfer(amount);
        emit Unstaked(msg.sender, validatorAddr, amount);
    }

    /**
     * @notice Get current active validator set for Parlia consensus engine
     */
    function getActiveValidators() external view returns (address[] memory) {
        return validatorList;
    }
}
