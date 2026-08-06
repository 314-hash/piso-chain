# ⚡ Turbo-Fieldfare Ultra-Low-RAM AI Agent Engine Integration Guide

This document specifies the integration of **turbo-fieldfare** (ultra-compact Gemma 4 26B-A4B inference engine in ~2 GB RAM: [https://git.wopr.ltd/url/turbo-fieldfare.git](https://git.wopr.ltd/url/turbo-fieldfare.git)) into **PISO Chain AI Agent OS**.

---

## 🏛️ System Architecture

Turbo-Fieldfare brings high-efficiency LLM inference to resource-constrained environments (e.g. M-Series MacBooks, mobile devices, and lightweight edge nodes) using 4-bit quantization and SIMD vector execution.

```text
┌─────────────────────────────────────────────────────────────┐
│          TurboFieldfareEngine (jcode/turbo_fieldfare.py)    │
│  (Gemma 4 26B-A4B 4-bit Quantized - 1.85 GB / 2.00 GB RAM)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Cryptographic Execution Proof)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              PISOTurboFieldfareAI.sol Contract               │
│        (On-Chain Low-Memory AI Proof Verification Vault)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 PISO Chain EVM Consensus Layer              │
│       (EIP-4337 Sponsored AI Task Escrows & Proofs)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📜 System Smart Contract: `PISOTurboFieldfareAI.sol`

- **Contract File**: [`contracts/PISOTurboFieldfareAI.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOTurboFieldfareAI.sol)
- **Functions**:
  - `submitAiProof(bytes32 taskHash, uint256 ramUsedMb, uint256 timeMs)`: Verifies that memory footprint satisfies the **~2 GB RAM limit** (`<= 2048 MB`).
  - `getTaskProof(bytes32 taskHash)`: Queries agent address, RAM usage, execution time, and on-chain verification status.

---

## ⚡ Python Module: `jcode/turbo_fieldfare.py`

- **File**: [`jcode/turbo_fieldfare.py`](file:///c:/Users/janla/piso-chain/piso-chain/jcode/turbo_fieldfare.py)
- **Sample Execution**:
```bash
.venv\Scripts\python.exe jcode/turbo_fieldfare.py
```
**Sample Output**:
```json
{
  "model": "Gemma-4-26B-A4B-Turbo",
  "ram_used_mb": 1850.0,
  "ram_budget_mb": 2048.0,
  "elapsed_ms": 42.8,
  "tokens_generated": 24,
  "output_text": "[TurboFieldfare] Processing prompt in 2048MB RAM... Analysing on-chain EVM state & PoW metrics for PISO Chain...",
  "proof_hash": "0x3f8a9e10d2b...",
  "status": "SUCCESS"
}
```

---

## 🌐 Web Dashboard Integration

1. Navigate to [`http://localhost:8085`](http://localhost:8085#turbofieldfare).
2. Select **`⚡ Turbo-Fieldfare AI (~2GB RAM)`** on the left menu.
3. Enter your AI prompt and click **`⚡ Run 2 GB RAM Local Gemma Inference`** to execute token generation and verify on-chain proofs!
