# 🪐 PISO Chain: Comprehensive Technical & Operational Manual
> **Complete Specification, Architecture, Smart Contracts, Tokenomics, SDK Integration, Agent OS, and Node Operator Guide**

---

## 📌 1. Executive Summary

**PISO Chain** is an enterprise-grade, high-performance, EVM-compatible Layer 1 blockchain network built on **BSC Parlia Proof-of-Staked-Authority (PoSA)** consensus and the **PISO Agent OS Autonomous AI Worker Ecosystem**. Engineered for sub-second block propagation, 3-second block finality, near-zero transaction fees, native account abstraction (EIP-4337), post-quantum cryptographic security (NIST FIPS 204 ML-DSA & Winternitz W-OTS+), and on-chain AI task escrow verification, PISO Chain bridges institutional financial infrastructure with decentralized Web3 ecosystems.

### Core Protocol Pillars:
* **Consensus Engine**: BSC Parlia PoSA / BFT Multi-Signer Engine (3 to 21 Active Consensus Signers).
* **Proof of Work (PoW) & 1-Click Mining**: Keccak-256 target difficulty solver (`PISOProofOfWork.sol` `0x...1003`) & 1-Click 24h automated mining engine.
* **SLIP-0044 Registered Coin Type**: Standardized HD wallet derivation path `m/44'/2026'/0'/0/0` per SatoshiLabs SLIP-0044 registry.
* **GeoLibre GIS & DePIN Spatial Oracle**: Powered by `opengeos` GeoLibre & MapLibre GL JS (`PISOValidatorGeoLocation.sol`).
* **Turbo-Fieldfare AI Engine**: Gemma 4 26B-A4B inference in ~2 GB RAM footprint (`PISOTurboFieldfareAI.sol` & `jcode/turbo_fieldfare.py`).
* **Agent-Reach Web Oracle**: 1-click live web scraping, YouTube subtitles, RSS feeds, and GitHub issue telemetry (`PISOAgentReachOracle.sol` & `jcode/agent_reach.py`).
* **OpenPlanter Entity Graph**: Recursive entity resolution across EVM transactions & contracts (`PISOOpenPlanter.sol` & `jcode/open_planter.py`).
* **CopilotKit AG-UI Assistant**: Generative UI component rendering, shared state streaming, and HITL approvals (`PISOCopilotKit.sol` & `jcode/copilot_kit.py`).
* **Bullshit-Detector Fact-Checker**: Claim-by-claim content verification engine & 0-10 BS score logging (`PISOBullshitDetector.sol` & `jcode/bullshit_detector.py`).
* **Agent OS Integration**: Powered by `jcode` (`https://github.com/1jehuang/jcode.git`) high-efficiency agent harness.
* **Total Supply**: `100,000,000,000 PISO` (100 Billion Native Coins).
* **Block Finality**: `3.0 Seconds` deterministic block production.
* **EVM Compatibility**: Full support for Solidity `^0.8.20`, Hardhat, Foundry, Ethers.js, Viem, and Web3.py.
* **Post-Quantum Cryptography**: On-chain PQC vault powered by NIST FIPS 204 (ML-DSA / Dilithium) and W-OTS+ signatures.
* **Native Account Abstraction**: Pre-deployed EIP-4337 Paymaster and UserOperation Bundler infrastructure.
* **Privacy & Recovery**: Zero-Knowledge (ZK) privacy-preserving social guardian recovery system.

---

## 🤖 2. PISO Agent OS & AI Worker Protocol

PISO Chain includes native support for autonomous AI workers operating as cryptographically verified economic participants:

* **Harness Engine**: Integrated **`jcode`** (`https://github.com/1jehuang/jcode.git`) high-performance, low-RAM agent harness featuring zero-copy semantic memory graphs, inline Mermaid rendering, and sub-agent swarm coordination.
* **Smart Escrow Task Protocol**: Jobs locked on-chain in smart contract escrows require cryptographic SHA-256 work proof submissions before releasing PISO token payouts.
* **Reputation System**: Dynamic reputation score (`100.0` max) automatically updated on-chain upon successful work verification.

---

## 🌐 3. Network Specifications & Connection Endpoints

| Parameter | Specification |
| :--- | :--- |
| **Network Name** | PISO Chain Devnet / Mainnet |
| **Chain ID (Decimal)** | `2026001` |
| **Chain ID (Hexadecimal)** | `0x1EE349` |
| **Native Coin Symbol** | **$PISO** (18 Decimals) |
| **Genesis Total Supply** | `100,000,000,000 PISO` (100 Billion) |
| **Block Time** | `3.0` Seconds |
| **Consensus Engine** | BSC Parlia Proof-of-Staked-Authority (PoSA) |
| **Agent Harness** | `jcode` Swarm Harness ([`jcode/`](file:///c:/Users/janla/extropianjanus/piso-chain/jcode)) |
| **Minimum Validator Stake** | `100,000 PISO` |
| **Web Dashboard** | [`http://localhost:8080`](http://localhost:8080) / [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/) |
| **HTTP RPC Gateway** | `https://piso-rpc-dev.loca.lt` / `http://localhost:8545` |
| **WebSocket RPC** | `wss://piso-ws-dev.loca.lt` / `ws://localhost:8546` |
| **Block Explorer** | [`http://localhost:8080`](http://localhost:8080) |

### 🦊 MetaMask Network Configuration (JSON)
```json
{
  "chainId": "0x1EE349",
  "chainName": "PISO Chain Devnet",
  "nativeCurrency": {
    "name": "PISO",
    "symbol": "PISO",
    "decimals": 18
  },
  "rpcUrls": [
    "https://piso-rpc-dev.loca.lt",
    "http://127.0.0.1:8545"
  ],
  "blockExplorerUrls": [
    "http://localhost:8080/"
  ]
}
```

---

## 🏛️ 4. Multi-Validator Topology & Network Architecture

PISO Chain relies on a production Sentry Node topology to shield consensus signers from network-level attacks:

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
  | (0x680fecF8...)  |<---->| (0x0f4856be...)  |<---->| (0xF82d8707...)  |
  +------------------+      +------------------+      +------------------+
```
