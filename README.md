<p align="center">
  <img src="assets/piso_logo.jpg" alt="PISO Chain Native Coin Logo" width="220" />
</p>

# PISO Chain (Layer 1 Blockchain - Enterprise Multi-Validator Network & PISO Agent OS)

[![CI/CD Pipeline](https://github.com/314-hash/piso-chain/actions/workflows/ci.yml/badge.svg)](https://github.com/314-hash/piso-chain/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![EVM Compatibility](https://img.shields.io/badge/EVM-Compatible-emerald.svg)](https://ethereum.org)
[![Consensus: PoSA](https://img.shields.io/badge/Consensus-BSC_Parlia_PoSA-orange.svg)](https://github.com/bnb-chain/bsc)
[![PISO Agent OS](https://img.shields.io/badge/Agent_OS-jcode_Harness-purple.svg)](https://github.com/1jehuang/jcode.git)

**PISO Chain** is a high-performance, EVM-compatible Layer 1 blockchain network built on **BSC Parlia Proof-of-Staked-Authority (PoSA)** consensus and the **PISO Agent OS Autonomous AI Worker Infrastructure**. It features 3-second block finality, near-zero transaction fees, native account abstraction (EIP-4337), post-quantum security (NIST FIPS 204 ML-DSA), Zero-Knowledge social recovery, automated cross-chain bridge relayers, and on-chain AI worker escrow task verification.

---

## 🌐 Network Specification & Endpoints

| Parameter | Specification |
| :--- | :--- |
| **Chain Name** | PISO Chain |
| **Chain ID** | `2026001` (`0x1EE349`) |
| **Native Coin** | PISO (18 Decimals) |
| **Block Time** | `3.0` Seconds |
| **Consensus Engine** | BSC Parlia PoSA / BFT Multi-Signer Engine |
| **Agent Harness** | `jcode` Swarm Harness ([`jcode/`](file:///c:/Users/janla/extropianjanus/piso-chain/jcode)) |
| **Web Dashboard** | [`http://localhost:8080`](http://localhost:8080) / [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/) |
| **HTTP RPC URL** | `https://piso-rpc-dev.loca.lt` / `http://localhost:8545` |
| **WebSocket RPC** | `wss://piso-ws-dev.loca.lt` / `ws://localhost:8546` |
| **Block Explorer** | [`http://localhost:8080`](http://localhost:8080) |

---

## 🤖 PISO Agent OS & AI Worker Ecosystem

PISO Chain includes native support for autonomous AI workers operating as cryptographically verified economic participants:

* **Harness Engine**: Integrated **`jcode`** (`https://github.com/1jehuang/jcode.git`) high-performance, low-RAM agent harness featuring zero-copy semantic memory graphs, inline Mermaid rendering, and sub-agent swarm coordination.
* **Escrow Engine**: Task bounties locked on-chain in smart contract escrows.
* **Cryptographic Proofs**: Submits SHA-256 work proofs for automated test and code verification before releasing PISO token rewards.
* **Reputation System**: Dynamic reputation score (`100.0` max) automatically updated on-chain.

```bash
# Execute Autonomous AI Worker Task Escrow Engine
.venv\Scripts\python.exe scripts/agent_task_escrow_runner.py
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

### 4. Build TypeScript Developer SDK (@piso-chain/sdk)

```bash
npm --prefix sdk run build
```

---

## 📜 System Smart Contracts Suite

- [`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol) (`0x...1000`): Dynamic PoSA validator registration, staking (100k PISO min), and epoch rotation.
- [`PISOSlashIndicator.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOSlashIndicator.sol) (`0x...1001`): Slashing engine for block proposal misses & double-sign proof verification.
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

1. 🏛️ [`docs/ARCHITECTURE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/ARCHITECTURE.md): Technical Architecture, Consensus System & Agent OS Protocol.
2. 🛡️ [`docs/VALIDATOR_NODE_GUIDE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/VALIDATOR_NODE_GUIDE.md): Node Operator Guide, Hardware Requirements & Staking.
3. 📜 [`docs/SMART_CONTRACTS.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/SMART_CONTRACTS.md): Full Smart Contracts Reference.
4. 🐋 [`docs/DEPLOYMENT_AND_DEVOPS.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/DEPLOYMENT_AND_DEVOPS.md): Docker, Kubernetes StatefulSets, & Monitoring.
5. ⚡ [`docs/DEVELOPER_API_AND_SDK.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/DEVELOPER_API_AND_SDK.md): Viem, Web3.py, & Ethers.js integration code.
6. 🚰 [`docs/FAUCET_AND_RELAYER.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/FAUCET_AND_RELAYER.md): 1 PISO Faucet & Bridge Relayer daemon.
7. 🔍 [`docs/BLOCKCHAIN_EXPLORER_GUIDE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/BLOCKCHAIN_EXPLORER_GUIDE.md): Block Explorer hosting & dashboard guide.
8. ⚛️ [`docs/QUANTUM_RESISTANCE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/QUANTUM_RESISTANCE.md): NIST FIPS 204 ML-DSA Post-Quantum Guide.
9. 🚀 [`docs/MAINNET_LAUNCH_CHECKLIST.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/MAINNET_LAUNCH_CHECKLIST.md): Mainnet Launch Readiness & Production Checklist.
10. ☸️ [`docs/KUBERNETES_AND_DOCKER_CLUSTER_GUIDE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/KUBERNETES_AND_DOCKER_CLUSTER_GUIDE.md): Multi-Validator Setup Guide.
11. 📊 [`PITCH.md`](file:///c:/Users/janla/extropianjanus/piso-chain/PITCH.md): Investor Pitch Deck & Ecosystem Overview.
12. 💎 [`TOKENOMICS.md`](file:///c:/Users/janla/extropianjanus/piso-chain/TOKENOMICS.md): Token Allocation, Staking Yield APR & Vesting.

---

## 📁 Repository Structure

```
piso-chain/
├── .github/workflows/ci.yml           # GitHub Actions Automated CI/CD Pipeline
├── jcode/                            # High-Performance RAM-Efficient AI Agent Harness
├── genesis/                          # Multi-validator genesis & node credentials
├── contracts/                        # Complete Suite of System Smart Contracts
├── docker/                           # Containerized node data & keystores
├── docker-compose.multi-validator.yml# 3-Validator PoSA Docker Stack
├── k8s/                              # Kubernetes StatefulSet & Production Manifests
├── bridge/                           # Cross-chain relayer daemon script & config
├── dashboard/                        # Mobile-Responsive Web Dashboard & Explorer (HTML/CSS/JS)
├── scripts/
│   ├── agent_task_escrow_runner.py   # Autonomous AI Worker Escrow Engine
│   ├── setup_multi_validator_cluster.py # Dynamic N-Validator Genesis & Key Generator
│   ├── start_multi_validator.py      # Automated Cluster Orchestrator
│   ├── deploy_system_contracts.py    # Contract Deployer & Verifier Tool
│   └── test_rpc.py                   # RPC Connectivity Tester
├── test/
│   └── PISOChainSystem.test.js       # Hardhat System Contract Unit Tests (100% Pass)
├── sdk/                              # Official TypeScript Developer SDK (@piso-chain/sdk)
├── docs/                             # Complete Technical Documentation Suite
└── README.md                         # Master Network Landing Page
```
