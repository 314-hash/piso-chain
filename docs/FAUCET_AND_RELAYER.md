# PISO Chain Testnet Faucet & Cross-Chain Bridge Relayer

This document details the open-source **Testnet Faucet** and **Cross-Chain Bridge Relayer Daemon** implemented for **PISO Chain**.

---

## 🚰 On-Chain Rate-Limited Testnet Faucet (`PISOFaucet.sol`)

- **Smart Contract:** [`contracts/PISOFaucet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOFaucet.sol)
- **Web Dashboard:** Claim free coins directly at [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/) under **Testnet Faucet**.

### Features
1. **24-Hour Address Cooldown:** Prevents spam requests by enforcing `lastRequestTime[user] + 24 hours` on-chain.
2. **Standardized Drip Amount:** Dispenses `1 PISO` testnet coin per request.
3. **Emergency Pause:** Admin circuit breaker for maintenance.

---

## 🌉 Cross-Chain Bridge Relayer Daemon (`bridge/relayer.py`)

- **Daemon Script:** [`bridge/relayer.py`](file:///c:/Users/janla/extropianjanus/piso-chain/bridge/relayer.py)
- **Config:** [`bridge/config.json`](file:///c:/Users/janla/extropianjanus/piso-chain/bridge/config.json)

### Relayer Workflow

```
[User Deposits PISO] -> PISOBridge.sol (Emits Deposit Event)
                                  |
                                  v
                    bridge/relayer.py Daemon (Scans Blocks)
                                  |
                                  v
[Relayer Executes Mint/Unlock] -> Target Chain (Ethereum / BNB Chain)
```

### Running the Bridge Relayer

```bash
.venv\Scripts\python.exe bridge/relayer.py
```
