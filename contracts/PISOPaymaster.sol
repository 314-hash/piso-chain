// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISO Chain Native Paymaster (EIP-4337 Compatible)
 * @notice Enables gasless microtransactions and dApp-sponsored gas on PISO Chain.
 */
contract PISOPaymaster {
    address public owner;
    bool private _locked;
    mapping(address => bool) public approvedSponsors;
    mapping(address => uint256) public sponsorBalances;

    event SponsorDeposited(address indexed sponsor, uint256 amount);
    event SponsorWithdrawn(address indexed sponsor, uint256 amount);
    event GasSponsored(address indexed user, address indexed sponsor, uint256 actualGasCost);
    event SponsorStatusChanged(address indexed sponsor, bool status);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOPaymaster: caller is not the owner");
        _;
    }

    modifier onlySponsor() {
        require(approvedSponsors[msg.sender], "PISOPaymaster: caller is not an approved sponsor");
        _;
    }

    modifier nonReentrant() {
        require(!_locked, "PISOPaymaster: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    constructor() {
        owner = msg.sender;
        approvedSponsors[msg.sender] = true;
    }

    /**
     * @notice Deposit PISO coins into the Paymaster vault to sponsor gas.
     */
    function depositGasVault() external payable {
        require(msg.value > 0, "PISOPaymaster: deposit must be greater than 0");
        sponsorBalances[msg.sender] += msg.value;
        emit SponsorDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Set approval status for dApp sponsors.
     */
    function setSponsorStatus(address sponsor, bool status) external onlyOwner {
        approvedSponsors[sponsor] = status;
        emit SponsorStatusChanged(sponsor, status);
    }

    /**
     * @notice Validate and execute gas sponsorship for user transaction.
     * @param user Address of the transaction sender
     * @param maxGasCost Maximum allowed gas cost for execution
     * @param signature Cryptographic authorization signature from sponsor
     */
    function validateAndSponsorGas(
        address user,
        uint256 maxGasCost,
        bytes calldata signature
    ) external onlySponsor returns (bool) {
        require(user != address(0), "PISOPaymaster: invalid user address");
        require(sponsorBalances[msg.sender] >= maxGasCost, "PISOPaymaster: insufficient sponsor gas balance");
        require(signature.length >= 64, "PISOPaymaster: invalid sponsor signature length");

        sponsorBalances[msg.sender] -= maxGasCost;
        emit GasSponsored(user, msg.sender, maxGasCost);
        return true;
    }

    /**
     * @notice Withdraw unused gas deposit from Paymaster vault.
     */
    function withdrawDeposit(uint256 amount) external nonReentrant {
        require(sponsorBalances[msg.sender] >= amount, "PISOPaymaster: insufficient balance to withdraw");
        sponsorBalances[msg.sender] -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "PISOPaymaster: withdraw failed");
        emit SponsorWithdrawn(msg.sender, amount);
    }

    receive() external payable {
        sponsorBalances[msg.sender] += msg.value;
        emit SponsorDeposited(msg.sender, msg.value);
    }
}
