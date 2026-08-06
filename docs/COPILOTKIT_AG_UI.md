# 🤖 CopilotKit AG-UI Protocol & Generative UI Integration Guide

This document outlines the architecture for integrating **CopilotKit** (`https://github.com/CopilotKit/CopilotKit.git`) and the **AG-UI Protocol** into **PISO Chain AI Agent OS** for Generative UI rendering, shared state streaming, and Human-in-the-Loop (HITL) transaction approvals.

---

## 🏛️ Architecture Overview

CopilotKit provides PISO Chain dApps and wallets with in-app AI copilot assistants capable of dynamically rendering Generative UI components based on user intent and on-chain state:

```text
┌─────────────────────────────────────────────────────────────┐
│                 CopilotKit Python Harness                   │
│         (jcode/copilot_kit.py & AG-UI Protocol)             │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Cryptographic SHA-256 State Proof)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               PISOCopilotKit.sol Contract                   │
│        (On-Chain AG-UI State & HITL Approval Vault)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 PISO Chain EVM Consensus Layer              │
│       (EIP-4337 Sponsored Gasless Transactions & Staking)   │
└──────────────────────────────┘
```

---

## 📜 System Smart Contract: `PISOCopilotKit.sol`

- **Contract File**: [`contracts/PISOCopilotKit.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOCopilotKit.sol)
- **Functions**:
  - `registerCopilotAction(bytes32 stateHash, string intent, bool hitlApproved)`: Registers copilot action intent and Human-in-the-Loop approval status on-chain.
  - `getActionProof(bytes32 stateHash)`: Queries user address, intent string, approval boolean, timestamp, and verification status.

---

## ⚡ Python Module: `jcode/copilot_kit.py`

- **File**: [`jcode/copilot_kit.py`](file:///c:/Users/janla/piso-chain/piso-chain/jcode/copilot_kit.py)
- **Sample Execution**:
```bash
.venv\Scripts\python.exe jcode/copilot_kit.py
```

---

## 🌐 Web Dashboard Studio

1. Open [`http://localhost:8085`](http://localhost:8085#copilotkit).
2. Click **`🤖 CopilotKit AG-UI Studio`** on the left menu.
3. Enter your command (e.g., "Stake 5,000 PISO in Parlia PoSA Validator election") and click **`🤖 Dispatch AG-UI Copilot Action`** to render interactive Generative UI cards and verify HITL approvals!
