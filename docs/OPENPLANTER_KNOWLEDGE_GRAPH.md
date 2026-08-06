# 🌱 OpenPlanter Recursive Knowledge Graph & Investigation Guide

This document outlines the architecture for integrating **OpenPlanter** (`https://github.com/ShinMegamiBoson/OpenPlanter`) into **PISO Chain AI Agent OS** for recursive entity resolution, on-chain contract/transaction relationship extraction, Cytoscape.js force-directed knowledge graphs, and cryptographic verification proofs.

---

## 🏛️ Architecture Overview

OpenPlanter ingests heterogeneous datasets across PISO Chain (validator stakes, system smart contracts, EIP-4337 paymaster operations, and AI agent worker escrows), resolving entities and rendering live evidence-backed knowledge graphs:

```text
┌─────────────────────────────────────────────────────────────┐
│                 OpenPlanter Python Engine                   │
│          (jcode/open_planter.py & Cytoscape.js)             │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Cryptographic SHA-256 Proof)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               PISOOpenPlanter.sol Contract                  │
│       (On-Chain Entity Resolution & Evidence Vault)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 PISO Chain EVM Consensus Layer              │
│       (On-Chain Graph Analytics & Smart Contract State)     │
└──────────────────────────────┘
```

---

## 📜 System Smart Contract: `PISOOpenPlanter.sol`

- **Contract File**: [`contracts/PISOOpenPlanter.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOOpenPlanter.sol)
- **Functions**:
  - `submitGraphProof(bytes32 graphHash, string targetEntity, uint256 entitiesCount, uint256 relationshipsCount)`: Registers entity resolution graph proofs on-chain.
  - `getGraphProof(bytes32 graphHash)`: Queries investigator address, target entity, entity count, relationship count, timestamp, and verification status.

---

## ⚡ Python Module: `jcode/open_planter.py`

- **File**: [`jcode/open_planter.py`](file:///c:/Users/janla/piso-chain/piso-chain/jcode/open_planter.py)
- **Sample Execution**:
```bash
.venv\Scripts\python.exe jcode/open_planter.py
```

---

## 🌐 Web Dashboard Integration

1. Open [`http://localhost:8085`](http://localhost:8085#openplanter).
2. Click **`🌱 OpenPlanter Entity Graph`** on the left menu.
3. Enter your entity target (e.g. "PISO Mainnet Consensus Cluster") and click **`🌱 Build Evidence Knowledge Graph`** to render the interactive force-directed entity map!
