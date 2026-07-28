// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOFaucet
 * @notice On-chain Rate-Limited Faucet for dispensing PISO testnet coins to dApp developers.
 * Includes 24-hour address cooldowns, daily drip limits, and security pause controls.
 */
contract PISOFaucet {

    address public owner;
    uint256 public dripAmount = 1 ether; // 1 PISO per drip request
    uint256 public cooldownTime = 24 hours; // 24-hour rate limit
    bool public paused = false;
    bool private _locked;

    // Last request timestamp mapping
    mapping(address => uint256) public lastRequestTime;

    // Events
    event Drip(address indexed recipient, uint256 amount, uint256 timestamp);
    event FaucetFunded(address indexed donor, uint256 amount);
    event DripAmountUpdated(uint256 newAmount);
    event CooldownUpdated(uint256 newCooldown);
    event PausedStateChanged(bool isPaused);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOFaucet: Only owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "PISOFaucet: Faucet is paused");
        _;
    }

    modifier nonReentrant() {
        require(!_locked, "PISOFaucet: Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Claim 1 native PISO coin for development and testing.
     */
    function requestTokens() external whenNotPaused nonReentrant {
        require(
            block.timestamp >= lastRequestTime[msg.sender] + cooldownTime,
            "PISOFaucet: Cooldown active. Try again in 24 hours."
        );
        require(address(this).balance >= dripAmount, "PISOFaucet: Insufficient faucet vault balance");

        lastRequestTime[msg.sender] = block.timestamp;
        
        (bool success, ) = payable(msg.sender).call{value: dripAmount}("");
        require(success, "PISOFaucet: Transfer failed");

        emit Drip(msg.sender, dripAmount, block.timestamp);
    }

    /**
     * @notice Allows admins or donors to deposit native PISO coins into the faucet vault.
     */
    receive() external payable {
        emit FaucetFunded(msg.sender, msg.value);
    }

    /**
     * @notice Admin function to update drip amount per request.
     */
    function setDripAmount(uint256 _newAmount) external onlyOwner {
        dripAmount = _newAmount;
        emit DripAmountUpdated(_newAmount);
    }

    /**
     * @notice Admin function to update cooldown duration.
     */
    function setCooldownTime(uint256 _newCooldown) external onlyOwner {
        cooldownTime = _newCooldown;
        emit CooldownUpdated(_newCooldown);
    }

    /**
     * @notice Admin toggle for emergency pause.
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit PausedStateChanged(_paused);
    }

    /**
     * @notice Returns remaining cooldown seconds for a user.
     */
    function getRemainingCooldown(address user) external view returns (uint256) {
        if (block.timestamp >= lastRequestTime[user] + cooldownTime) {
            return 0;
        }
        return (lastRequestTime[user] + cooldownTime) - block.timestamp;
    }
}
