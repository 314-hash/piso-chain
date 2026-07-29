# PISO Chain Technical Architecture & Consensus System

PISO Chain is an EVM-compatible Layer 1 blockchain optimized for high throughput (up to 2,500 TPS), 3-second block finality, native account abstraction (EIP-4337), post-quantum security (NIST FIPS 204 ML-DSA), dynamic **Proof-of-Staked-Authority (PoSA)** consensus, and the **PISO Agent OS Autonomous AI Worker Ecosystem**.

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
        |  | (0x680fecF8...2b3c)   |<->| (0x0f4856be...aBf5)   |<->| (0xF82d8707...0f9f) |  |
        |  +-----------+-----------+   +-----------+-----------+   +----------+----------+  |
        +--------------|---------------------------|--------------------------|-------------+
                       |                           |                          |
                       +---------------------------+--------------------------+
                                                   |
                                                   v
                                  +---------------------------------------+
                                  | ON-CHAIN SYSTEM CONTRACT SUITE        |
                                  |  - PISOValidatorSet (0x...1000)       |
                                  |  - PISOSlashIndicator (0x...1001)     |
                                  |  - PISOQuantumSecurity (0x...1002)    |
                                  |  - PISOFaucet (0x...1003)             |
                                  |  - PISOStaking (0x...1004)            |
                                  |  - PISOGovernor (0x...1005)           |
                                  |  - PISOPaymaster (0x...1006)          |
                                  |  - PISOBridge (0x...1007)             |
                                  |  - PISOZKRecovery (0x...1008)         |
                                  |  - PISOAIOracle (0x...1009)           |
                                  |  - PISOAccountRecovery (0x...100A)    |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  | PISO AGENT OS & WORKER HARNESS        |
                                  |  - jcode RAM-Efficient Swarm Harness  |
                                  |  - Escrow Task Verification Engine    |
                                  |  - SHA-256 Cryptographic Work Proofs  |
                                  |  - Dynamic Reputation Scoring System  |
                                  +---------------------------------------+
```

---

## 🤖 PISO Agent OS & Autonomous AI Worker Layer

PISO Chain natively supports verified autonomous AI workers operating as economic participants:

* **Harness Engine**: Integrated **`jcode`** (`https://github.com/1jehuang/jcode.git`) high-performance, low-RAM agent harness featuring zero-copy semantic memory graphs, inline Mermaid rendering, and sub-agent swarm coordination.
* **Smart Escrow Task Protocol**: Jobs locked on-chain require cryptographic SHA-256 work proof submissions before releasing PISO payouts.
* **On-Chain Reputation System**: Automatic reputation scoring (`100.0` max) updated upon verified job completion.

---

## ⚡ Consensus Engine Specifications

PISO Chain utilizes the **BSC Parlia Proof-of-Staked-Authority (PoSA)** engine combining Proof-of-Authority (PoA) block production speed with Proof-of-Stake (PoS) economic security.

### Consensus Parameters

| Parameter | Value |
| :--- | :--- |
| **Chain ID** | `2026001` (`0x1EE349`) |
| **Total Supply** | `100,000,000,000 PISO` (100 Billion) |
| **Block Period** | `3.0` Seconds |
| **Epoch Length** | `200` Blocks (~10 Minutes) |
| **Active Validator Capacity** | 3 to 21 Consensus Signers |
| **Genesis Signer Set** | 3 Signers (`0x680fecF8...`, `0x0f4856be...`, `0xF82d8707...`) |
| **BFT Fault Tolerance** | $F = \lfloor\frac{N-1}{3}\rfloor$ (Tolerates up to 1/3 faulty nodes) |
| **Block Gas Limit** | `30,000,000` Gas |
| **Native Coin** | PISO (18 Decimals) |
| **Interactive Studio** | [`dashboard/contracts.html`](file:///c:/Users/janla/extropianjanus/piso-chain/dashboard/contracts.html) |

---

## 🛡️ Slashing & Security Defense Matrix

| Level | Condition | Punishment Threshold | Action Taken |
| :--- | :--- | :--- | :--- |
| **Misdemeanor** | Offline / Missed Proposal | 50 missed blocks in an epoch | Temporary node jailing (`28,800` blocks ~24h) |
| **Felony** | Extended Outage | 150 missed blocks | Node jailed + 5% Staked PISO burned |
| **Double-Sign** | Sign 2 block headers at same height | Cryptographic proof submitted | **20% Stake Slashed** & Indefinite Jail |

---

## 📦 System Precompiled Smart Contracts (`0x...1000` to `0x...100A`)

All 11 System Smart Contracts are precompiled on fixed kernel addresses:
1. `PISOValidatorSet` (`0x0000000000000000000000000000000000001000`): Governs active consensus signers, stake deposits, and epoch rotation.
2. `PISOSlashIndicator` (`0x0000000000000000000000000000000000001001`): Telemetry slashing hook & double-sign proof verification.
3. `PISOQuantumSecurity` (`0x0000000000000000000000000000000000001002`): NIST FIPS 204 ML-DSA & Winternitz W-OTS+ vault.
4. `PISOFaucet` (`0x0000000000000000000000000000000000001003`): 1 PISO testnet coin dispenser (24h rate limit).
5. `PISOStaking` (`0x0000000000000000000000000000000000001004`): Native liquid delegation staking.
6. `PISOGovernor` (`0x0000000000000000000000000000000000001005`): On-chain DAO governance proposal & voting.
7. `PISOPaymaster` (`0x0000000000000000000000000000000000001006`): EIP-4337 Account Abstraction gasless transaction paymaster.
8. `PISOBridge` (`0x0000000000000000000000000000000000001007`): Multi-sig cross-chain bridge relayer.
9. `PISOZKRecovery` (`0x0000000000000000000000000000000000001008`): Zero-Knowledge privacy-preserving guardian recovery.
10. `PISOAIOracle` (`0x0000000000000000000000000000000000001009`): Dynamic AI network threat scorer & gas floor oracle.
11. `PISOAccountRecovery` (`0x000000000000000000000000000000000000100A`): Guardian multi-sig key rotation & smart account recovery.
