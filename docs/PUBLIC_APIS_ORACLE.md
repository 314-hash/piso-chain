# 🌐 Public APIs Directory & Oracle Discovery Guide

This document outlines the architecture for integrating **public-apis** (`https://github.com/public-apis/public-apis.git`) into **PISO Chain AI Agent OS** for 1,000+ curated public API queries (Cryptocurrency, Geolocation, Forex exchange, Weather, Stock market data) with on-chain data proofs.

---

## 🏛️ Architecture Overview

Public-APIs equips PISO Chain AI Agents to discover and query production-grade public REST APIs dynamically without hardcoding API keys or custom scrapers:

```text
┌─────────────────────────────────────────────────────────────┐
│                 Public APIs Discovery Engine                │
│         (jcode/public_apis_oracle.py & APILayer)            │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Cryptographic SHA-256 Data Proof)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             PISOPublicApisOracle.sol Contract               │
│       (On-Chain Public API Query & Data Proof Vault)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 PISO Chain EVM Consensus Layer              │
│       (Autonomous AI Agent Workflows & Data Oracles)        │
└──────────────────────────────┘
```

---

## 📜 System Smart Contract: `PISOPublicApisOracle.sol`

- **Contract File**: [`contracts/PISOPublicApisOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOPublicApisOracle.sol)
- **Functions**:
  - `submitApiDataProof(bytes32 dataHash, string category, string apiName)`: Registers public API query payload proof on-chain.
  - `getApiDataProof(bytes32 dataHash)`: Queries agent address, category, API name, timestamp, and verification status.

---

## ⚡ Python Module: `jcode/public_apis_oracle.py`

- **File**: [`jcode/public_apis_oracle.py`](file:///c:/Users/janla/piso-chain/piso-chain/jcode/public_apis_oracle.py)
- **Sample Execution**:
```bash
.venv\Scripts\python.exe jcode/public_apis_oracle.py
```

---

## 🌐 Web Dashboard Studio

1. Open [`http://localhost:8085`](http://localhost:8085#publicapis).
2. Click **`🌐 Public APIs Directory`** on the left menu.
3. Select an API category (Cryptocurrency, Geolocation, Forex, Stocks, Weather) and click **`🌐 Query Public API Directory`**!
