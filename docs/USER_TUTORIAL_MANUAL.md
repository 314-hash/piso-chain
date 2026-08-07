# 📖 PISO Chain - First-Time User Tutorial & Manual

Welcome to **PISO Chain**! This comprehensive, beginner-friendly manual guides you step-by-step through setting up your Web3 wallet, starting your 1-Click 24-Hour Mining cycle, interacting with smart contracts, and using all integrated **Enterprise Open-Source Repositories**.

---

## 🌐 Network Quick Reference

| Parameter | Value |
| :--- | :--- |
| **Network Name** | PISO Chain Mainnet / Devnet |
| **Chain ID** | `2026001` (`0x1EE349`) |
| **Coin Symbol** | `PISO` (18 Decimals) |
| **SLIP-0044 Coin Type** | `2026'` (`m/44'/2026'/0'/0/0`) |
| **Block Time** | `3.0` Seconds |
| **Local Web Dashboard** | [`http://localhost:8080`](http://localhost:8080) |
| **Local HTTP RPC** | `http://127.0.0.1:8545` |
| **Public HTTP RPC** | `https://piso-rpc-dev.loca.lt` |
| **Treasury Mining Contract** | `0x0000000000000000000000000000000000001004` (60B PISO Reserve) |

---

## 🎨 Beginner Infographic Dashboard Roadmap

The PISO Chain Web Dashboard ([`http://localhost:8080`](http://localhost:8080)) includes a visual Infographic Guide designed specifically for first-time users:

1. 👛 **Step 1: Create Free Wallet** — Connect MetaMask or generate a 24-word secret phrase (`m/44'/2026'/0'/0/0`).
2. ⛏️ **Step 2: 1-Click 24h Mining** — Tap the gold **"Start 24h Mining"** button to accumulate `+0.000578 PISO/sec` and claim 50 PISO daily.
3. 🏛️ **Step 3: Mining Treasury (`0x...1004`)** — Claim 1 PISO testnet drip and view the 60B PISO reserve.
4. 🚀 **Step 4: Enterprise Open-Source Suite** — Access 9 integrated open-source AI & security engines via compact category tabs.
5. 🗺️ **Step 5: DePIN GIS Node Map** — View live validator node positions across Manila, Singapore, Tokyo, London, and San Francisco.
6. 🤖 **Step 6: AI Agents & Copilot** — Run local ~2GB Gemma 4 LLMs, search live Web data via Agent-Reach, or render Generative UI cards.
7. 🛡️ **Step 7: Bullshit Detector** — Fact-check any YouTube video, tweet, or article URL for claim accuracy and get a 0–10 BS hype score.

---

## 👛 Step 1: Setting Up Your PISO Wallet

### Option A: Connect MetaMask (1-Click Setup)
1. Open [`http://localhost:8080`](http://localhost:8080) in your web browser.
2. Click **🦊 Add to MetaMask** in the top right corner.
3. Approve the network addition dialog in MetaMask. MetaMask will automatically configure Chain ID `2026001` and RPC `http://127.0.0.1:8545`.

### Option B: Create a New HD Wallet via PISO CLI
```bash
# Create a new 24-word BIP-39 mnemonic & SLIP-0044 wallet
.venv\Scripts\python.exe piso wallet:create --words 24
```

---

## ⚡ Step 2: 1-Click 24-Hour Mining & Treasury Guide

1. Open [`http://localhost:8080/#pow`](http://localhost:8080/#pow).
2. Click **⛏️ START 24-HOUR MINING SESSION**.
3. Watch your real-time hashrate yield accumulate (`+0.000578 PISO/sec`).
4. Click **📜 Submit Proof On-Chain (PISOProofOfWork.sol)** to claim your mined coins into your wallet!

---

## 🚀 Step 3: Guide to Integrated Open-Source Repositories

PISO Chain natively integrates 9 world-class open-source repositories into its core protocol:

### 1. 🕵️ Legendary OSINT (`K2SOsint/Legendary_OSINT`)
- **Purpose**: Forensic wallet tracing, IP/domain recon, and dark web leak hash matching.
- **How to Use**:
  - Open **Enterprise AI & Security Suite** tab on the Dashboard.
  - Enter any EVM wallet address or domain in **Legendary OSINT Engine**.
  - Click **Investigate** to generate a risk score (0-100) and on-chain attestation hash.

### 2. 🌸 PraisonAI Multi-Agent (`MervinPraison/PraisonAI`)
- **Purpose**: Low-code multi-agent swarm orchestration (Auditor, Researcher, Trader) with self-reflection audit loops.
- **How to Use**:
  - Enter your task prompt (e.g. *"Audit smart contract reentrancy"*).
  - Click **Orchestrate** to run multi-agent consensus and get verified code outputs.

### 3. ⏱️ JobSync Scheduler (`Gsync/jobsync`)
- **Purpose**: Asynchronous AI worker task scheduler & capacity matchmaker.
- **How to Use**: Click **Fetch Active Job Tasks** on the Dashboard to inspect worker node queues.

### 4. 🔒 OWASP AISVS Shield (`OWASP/AISVS`)
- **Purpose**: OWASP AI Security Verification Standard (14-Chapter L1-L3 Controls) & prompt injection guardrail.
- **How to Use**: Click **Run 14-Chapter Compliance Audit** to generate a security verification score.

### 5. 👁️ IRONSIGHT Command Center (`NoblerWorks-HQ/IRONSIGHT`)
- **Purpose**: Real-time threat intelligence & validator node situational awareness telemetry.
- **How to Use**: Click **Poll Live Telemetry** to view active threat feeds.

### 6. 🌐 L0p4Map Scanner (`HaxL0p4/L0p4Map`)
- **Purpose**: P2P validator network scanner & Vulners CVE vulnerability correlation.
- **How to Use**: Click **Scan Network & Build Graph** to generate a P2P topology matrix.

### 7. 📄 MinerU Whitepaper Parser (`opendatalab/MinerU`)
- **Purpose**: PDF layout analysis, LaTeX formula extraction, & RAG Markdown generator.
- **How to Use**: Click **Parse Whitepaper PDF** to extract LaTeX math blocks and GFM tables.

### 8. 🤝 RefRef Referral & Affiliate (`amicalhq/refref`)
- **Purpose**: On-chain referral attribution, unique code generator (`PISO-REF-xxx`), and reward payouts.
- **How to Use**:
  - Click **Generate Code** to create your unique referral link.
  - Click **Log Conversion** to record referred conversions and receive native PISO token rewards.

### 9. ⚡ Nethermind C# Execution Client (`NethermindEth/nethermind`)
- **Purpose**: High-performance C# / .NET 8 EVM execution client & gas tracer.
- **How to Use**: Click **Node Telemetry** or **EVM Gas Trace** on the Dashboard to inspect Nethermind node state.
