# 🛡️ Bullshit-Detector Fact-Checker & Hype Scoring Guide

This document outlines the architecture for integrating **bullshit-detector** (`https://github.com/SerhiiKorniienko/bullshit-detector.git`) into **PISO Chain AI Agent OS** for claim-by-claim content audits, independent web source verification, 0-10 BS score calculation, and on-chain report registration.

---

## 🏛️ Architecture Overview

Bullshit-Detector equips PISO Chain AI Agents to fact-check videos, articles, tweets, and PDFs, verifying every claim against independent web sources before making financial, trading, or protocol decisions:

```text
┌─────────────────────────────────────────────────────────────┐
│               Bullshit-Detector Python Oracle               │
│          (jcode/bullshit_detector.py & Claim Engine)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Cryptographic SHA-256 Report Proof)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             PISOBullshitDetector.sol Contract               │
│       (On-Chain Fact-Check Report & BS Score Vault)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 PISO Chain EVM Consensus Layer              │
│       (AI Agent Risk Assessment & Automated Governance)     │
└──────────────────────────────┘
```

---

## 📜 System Smart Contract: `PISOBullshitDetector.sol`

- **Contract File**: [`contracts/PISOBullshitDetector.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOBullshitDetector.sol)
- **Functions**:
  - `registerAuditReport(bytes32 reportHash, string targetUrl, uint256 bsScoreScaled, uint256 claimsCount)`: Registers claim audit report and BS score on-chain.
  - `getAuditProof(bytes32 reportHash)`: Queries verifier address, target URL, BS score, claim count, timestamp, and verification status.

---

## ⚡ Python Module: `jcode/bullshit_detector.py`

- **File**: [`jcode/bullshit_detector.py`](file:///c:/Users/janla/piso-chain/piso-chain/jcode/bullshit_detector.py)
- **Sample Execution**:
```bash
.venv\Scripts\python.exe jcode/bullshit_detector.py
```

---

## 🌐 Web Dashboard Studio

1. Open [`http://localhost:8085`](http://localhost:8085#bsdetector).
2. Click **`🛡️ Bullshit-Detector Oracle`** on the left menu.
3. Enter your target video, tweet, or article URL and click **`🛡️ Audit Claims & Compute BS Score`** to view claim-by-claim verdicts and on-chain BS scores!
