# PISO Chain Post-Quantum Cryptography (PQC) Security Architecture

This document details the Post-Quantum Cryptography (PQC) security framework implemented for **PISO Chain** to protect accounts and consensus against quantum computer attacks (e.g. Shor's algorithm breaking ECDSA secp256k1 key pairs).

---

## ⚛️ Quantum Threat Model & NIST Standards

Standard Ethereum / EVM public keys rely on Elliptic Curve Cryptography (`secp256k1`). A quantum computer with ~4,000 stable physical qubits executing **Shor's Algorithm** could derive private keys from public keys in polynomial time $O((\log N)^3)$.

PISO Chain mitigates this threat by integrating **NIST FIPS 204 (ML-DSA / CRYSTALS-Dilithium)** and **Winternitz One-Time Signatures (W-OTS+)** into its smart contract system layer.

```
                    +---------------------------------------------+
                    | PISO Chain User Account (EVM Wallet)        |
                    +----------------------+----------------------+
                                           |
                                           v
                    +----------------------+----------------------+
                    | PISOQuantumSecurity.sol (0x...1002)         |
                    |  - PubKey Commitment Hash Verification       |
                    |  - W-OTS+ / ML-DSA Signature Validation     |
                    +----------------------+----------------------+
                                           |
                                           v
                    +----------------------+----------------------+
                    | Quantum-Safe State Execution Engine          |
                    |  - Single-Use Nonce Tracking                |
                    |  - NIST Category 5 (256-bit Quantum Proof)  |
                    +---------------------------------------------+
```

---

## 📜 Post-Quantum Smart Contract (`PISOQuantumSecurity.sol`)

- **Precompiled Address:** `0x0000000000000000000000000000000000001002`
- **Source:** [`contracts/PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol)

### Key Functions

1. **`registerQuantumVault(bytes32 pqcPubKeyHash)`**: Binds a 256-bit Post-Quantum Public Key Commitment Hash to an EVM account.
2. **`executeQuantumTx(address account, address target, bytes callData, bytes rawPqcPubKey, bytes pqcSignature)`**: Verifies Post-Quantum signature chains against the registered commitment before executing payload state changes.
3. **`verifyWOTSPlusSignature(bytes32 messageHash, bytes pubKey, bytes signature)`**: Evaluates Winternitz hash chains on-chain.

---

## 🛠️ Generating Post-Quantum Keys

Run the Python PQC Key Generator to compute Winternitz & ML-DSA pubkey commitments:

```bash
.venv\Scripts\python.exe scripts/generate_pqc_keys.py
```

Outputs:
- **PQC Algorithm Standard:** W-OTS+ / NIST FIPS 204 ML-DSA
- **PQC PubKey Commitment:** `0x296b50ecec4b94662219e85a188f09e43e7ed826a2307fe2787b2ac3bfd8d437`
- **Security Level:** NIST Category 5 (256-Bit Quantum Security)
