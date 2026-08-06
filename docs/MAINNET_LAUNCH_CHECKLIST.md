# PISO Chain Mainnet Production Launch Checklist & Readiness Guide

This document outlines the step-by-step production launch protocol to deploy **PISO Chain Mainnet** (Chain ID: `2026001`), configure multi-validator BFT node consensus, deploy system precompiled contracts, and activate the Proof of Work (PoW) & AI Agent OS ecosystem.

---

## 📋 Pre-Launch Audit & Verification Status

| Security Vector | Audit Tool | Status |
| :--- | :--- | :--- |
| **Smart Contract Reentrancy Defense** | Static Analysis (`run_security_audit.py`) | ✅ VERIFIED (100% Pass) |
| **Post-Quantum Vault (NIST FIPS 204)** | Winternitz & Dilithium ML-DSA Check | ✅ VERIFIED (NIST Cat 5) |
| **Validator Domain Tag Isolation** | Cryptographic Key Checker | ✅ VERIFIED (`piso-validator-key-v1`) |
| **Memory Zeroization Routine** | C-Level / PyCryptodome Buffer Check | ✅ VERIFIED |
| **SLIP-0044 Registered Coin Type** | Satoshilabs Registry (`slip-0044.md`) | ✅ VERIFIED (`2026'` / `m/44'/2026'/0'/0/0`) |
| **PoW Nonce Verification** | Unit Tests (`PISOProofOfWork.test.js`) | ✅ VERIFIED (Hardhat 0.8.20) |
| **Secret Scanning Audit** | Repository Scanner | ✅ VERIFIED (0 Plaintext Keys) |

---

## 🚀 1. Production Genesis Generation

Generate the official Mainnet Genesis allocation file (`genesis/genesis_mainnet.json`) featuring 100 Billion $PISO total genesis supply, 3 to 21 validator node keystores, and system contract precompiles:

```bash
# Provision Genesis Keystores and Genesis File
.venv\Scripts\python.exe scripts/create_mainnet_genesis.py
```

### Precompiled System Addresses:
- `0x0000000000000000000000000000000000001000`: `PISOValidatorSet.sol` (PoSA Validator Registration)
- `0x0000000000000000000000000000000000001001`: `PISOSlashIndicator.sol` (Misdemeanor Slashing Engine)
- `0x0000000000000000000000000000000000001002`: `PISOQuantumSecurity.sol` (NIST ML-DSA Vault)
- `0x0000000000000000000000000000000000001003`: `PISOProofOfWork.sol` (1M PISO Genesis PoW Reward Vault)

---

## 🛡️ 2. Multi-Validator Cluster Launch (Docker / K8s)

Deploy the multi-validator consensus cluster across isolated cloud node instances:

### Using Docker Compose (Multi-Validator Topology):
```bash
# Provision Keystores for 3 Primary Validators
.venv\Scripts\python.exe scripts/setup_multi_validator_cluster.py

# Launch Multi-Validator Docker Stack
docker-compose -f docker-compose.multi-validator.yml up -d
```

### Using Kubernetes (Production K8s StatefulSets):
```bash
kubectl apply -f k8s/genesis-configmap.yaml
kubectl apply -f k8s/validator-statefulset.yaml
kubectl apply -f k8s/rpc-gateway-deployment.yaml
```

---

## ⛏️ 3. PoW Miner Worker & AI Escrow Agent Activation

Launch background workers for Proof of Work task solving and AI Agent task escrows:

```bash
# Start Standalone PoW Mining Worker
.venv\Scripts\python.exe scripts/pow_miner.py --difficulty 16

# Start Autonomous AI Worker Task Escrow Runner
.venv\Scripts\python.exe scripts/agent_task_escrow_runner.py
```

---

## 🌐 4. Public RPC & Web Dashboard Deployment

1. **Deploy Production Web Dashboard**:
   - Host `dashboard/` static bundle on Vercel, Cloudflare Pages, or AWS S3 (`https://piso-blockchain.vercel.app`).
2. **Build WebToApp Mobile Package**:
   ```bash
   .venv\Scripts\python.exe scripts/build_web_to_app.py
   ```
3. **Start Production Live RPC & Tunnels**:
   ```bash
   .venv\Scripts\python.exe scripts/start_live_rpc.py
   ```

---

## ✅ Mainnet Readiness Sign-Off Checklist

- [x] EVM Chain ID set to `2026001` (`0x1EE349`).
- [x] SLIP-0044 Registered Coin Type set to `2026'` (`m/44'/2026'/0'/0/0`) per SatoshiLabs SLIP-0044 spec.
- [x] Block finality verified at `3.0` seconds.
- [x] 100% Security Audit Pass achieved via `scripts/run_security_audit.py`.
- [x] `PISOProofOfWork.sol` deployed at `0x...1003` with `nonReentrant` defense.
- [x] Web Dashboard updated with 1-Click 24-Hour Automated Miner and browser hashing solver.
- [x] Mobile WTA1 export token generated in `config/piso_chain_wta1_export.txt`.
