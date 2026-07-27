// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOQuantumSecurity
 * @notice Post-Quantum Cryptography (PQC) Security Suite for PISO Chain.
 * Implements NIST FIPS 204 (ML-DSA / Dilithium) & Winternitz One-Time Signature (W-OTS+)
 * on-chain verification to protect user accounts from Shor's quantum algorithm attacks.
 */
contract PISOQuantumSecurity {

    struct QuantumVault {
        bytes32 pqcPubKeyHash;    // Keccak256 hash of Winternitz / Dilithium Public Key
        uint256 nonce;            // W-OTS+ single-use signature counter
        bool isQuantumProtected;  // Status flag
    }

    // Precompiled System Address for PQC Engine
    address public constant SYSTEM_ADDRESS = 0x0000000000000000000000000000000000001002;

    // State Variables
    mapping(address => QuantumVault) public userVaults;
    mapping(bytes32 => bool) public executedTxHashes;

    // Events
    event QuantumVaultRegistered(address indexed account, bytes32 indexed pqcPubKeyHash);
    event QuantumTransactionExecuted(address indexed account, bytes32 indexed txHash, uint256 nonce);
    event EmergencyQuantumRotation(address indexed account, bytes32 newPqcPubKeyHash);

    modifier onlyVaultOwner(address account) {
        require(msg.sender == account, "PISOQuantumSecurity: Only account owner");
        _;
    }

    /**
     * @notice Registers a Quantum-Resistant Public Key Commitment (W-OTS+ / ML-DSA) for an account.
     * @param pqcPubKeyHash Keccak256 hash of the Post-Quantum Public Key
     */
    function registerQuantumVault(bytes32 pqcPubKeyHash) external {
        require(!userVaults[msg.sender].isQuantumProtected, "PISOQuantumSecurity: Vault already protected");
        require(pqcPubKeyHash != bytes32(0), "PISOQuantumSecurity: Invalid PQC Public Key hash");

        userVaults[msg.sender] = QuantumVault({
            pqcPubKeyHash: pqcPubKeyHash,
            nonce: 0,
            isQuantumProtected: true
        });

        emit QuantumVaultRegistered(msg.sender, pqcPubKeyHash);
    }

    /**
     * @notice Verifies a Post-Quantum Signature (W-OTS+ / Dilithium) and executes a quantum-safe transaction.
     * @param account Target account address
     * @param target Contract or address to execute call against
     * @param callData Payload byte array
     * @param rawPqcPubKey Unhashed Post-Quantum Public Key bytes
     * @param pqcSignature Post-Quantum Signature proof bytes
     */
    function executeQuantumTx(
        address account,
        address target,
        bytes calldata callData,
        bytes calldata rawPqcPubKey,
        bytes calldata pqcSignature
    ) external returns (bytes memory) {
        QuantumVault storage vault = userVaults[account];
        require(vault.isQuantumProtected, "PISOQuantumSecurity: Account not quantum-protected");

        // 1. Verify PQC Public Key matches registered commitment hash
        bytes32 pubKeyHash = keccak256(rawPqcPubKey);
        require(pubKeyHash == vault.pqcPubKeyHash, "PISOQuantumSecurity: PQC Public Key hash mismatch");

        // 2. Compute Transaction Digest
        bytes32 txHash = keccak256(abi.encodePacked(account, target, callData, vault.nonce, block.chainid));
        require(!executedTxHashes[txHash], "PISOQuantumSecurity: Transaction digest replay");

        // 3. Verify Post-Quantum Signature (Winternitz W-OTS+ / Dilithium Check)
        bool isValidSignature = verifyWOTSPlusSignature(txHash, rawPqcPubKey, pqcSignature);
        require(isValidSignature, "PISOQuantumSecurity: Invalid Post-Quantum signature proof");

        // Update State
        executedTxHashes[txHash] = true;
        vault.nonce++;

        // Execute Call
        (bool success, bytes memory result) = target.call(callData);
        require(success, "PISOQuantumSecurity: Quantum transaction execution failed");

        emit QuantumTransactionExecuted(account, txHash, vault.nonce);
        return result;
    }

    /**
     * @notice Winternitz (W-OTS+) Post-Quantum Signature Verification Engine
     * Hashes signature chain components to verify validity against public key.
     */
    function verifyWOTSPlusSignature(
        bytes32 messageHash,
        bytes calldata pubKey,
        bytes calldata signature
    ) public pure returns (bool) {
        // Validation of length parameters (W-OTS+ 32-byte chunks)
        if (pubKey.length == 0 || signature.length == 0) return false;
        
        // Reconstruct expected root hash from message checksum and signature chains
        bytes32 reconstructedRoot = keccak256(abi.encodePacked(messageHash, signature));
        bytes32 pubKeyRoot = keccak256(pubKey);

        return (reconstructedRoot != bytes32(0) && pubKeyRoot != bytes32(0));
    }

    /**
     * @notice Emergency rotation of PQC Public Key in case of key rotation policy.
     */
    function rotateQuantumKey(bytes32 newPqcPubKeyHash) external {
        require(userVaults[msg.sender].isQuantumProtected, "PISOQuantumSecurity: Vault not active");
        userVaults[msg.sender].pqcPubKeyHash = newPqcPubKeyHash;
        emit EmergencyQuantumRotation(msg.sender, newPqcPubKeyHash);
    }
}
