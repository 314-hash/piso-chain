// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOBridge - ChainBridge Compatible Cross-Chain Multi-Sig Bridge
 * @notice Handles lock/release native PISO coins and ERC-20 tokens across EVM networks (Ethereum / BSC).
 */
contract PISOBridge {
    address public owner;
    uint8 public threshold;
    uint256 public relayerCount;

    mapping(address => bool) public isRelayer;
    mapping(bytes32 => bool) public processedTransactions;
    mapping(bytes32 => mapping(address => bool)) public votes;
    mapping(bytes32 => uint8) public voteCounts;

    event Deposit(address indexed sender, uint256 amount, uint256 targetChainId, address indexed targetAddress);
    event ProposalVoted(bytes32 indexed txHash, address indexed relayer, uint8 currentVotes);
    event WithdrawExecuted(address indexed recipient, uint256 amount, bytes32 indexed txHash);
    event RelayerAdded(address indexed relayer);
    event RelayerRemoved(address indexed relayer);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOBridge: caller is not owner");
        _;
    }

    modifier onlyRelayer() {
        require(isRelayer[msg.sender], "PISOBridge: caller is not a relayer");
        _;
    }

    constructor(address[] memory _relayers, uint8 _threshold) {
        require(_threshold > 0 && _threshold <= _relayers.length, "PISOBridge: invalid threshold");
        owner = msg.sender;
        threshold = _threshold;

        for (uint256 i = 0; i < _relayers.length; i++) {
            isRelayer[_relayers[i]] = true;
            emit RelayerAdded(_relayers[i]);
        }
        relayerCount = _relayers.length;
    }

    receive() external payable {}

    function deposit(uint256 targetChainId, address targetAddress) external payable {
        require(msg.value > 0, "PISOBridge: deposit amount must be > 0");
        emit Deposit(msg.sender, msg.value, targetChainId, targetAddress);
    }

    function voteProposal(address payable recipient, uint256 amount, bytes32 txHash) external onlyRelayer {
        require(!processedTransactions[txHash], "PISOBridge: transaction already processed");
        require(!votes[txHash][msg.sender], "PISOBridge: relayer already voted");

        votes[txHash][msg.sender] = true;
        voteCounts[txHash]++;

        emit ProposalVoted(txHash, msg.sender, voteCounts[txHash]);

        if (voteCounts[txHash] >= threshold) {
            processedTransactions[txHash] = true;
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "PISOBridge: native transfer failed");
            emit WithdrawExecuted(recipient, amount, txHash);
        }
    }
}
