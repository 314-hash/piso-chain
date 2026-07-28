# PISO Chain (Layer 1 Blockchain - Enterprise Multi-Validator Network)

[![CI/CD Pipeline](https://github.com/314-hash/piso-chain/actions/workflows/ci.yml/badge.svg)](https://github.com/314-hash/piso-chain/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![EVM Compatibility](https://img.shields.io/badge/EVM-Compatible-emerald.svg)](https://ethereum.org)
[![Consensus: PoSA](https://img.shields.io/badge/Consensus-BSC_Parlia_PoSA-orange.svg)](https://github.com/bnb-chain/bsc)

**PISO Chain** is a high-performance, EVM-compatible Layer 1 blockchain network built on **BSC Parlia Proof-of-Staked-Authority (PoSA)** consensus. It provides 3-second block finality, near-zero transaction fees, native account abstraction (EIP-4337), privacy-preserving Zero-Knowledge social recovery, an automated cross-chain relayer bridge, and an on-chain 1 PISO testnet faucet.

---

## 🌐 Network Specification & Endpoints

| Parameter | Specification |
| :--- | :--- |
| **Chain Name** | PISO Chain |
| **Chain ID** | `2026001` (`0x1EE349`) |
| **Native Coin** | PISO (18 Decimals) |
| **Block Time** | `3.0` Seconds |
| **Consensus Engine** | BSC Parlia PoSA / BFT Multi-Signer Engine |
| **Active Signer Capacity** | 3 to 21 Consensus Signers |
| **Web Dashboard** | [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/) |
| **HTTP RPC URL** | `https://piso-rpc-dev.loca.lt` / `http://localhost:8545` |
| **WebSocket RPC** | `wss://piso-ws-dev.loca.lt` / `ws://localhost:8546` |
| **Block Explorer** | `https://piso-blockchain.vercel.app/` / `http://localhost:8080` |

---

## 🏛️ Multi-Validator Architecture

PISO Chain relies on a production Sentry Node topology to shield consensus signers from DDoS attacks:

```
                      +-----------------------------+
                      |   Caddy Gateway / LB (RPC)  |
                      +--------------+--------------+
                                     |
                                     v
                       +-------------+-------------+
                       |   Public RPC / Sentry Node|
                       +-------------+-------------+
                                     |
           +-------------------------+-------------------------+
           |                         |                         |
           v                         v                         v
  +------------------+      +------------------+      +------------------+
  |  Validator Node 1|      |  Validator Node 2|      |  Validator Node 3|
  |   (Signer #1)    |<---->|   (Signer #2)    |<---->|   (Signer #3)    |
  +------------------+      +------------------+      +------------------+
```

---

## 🚀 Quick Start (Local Multi-Validator Cluster)

### 1. Provision Keystores & Multi-Signer Genesis

```bash
.venv\Scripts\python.exe scripts/setup_multi_validator_cluster.py
```

### 2. Spin Up 3-Validator Docker Stack

```bash
.venv\Scripts\python.exe scripts/start_multi_validator.py
```

Or manually using Docker Compose:

```bash
docker-compose -f docker-compose.multi-validator.yml up -d
```

### 3. Run Automated Smart Contract Unit Test Suite (100% Pass)

```bash
npm run test
```

---

## 📜 System Smart Contracts Suite

- [`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol) (`0x...1000`): Dynamic PoSA validator registration, staking (100k PISO min), and epoch rotation.
- [`PISOSlashIndicator.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOSlashIndicator.sol) (`0x...1001`): Slashing engine for block proposal misses (50=temporary jail, 150=felony) & double-sign proof verification (20% burn).
- [`PISOFaucet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOFaucet.sol): On-chain rate-limited faucet dispensing 1 PISO testnet coin every 24 hours.
- [`PISOBridge.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOBridge.sol): Cross-chain asset wrapper & bridge smart contract.
- [`PISOStaking.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOStaking.sol): Native liquid staking delegation protocol.
- [`PISOGovernor.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOGovernor.sol): On-chain DAO governance proposal & voting system.
- [`PISOPaymaster.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOPaymaster.sol): Native EIP-4337 Account Abstraction gasless paymaster.
- [`PISOZKRecovery.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOZKRecovery.sol): Zero-Knowledge privacy-preserving social guardian recovery.
- [`PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol) (`0x...1002`): NIST FIPS 204 (ML-DSA / Dilithium) & Winternitz (W-OTS+) Post-Quantum Cryptography vault.
- [`PISOAIOracle.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOAIOracle.sol): Dynamic AI network threat scoring & gas oracle.

---

## 📚 Technical Documentation Index

Detailed guides are located in the [`docs/`](file:///c:/Users/janla/extropianjanus/piso-chain/docs) folder:

1. 🏛️ [`docs/ARCHITECTURE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/ARCHITECTURE.md): Technical Architecture, Consensus System & Slashing Matrix.
2. 🛡️ [`docs/VALIDATOR_NODE_GUIDE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/VALIDATOR_NODE_GUIDE.md): Node Operator Guide, Hardware Requirements & Staking.
3. 📜 [`docs/SMART_CONTRACTS.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/SMART_CONTRACTS.md): Full Smart Contracts Reference.
4. 🐋 [`docs/DEPLOYMENT_AND_DEVOPS.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/DEPLOYMENT_AND_DEVOPS.md): Docker, Kubernetes StatefulSets, & Monitoring.
5. ⚡ [`docs/DEVELOPER_API_AND_SDK.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/DEVELOPER_API_AND_SDK.md): Viem, Web3.py, & Ethers.js integration code.
6. 🚰 [`docs/FAUCET_AND_RELAYER.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/FAUCET_AND_RELAYER.md): 1 PISO Faucet & Bridge Relayer daemon.
7. 🔍 [`docs/BLOCKCHAIN_EXPLORER_GUIDE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/BLOCKCHAIN_EXPLORER_GUIDE.md): Blockscout Block Explorer hosting & Sourcify verification.
8. ⚛️ [`docs/QUANTUM_RESISTANCE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/QUANTUM_RESISTANCE.md): NIST FIPS 204 ML-DSA & W-OTS+ Post-Quantum Cryptography Guide.
9. 🚀 [`docs/MAINNET_LAUNCH_CHECKLIST.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/MAINNET_LAUNCH_CHECKLIST.md): Mainnet Launch Readiness & Production Checklist.
10. 🌐 [`docs/public_endpoints.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/public_endpoints.md): Network parameters and MetaMask connection guide.

---

## 📁 Repository Structure

```
piso-chain/
├── .github/workflows/ci.yml           # GitHub Actions Automated CI/CD Pipeline
├── genesis/                          # Multi-validator genesis & node credentials
├── contracts/                        # Complete Suite of System Smart Contracts
├── docker/                           # Containerized node data & keystores
├── docker-compose.multi-validator.yml# 3-Validator PoSA Docker Stack
├── k8s/                              # Kubernetes StatefulSet & Production Manifests
├── bridge/                           # Cross-chain relayer daemon script
├── dashboard/                        # Mobile-Responsive Web Dashboard (HTML/CSS/JS)
├── scripts/
│   ├── setup_multi_validator_cluster.py # Dynamic N-Validator Genesis & Key Generator
│   ├── start_multi_validator.py      # Automated Cluster Orchestrator
│   ├── deploy_system_contracts.py    # Contract Deployer & Verifier Tool
│   └── test_rpc.py                   # RPC Connectivity Tester
├── test/
│   └── PISOChainSystem.test.js       # Hardhat System Contract Unit Tests (100% Pass)
├── docs/                             # Complete Technical Documentation Suite
└── README.md                         # Master Network Landing Page
```
