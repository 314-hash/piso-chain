# PISO Chain Architecture Specification

## Overview
PISO Chain is an enterprise Layer 1 EVM-compatible blockchain powered by BSC Parlia Proof-of-Staked-Authority (PoSA) consensus, AI Agent OS Infrastructure, and Quantum-Ready Cryptography.

```
+-----------------------------------------------------------------------+
|                            PISO Chain Core                            |
+-----------------------------------------------------------------------+
|  [Wallet Layer]       [RPC / REST API]       [System Contracts]       |
|  - BIP-39 / BIP-32    - JSON-RPC 2.0         - PISOValidatorSet       |
|  - SLIP-10 / SLIP-39  - Swagger REST API     - PISOQuantumSecurity    |
|  - SLIP-44 Registry   - WebSocket Subscriptions PISOPaymaster         |
+-----------------------------------------------------------------------+
|  [Consensus Layer]                           [PQC Signer Engine]      |
|  - Parlia PoSA Engine                        - Abstract Signer        |
|  - 3s Block Time                             - ML-DSA / SPHINCS+      |
+-----------------------------------------------------------------------+
```

## Modular Layers
1. **Wallet Infrastructure (`wallet/`)**: Hierarchical Deterministic wallet, SLIP-39 Shamir recovery, Keystore V3 encryption.
2. **Execution & State (`contracts/`)**: EVM Smart contracts for Staking, Slashing, Governance, Bridge, and Paymaster.
3. **RPC & REST API (`rpc/`, `api/`)**: JSON-RPC 2.0 and OpenAPI 3.0 interfaces.
4. **Quantum Readiness (`wallet/crypto/`)**: Pluggable `Signer` interface supporting classical ECDSA and NIST PQC algorithms.
