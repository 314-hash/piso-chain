# PISO Chain Security Audit Preparation Package

This document contains the official threat model, smart contract inventory, security guarantees, invariant specifications, and audit submission details for **PISO Chain Layer 1 Blockchain**.

---

## 📜 Smart Contracts Inventory

| Contract | Address / Identifier | Key Responsibilities | Audit Focus |
| :--- | :--- | :--- | :--- |
| [`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol) | `0x...1000` | PoSA validator set registration, staking, epoch rotation | Access control, validator rotation logic |
| [`PISOSlashIndicator.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOSlashIndicator.sol) | `0x...1001` | Missed block proposal jailing & double-sign proof verification | Slashing threshold math, double-sign proof parsing |
| [`PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol) | `0x...1002` | NIST FIPS 204 ML-DSA & W-OTS+ post-quantum key vault | Replay protection, signature chain hashing |
| [`PISOStaking.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOStaking.sol) | Dynamic | Liquid staking delegation & rewards distribution | Reentrancy guard, balance accounting |
| [`PISOBridge.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOBridge.sol) | Dynamic | Cross-chain asset lock & mint relayer bridge | Multi-sig threshold verification, reentrancy |
| [`PISOPaymaster.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOPaymaster.sol) | Dynamic | EIP-4337 Account Abstraction gasless transaction sponsor | Sponsor vault balance accounting |
| [`PISOFaucet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOFaucet.sol) | Dynamic | On-chain 24h rate-limited PISO testnet faucet | Rate-limit enforcement, pause controls |

---

## 🛡️ Security Invariants & Threat Model

1. **Reentrancy Immunity**: All functions performing external native transfers (`call{value:...}`) MUST implement non-reentrant state locks (`nonReentrant` modifier).
2. **Double-Sign Defense**: Validators double-signing block headers at the same height MUST trigger immediate felony slashing (20% burn + jail).
3. **Quantum Signature Non-Replay**: Post-quantum transaction digests (`txHash`) MUST be uniquely bound to `(account, target, callData, nonce, chainId)` and recorded in `executedTxHashes` before call execution.
4. **Relayer Multi-Sig Threshold**: Bridge withdrawals MUST require `>= threshold` signatures from verified relayers before releasing funds.

---

## 🧪 Automated Static Analysis & Test Execution

Run the built-in automated audit suite prior to submitting to external auditor:

```bash
# 1. Run Automated Security Auditor
.venv\Scripts\python.exe scripts/run_security_audit.py

# 2. Run Hardhat Unit Test Suite
npm test
```
