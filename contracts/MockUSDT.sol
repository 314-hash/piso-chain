// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockUSDT
 * @notice Test ERC-20 USDT token for PISO Chain local development and testnet
 * @dev Mintable by owner — used to seed PISO/USDT liquidity pools
 */
contract MockUSDT {
    string public constant name = "Mock USDT";
    string public constant symbol = "USDT";
    uint8 public constant decimals = 6; // USDT uses 6 decimals

    address public owner;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "MockUSDT: NOT_OWNER");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Mint 10,000,000 USDT to deployer for seeding liquidity
        _mint(msg.sender, 10_000_000 * 10 ** uint256(decimals));
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function faucet(uint256 amount) external {
        require(amount <= 10_000 * 10 ** uint256(decimals), "MockUSDT: MAX_FAUCET_10K");
        _mint(msg.sender, amount);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        if (allowance[from][msg.sender] != type(uint256).max) {
            allowance[from][msg.sender] -= value;
        }
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}
