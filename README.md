<p align="center">
  <img src="assets/piso_logo.jpg" alt="PISO Chain Native Coin Logo" width="220" />
</p>

# PISO Chain (Layer 1 Blockchain - Enterprise Multi-Validator Network & PISO Agent OS)

[![CI/CD Pipeline](https://github.com/314-hash/piso-chain/actions/workflows/ci.yml/badge.svg)](https://github.com/314-hash/piso-chain/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![EVM Compatibility](https://img.shields.io/badge/EVM-Compatible-emerald.svg)](https://ethereum.org)
[![Censorship Resistance](https://img.shields.io/badge/Censorship_Resistance-Unstoppable_P2P-brightgreen.svg)](docs/CENSORSHIP_RESISTANCE_%26_REGULATORY_COMPLIANCE.md)
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
* **Enterprise 7-Repo Suite**:
  * **Legendary_OSINT** (`K2SOsint/Legendary_OSINT`): Cryptographic forensic tracing, AML risk scoring, IP/domain recon, and dark web leak hash matching (`core/legendary_osint.py`, `contracts/PISOLegendaryOSINT.sol`).
  * **PraisonAI** (`MervinPraison/PraisonAI`): Low-code multi-agent orchestration, self-reflection audit loops, code execution sandbox, and multi-LLM adapter (`core/praison_agent_engine.py`).
  * **JobSync** (`Gsync/jobsync`): Asynchronous background AI agent worker scheduler, task lifecycle manager, and node capacity router (`core/jobsync_engine.py`).
  * **OWASP AISVS** (`OWASP/AISVS`): OWASP AI Security Verification Standard (14-Chapter L1-L3 Controls), prompt injection shield, and execution budget enforcement (`core/aisvs_security_verifier.py`, `contracts/PISOAISVSSecurity.sol`).
  * **IRONSIGHT** (`NoblerWorks-HQ/IRONSIGHT`): Real-time threat intelligence and validator node situational awareness command center telemetry (`core/ironsight_command_center.py`).
  * **L0p4Map** (`HaxL0p4/L0p4Map`): Validator network P2P port scanner, interactive topology matrix, and Vulners CVE vulnerability correlation (`core/l0p4map_scanner.py`).
  * **MinerU** (`opendatalab/MinerU`): High-precision PDF document parsing, layout analysis, LaTeX formula extraction, and structured RAG Markdown generation (`core/mineru_parser.py`).
  * **RefRef** (`amicalhq/refref`): On-chain referral attribution, unique referral code generator (`PISO-REF-xxx`), and automated $PISO reward payouts (`core/refref_referral_engine.py`, `contracts/PISORefRefReferral.sol`).
  * **Nethermind** (`NethermindEth/nethermind`): Enterprise C# / .NET 8 EVM execution client, custom chainspec (`config/nethermind_piso_chainspec.json`), C# Treasury Mining plugin (`consensus/Nethermind.PisoChain/PisoTreasuryMiningPlugin.cs`), Snap/Warp sync, and high-performance gas tracing (`core/nethermind_engine.py`).
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
- [`PISOQuantumSecurity.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOQuantumSecurity.sol) (`0x...1002`): NIST FIPS 204 (ML-DSA / Dilithium) & Winternitz (W-OTS+) Post-Quantum Cryptography vault.
- [`PISOProofOfWork.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOProofOfWork.sol) (`0x...1003`): Dynamic Proof of Work (PoW) verification engine & computational task reward vault.
- [`PISOValidatorGeoLocation.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOValidatorGeoLocation.sol): DePIN proof-of-physical-location & GeoLibre GIS spatial oracle.
- [`PISOTurboFieldfareAI.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOTurboFieldfareAI.sol): On-chain verification vault for Turbo-Fieldfare ~2 GB RAM AI agent inference.
- [`PISOAgentReachOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOAgentReachOracle.sol): Agent-Reach real-time web intelligence, YouTube, RSS, and GitHub oracle proof vault.
- [`PISOOpenPlanter.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOOpenPlanter.sol): OpenPlanter recursive entity resolution & Cytoscape.js knowledge graph evidence vault.
- [`PISOCopilotKit.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOCopilotKit.sol): CopilotKit AG-UI protocol, Generative UI, and Human-in-the-Loop signature approval vault.
- [`PISOBullshitDetector.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOBullshitDetector.sol): Bullshit-Detector claim verification, independent web source checking, and 0-10 BS score vault.
- [`PISOPublicApisOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOPublicApisOracle.sol): Public APIs directory discovery catalog & oracle proof vault.
- [`PISOFreqtradeOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOFreqtradeOracle.sol): Freqtrade algorithmic trading proof-of-work verification oracle & $PISO token reward vault.
- [`PISOSakuraAIOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOSakuraAIOracle.sol): Sakura Crossing off-chain multi-agent swarm verification oracle & PISO reward vault.
- [`PISOAIOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOAIOracle.sol): Dynamic AI network threat scoring & gas oracle.


---

## 📚 Technical Documentation Index

Detailed guides are located in the [`docs/`](file:///c:/Users/janla/extropianjanus/piso-chain/docs) folder:

1. 🏛️ [`docs/ARCHITECTURE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/ARCHITECTURE.md): Technical Architecture, Consensus System & Agent OS Protocol.
2. 🛡️ [`docs/VALIDATOR_NODE_GUIDE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/VALIDATOR_NODE_GUIDE.md): Node Operator Guide, Hardware Requirements & Staking.
3. 📜 [`docs/SMART_CONTRACTS.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/SMART_CONTRACTS.md): Full Smart Contracts Reference.
4. 🐋 [`docs/DEPLOYMENT_AND_DEVOPS.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/DEPLOYMENT_AND_DEVOPS.md): Docker, Kubernetes StatefulSets, & Monitoring.
5. ⚡ [`docs/DEVELOPER_API_AND_SDK.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/DEVELOPER_API_AND_SDK.md): Viem, Web3.py, & Ethers.js integration code.
5b. ⚡ [`docs/VIEM_EXAMPLES.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/VIEM_EXAMPLES.md): DappUniversity Viem Examples — 6 canonical Viem v2 patterns for PISO Chain (createPublicClient, createWalletClient, sendTransaction, readContract, writeContract, getLogs).
6. 🚰 [`docs/FAUCET_AND_RELAYER.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/FAUCET_AND_RELAYER.md): 1 PISO Faucet & Bridge Relayer daemon.
7. 🔍 [`docs/BLOCKCHAIN_EXPLORER_GUIDE.md`](file:///c:/Users/janla/extropianjanus/piso-chain/docs/BLOCKCHAIN_EXPLORER_GUIDE.md): Block Explorer hosting & dashboard guide.
9. 🗺️ [`docs/GEOLIBRE_GIS_INTEGRATION.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/GEOLIBRE_GIS_INTEGRATION.md): GeoLibre GIS Spatial Oracle & DePIN Node Map.
10. ⚡ [`docs/TURBO_FIELDFARE_AI.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/TURBO_FIELDFARE_AI.md): Turbo-Fieldfare Ultra-Low-RAM AI Agent Engine.
11. 👁️ [`docs/AGENT_REACH_ORACLE.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/AGENT_REACH_ORACLE.md): Agent-Reach Web Intelligence & Telemetry Oracle.
12. 🌱 [`docs/OPENPLANTER_KNOWLEDGE_GRAPH.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/OPENPLANTER_KNOWLEDGE_GRAPH.md): OpenPlanter Recursive Entity Resolution & Knowledge Graph.
13. 🤖 [`docs/COPILOTKIT_AG_UI.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/COPILOTKIT_AG_UI.md): CopilotKit AG-UI Protocol & Generative UI Assistant.
14. 🛡️ [`docs/BULLSHIT_DETECTOR_ORACLE.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/BULLSHIT_DETECTOR_ORACLE.md): Bullshit-Detector Fact-Checker & Hype Scoring Oracle.
15. 🌐 [`docs/PUBLIC_APIS_ORACLE.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/PUBLIC_APIS_ORACLE.md): Public APIs Directory Discovery & Oracle Hub.
16. 📖 [`docs/USER_TUTORIAL_MANUAL.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/USER_TUTORIAL_MANUAL.md): First-Time User Beginner Manual & 1-Click Mining Guide.
17. 🚀 [`docs/MAINNET_LAUNCH_CHECKLIST.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/MAINNET_LAUNCH_CHECKLIST.md): Mainnet Launch Readiness & Production Checklist.
18. 📈 [`docs/FREQTRADE_INTEGRATION.md`](file:///c:/Users/janla/piso-chain/piso-chain/docs/FREQTRADE_INTEGRATION.md): Freqtrade Algorithmic Trading Bot & Proof Oracle Integration Guide.
19. 📊 [`PITCH.md`](file:///c:/Users/janla/piso-chain/piso-chain/PITCH.md): Investor Pitch Deck & Ecosystem Overview.
20. 💎 [`TOKENOMICS.md`](file:///c:/Users/janla/piso-chain/piso-chain/TOKENOMICS.md): Token Allocation, Staking Yield APR & Vesting.


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
