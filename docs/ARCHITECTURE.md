# PISO Chain Technical Architecture & Consensus System

PISO Chain is an EVM-compatible Layer 1 blockchain optimized for high throughput (up to 2,500 TPS), 3-second block finality, native account abstraction (EIP-4337), and dynamic **Proof-of-Staked-Authority (PoSA)** consensus.

---

## 🏛️ System Architecture Overview

```
                                  +---------------------------------------+
                                  |    Web3 Applications / RPC Clients    |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +-------------------+-------------------+
                                  |    Caddy RPC Reverse Proxy / Gateway  |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +-------------------+-------------------+
                                  |   Sentry Node Layer (Public Peer P2P) |
                                  +-------------------+-------------------+
                                                      | (Private VPC Interconnect)
                                                      v
        +-----------------------------------------------------------------------------------+
        |                         PRIVATE CONSENSUS SIGNER CLUSTER                          |
        |                                                                                   |
        |  +-----------------------+   +-----------------------+   +---------------------+  |
        |  |  Validator Node #1    |   |  Validator Node #2    |   |  Validator Node #3  |  |
        |  |  (Consensus Signer)   |<->|  (Consensus Signer)   |<->|  (Consensus Signer) |  |
        |  +-----------+-----------+   +-----------+-----------+   +----------+----------+  |
        +--------------|---------------------------|--------------------------|-------------+
                       |                           |                          |
                       +---------------------------+--------------------------+
                                                   |
                                                   v
                                  +---------------------------------------+
                                  | ON-CHAIN SYSTEM CONTRACT SUITE        |
                                  |  - PISOValidatorSet.sol (0x...1000)   |
                                  |  - PISOSlashIndicator.sol (0x...1001) |
                                  |  - PISOStaking.sol                    |
                                  +---------------------------------------+
```

---

## ⚡ Consensus Engine Specifications

PISO Chain utilizes the **BSC Parlia Proof-of-Staked-Authority (PoSA)** engine combining Proof-of-Authority (PoA) block production speed with Proof-of-Stake (PoS) economic security.

### Consensus Parameters

| Parameter | Value |
| :--- | :--- |
| **Chain ID** | `2026001` |
| **Block Period** | `3` Seconds |
| **Epoch Length** | `200` Blocks (~10 Minutes) |
| **Active Validator Capacity** | 3 to 21 Consensus Signers |
| **BFT Fault Tolerance** | $F = \lfloor\frac{N-1}{3}\rfloor$ (Tolerates up to 1/3 faulty nodes) |
| **Block Gas Limit** | `30,000,000` Gas |
| **Native Coin** | PISO (18 Decimals) |

---

## 🛡️ Slashing & Security Defense Matrix

| Level | Condition | Punishment Threshold | Action Taken |
| :--- | :--- | :--- | :--- |
| **Misdemeanor** | Offline / Missed Proposal | 50 missed blocks in an epoch | Temporary node jailing (`28,800` blocks ~24h) |
| **Felony** | Extended Outage | 150 missed blocks | Node jailed + 5% Staked PISO burned |
| **Double-Sign** | Sign 2 block headers at same height | Cryptographic proof submitted | **20% Stake Slashed** & Indefinite Jail |

---

## 📦 System Precompiled Smart Contracts

- **`PISOValidatorSet.sol` (`0x0000000000000000000000000000000000001000`)**: Governs active consensus signers, stake deposits, epoch rotation, and node state transitions.
- **`PISOSlashIndicator.sol` (`0x0000000000000000000000000000000000001001`)**: Receives block proposal miss telemetry from the Geth engine and processes cryptographic double-signing proofs.
