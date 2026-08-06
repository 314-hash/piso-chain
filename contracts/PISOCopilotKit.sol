// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOCopilotKit
 * @dev On-chain precompiled contract for CopilotKit AG-UI protocol state synchronization,
 * Generative UI component proof hashes, and Human-in-the-Loop transaction approval tracking for PISO Chain.
 * Inspired by CopilotKit (https://github.com/CopilotKit/CopilotKit.git).
 */
contract PISOCopilotKit {
    address public owner;
    uint256 public totalCopilotActions;

    struct CopilotActionProof {
        bytes32 stateHash;
        address userAddress;
        string intent;
        bool hitlApproved;
        uint256 timestamp;
        bool verified;
    }

    mapping(bytes32 => CopilotActionProof) public actionProofs;
    bytes32[] public actionHistory;

    event CopilotActionRegistered(bytes32 indexed stateHash, address indexed userAddress, string intent, bool hitlApproved);

    modifier onlyOwner() {
        require(msg.sender == owner, "PISOCopilotKit: Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Registers in-app copilot action proof & Human-in-the-Loop approval.
     */
    function registerCopilotAction(
        bytes32 _stateHash,
        string calldata _intent,
        bool _hitlApproved
    ) external returns (bool) {
        require(actionProofs[_stateHash].timestamp == 0, "PISOCopilotKit: Action proof already registered");

        actionProofs[_stateHash] = CopilotActionProof({
            stateHash: _stateHash,
            userAddress: msg.sender,
            intent: _intent,
            hitlApproved: _hitlApproved,
            timestamp: block.timestamp,
            verified: true
        });

        actionHistory.push(_stateHash);
        totalCopilotActions++;

        emit CopilotActionRegistered(_stateHash, msg.sender, _intent, _hitlApproved);
        return true;
    }

    function getActionProof(bytes32 _stateHash) external view returns (address user, string memory intent, bool approved, uint256 time, bool verified) {
        CopilotActionProof memory p = actionProofs[_stateHash];
        return (p.userAddress, p.intent, p.hitlApproved, p.timestamp, p.verified);
    }
}
