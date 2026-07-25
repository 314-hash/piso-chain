// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOAccountRecovery - Smart Contract Social Recovery for PISO Chain
 * @notice Implements guardian-based account ownership rotation (ERC-4337 / Social Recovery Standard).
 */
contract PISOAccountRecovery {
    struct RecoveryRequest {
        address wallet;
        address proposedNewOwner;
        uint256 approvalCount;
        uint256 createdAt;
        bool executed;
    }

    // wallet => guardians
    mapping(address => address[]) public walletGuardians;
    // wallet => guardian => isGuardian
    mapping(address => mapping(address => bool)) public isGuardian;
    // wallet => recovery request
    mapping(address => RecoveryRequest) public activeRequests;
    // wallet => (guardian => voted)
    mapping(address => mapping(address => bool)) public hasVotedRecovery;

    uint256 public constant RECOVERY_WINDOW = 3 days;
    uint256 public constant MIN_GUARDIANS = 2;

    event GuardiansSet(address indexed wallet, address[] guardians);
    event RecoveryInitiated(address indexed wallet, address indexed proposedNewOwner, address indexed initiator);
    event RecoveryVoted(address indexed wallet, address indexed guardian, uint256 currentApprovals);
    event OwnershipRotated(address indexed wallet, address indexed oldOwner, address indexed newOwner);

    /**
     * @notice Wallet owner configures trusted guardian addresses
     */
    function setupGuardians(address[] calldata _guardians) external {
        require(_guardians.length >= MIN_GUARDIANS, "PISOAccountRecovery: minimum 2 guardians required");
        
        // Reset old guardians
        address[] storage existing = walletGuardians[msg.sender];
        for (uint256 i = 0; i < existing.length; i++) {
            isGuardian[msg.sender][existing[i]] = false;
        }
        delete walletGuardians[msg.sender];

        for (uint256 i = 0; i < _guardians.length; i++) {
            require(_guardians[i] != address(0) && _guardians[i] != msg.sender, "PISOAccountRecovery: invalid guardian");
            isGuardian[msg.sender][_guardians[i]] = true;
            walletGuardians[msg.sender].push(_guardians[i]);
        }

        emit GuardiansSet(msg.sender, _guardians);
    }

    /**
     * @notice A guardian initiates or votes on a recovery request to replace a lost key
     */
    function initiateRecovery(address targetWallet, address newOwner) external {
        require(isGuardian[targetWallet][msg.sender], "PISOAccountRecovery: caller is not a guardian");
        require(newOwner != address(0), "PISOAccountRecovery: invalid new owner");

        RecoveryRequest storage req = activeRequests[targetWallet];

        // Reset if expired or new proposed owner
        if (block.timestamp > req.createdAt + RECOVERY_WINDOW || req.proposedNewOwner != newOwner || req.executed) {
            req.wallet = targetWallet;
            req.proposedNewOwner = newOwner;
            req.approvalCount = 0;
            req.createdAt = block.timestamp;
            req.executed = false;
            
            // Clear past votes
            address[] memory guardians = walletGuardians[targetWallet];
            for (uint256 i = 0; i < guardians.length; i++) {
                hasVotedRecovery[targetWallet][guardians[i]] = false;
            }
            emit RecoveryInitiated(targetWallet, newOwner, msg.sender);
        }

        require(!hasVotedRecovery[targetWallet][msg.sender], "PISOAccountRecovery: guardian already voted");

        hasVotedRecovery[targetWallet][msg.sender] = true;
        req.approvalCount++;

        emit RecoveryVoted(targetWallet, msg.sender, req.approvalCount);

        // Required threshold: majority of guardians (e.g. 2 out of 3)
        uint256 threshold = (walletGuardians[targetWallet].length / 2) + 1;
        if (req.approvalCount >= threshold && !req.executed) {
            req.executed = true;
            emit OwnershipRotated(targetWallet, targetWallet, newOwner);
        }
    }

    function getGuardians(address wallet) external view returns (address[] memory) {
        return walletGuardians[wallet];
    }
}
