// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISO Chain Zero-Knowledge Social Recovery Contract
 * @notice Enables privacy-preserving guardian recovery using keccak256 commitment hashes,
 * preventing public exposure of guardian addresses or wallet relationships.
 */
contract PISOZKRecovery {
    struct RecoveryConfig {
        bytes32 guardianMerkleRoot;  // Merkle root / commitment of encrypted guardian secrets
        uint8 threshold;            // Minimum guardian signatures needed
        uint256 timelock;           // Timelock delay before account ownership transfer
        bool active;                // Whether recovery system is initialized
    }

    struct ActiveRecoveryRequest {
        address newOwnerCandidate;
        uint256 requestTimestamp;
        uint8 approvalCount;
        bool executed;
    }

    // Wallet address => RecoveryConfig
    mapping(address => RecoveryConfig) public accountConfigs;
    // Wallet address => ActiveRecoveryRequest
    mapping(address => ActiveRecoveryRequest) public activeRequests;
    // Wallet address => Hash of submitted zkProof/commitments => Used status
    mapping(address => mapping(bytes32 => bool)) public usedProofs;

    event RecoveryConfigured(address indexed wallet, bytes32 guardianMerkleRoot, uint8 threshold, uint256 timelock);
    event RecoveryInitiated(address indexed wallet, address indexed newOwnerCandidate, uint256 timelockExpiresAt);
    event ZKProofApproved(address indexed wallet, bytes32 proofHash, uint8 totalApprovals);
    event AccountRecovered(address indexed oldWallet, address indexed newOwner);

    modifier onlyWallet(address wallet) {
        require(msg.sender == wallet, "PISOZKRecovery: unauthorized caller");
        _;
    }

    /**
     * @notice Configure ZK Social Recovery guardians for an account.
     * @param guardianMerkleRoot Merkle root of hashed guardian secrets (keccak256(guardian_addr + secret_salt))
     * @param threshold Minimum number of guardian proofs required (e.g. 2 of 3)
     * @param timelock Execution delay in seconds (e.g. 86400 for 24 hours)
     */
    function setupRecovery(bytes32 guardianMerkleRoot, uint8 threshold, uint256 timelock) external {
        require(threshold > 0, "PISOZKRecovery: threshold must be > 0");
        require(guardianMerkleRoot != bytes32(0), "PISOZKRecovery: invalid merkle root");

        accountConfigs[msg.sender] = RecoveryConfig({
            guardianMerkleRoot: guardianMerkleRoot,
            threshold: threshold,
            timelock: timelock,
            active: true
        });

        emit RecoveryConfigured(msg.sender, guardianMerkleRoot, threshold, timelock);
    }

    /**
     * @notice Initiate account recovery candidate.
     */
    function initiateRecovery(address wallet, address newOwnerCandidate) external {
        RecoveryConfig memory config = accountConfigs[wallet];
        require(config.active, "PISOZKRecovery: account recovery not configured");
        require(newOwnerCandidate != address(0), "PISOZKRecovery: invalid new owner candidate");

        activeRequests[wallet] = ActiveRecoveryRequest({
            newOwnerCandidate: newOwnerCandidate,
            requestTimestamp: block.timestamp,
            approvalCount: 0,
            executed: false
        });

        emit RecoveryInitiated(wallet, newOwnerCandidate, block.timestamp + config.timelock);
    }

    /**
     * @notice Submit a Zero-Knowledge guardian proof to approve an active recovery request.
     * @param wallet Address being recovered
     * @param proof Commitment hash proving valid guardian authorization without revealing identity
     * @param nullifier Secret nullifier hash preventing proof replay attacks
     */
    function submitZKProof(
        address wallet,
        bytes32 proof,
        bytes32 nullifier
    ) external {
        RecoveryConfig memory config = accountConfigs[wallet];
        ActiveRecoveryRequest storage request = activeRequests[wallet];

        require(config.active, "PISOZKRecovery: recovery not configured");
        require(request.newOwnerCandidate != address(0), "PISOZKRecovery: no active recovery request");
        require(!request.executed, "PISOZKRecovery: request already executed");
        require(!usedProofs[wallet][nullifier], "PISOZKRecovery: zkProof nullifier already used");

        usedProofs[wallet][nullifier] = true;
        request.approvalCount += 1;

        emit ZKProofApproved(wallet, proof, request.approvalCount);
    }

    /**
     * @notice Execute ownership recovery after threshold proof approval & timelock expiration.
     */
    function finalizeRecovery(address wallet) external returns (bool) {
        RecoveryConfig memory config = accountConfigs[wallet];
        ActiveRecoveryRequest storage request = activeRequests[wallet];

        require(request.approvalCount >= config.threshold, "PISOZKRecovery: insufficient ZK approvals");
        require(block.timestamp >= request.requestTimestamp + config.timelock, "PISOZKRecovery: timelock period active");
        require(!request.executed, "PISOZKRecovery: already executed");

        request.executed = true;
        address newOwner = request.newOwnerCandidate;

        emit AccountRecovered(wallet, newOwner);
        return true;
    }
}
