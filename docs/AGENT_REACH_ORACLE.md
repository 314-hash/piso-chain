# 👁️ Agent-Reach Web Intelligence & Telemetry Oracle Guide

This document outlines the architecture for integrating **Agent-Reach** (`https://github.com/Panniantong/Agent-Reach`) into **PISO Chain AI Agent OS** for 1-click real-time web reading, YouTube subtitles, RSS feeds, GitHub issue tracking, and multi-backend search with cryptographic on-chain proofs.

---

## 🏛️ Architecture Overview

Agent-Reach equips PISO Chain AI Agents with 1-click internet access without complex scraper configurations or expensive API key subscriptions:

```text
┌─────────────────────────────────────────────────────────────┐
│                   Agent-Reach Web Scraper                   │
│     (Jina Reader, OpenCLI, yt-dlp, feedparser, GitHub v3)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Cryptographic SHA-256 Proof)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              PISOAgentReachOracle.sol Contract              │
│        (On-Chain Real-Time Web Intelligence Oracle Vault)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 PISO Chain EVM Consensus Layer              │
│        (AI Agent Autonomous Decision & Escrow Execution)    │
└──────────────────────────────┘
```

---

## 📜 System Smart Contract: `PISOAgentReachOracle.sol`

- **Contract File**: [`contracts/PISOAgentReachOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOAgentReachOracle.sol)
- **Functions**:
  - `submitWebDataProof(bytes32 dataHash, string targetTopic, string mode)`: Registers SHA-256 web data proof on-chain.
  - `getDataProof(bytes32 dataHash)`: Queries querying agent address, target topic, mode, timestamp, and verification status.

---

## ⚡ Python Module: `jcode/agent_reach.py`

- **File**: [`jcode/agent_reach.py`](file:///c:/Users/janla/piso-chain/piso-chain/jcode/agent_reach.py)
- **Sample Execution**:
```bash
.venv\Scripts\python.exe jcode/agent_reach.py
```

---

## 🌐 Web Dashboard Integration

1. Open [`http://localhost:8085`](http://localhost:8085#agentreach).
2. Click **`👁️ Agent-Reach Web Oracle`** on the left menu.
3. Enter your web target URL or topic, select channel mode (Web Search, YouTube Subtitles, RSS, GitHub), and click **`👁️ Execute Agent-Reach Web Oracle Query`**!
