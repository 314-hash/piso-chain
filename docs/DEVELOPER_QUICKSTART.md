# 🚀 PISO Chain Developer Quickstart Guide

Welcome to **PISO Chain** — the enterprise-grade Layer 1 blockchain engineered with NIST FIPS 204 Post-Quantum Security, native EIP-4337 Account Abstraction, SLIP-39/44 standard wallet infrastructure, and the PISO Agent OS AI Worker Economy.

---

## ⚡ Network Information

- **Network Name**: PISO Chain Mainnet
- **Chain ID**: `2026001` (`0x1EE349`)
- **Native Currency**: PISO (18 Decimals)
- **RPC Endpoint (HTTP)**: `https://rpc.piso-chain.org` (Local: `http://localhost:8545`)
- **WebSocket Endpoint**: `wss://rpc.piso-chain.org` (Local: `ws://localhost:8546`)
- **REST API Endpoint**: `http://localhost:8081`
- **SLIP-44 Coin Type**: `2028'` (`m/44'/2028'/0'/0/0`)
- **Block Explorer**: `https://explorer.piso-chain.org`

---

## 📦 Multi-Language SDK Installation

### 1. TypeScript / JavaScript (`@piso-chain/sdk`)
```bash
npm install @piso-chain/sdk viem ethers
```

```typescript
import { PisoSDK } from '@piso-chain/sdk';

const sdk = new PisoSDK({ rpcUrl: 'https://rpc.piso-chain.org' });

// Generate 24-word mainnet seed phrase & wallet
const wallet = await sdk.createWallet(24);
console.log('Address:', wallet.address);
console.log('Post-Quantum Public Key:', wallet.pqcPublicKey);

// Check PISO Balance
const balance = await sdk.getBalance(wallet.address);
console.log('Balance:', balance, 'PISO');
```

### 2. Python (`piso-sdk`)
```bash
pip install piso-sdk
```

```python
from piso_sdk import PisoWallet

# Create new mainnet wallet with SLIP-44 derivation path (m/44'/2028'/0'/0/0)
wallet = PisoWallet.create(words=24)
print("Address:", wallet.address)
print("Mnemonic:", wallet.mnemonic)

# Perform SLIP-39 Shamir Secret Sharing
shares = wallet.split_secret(threshold=2, shares=3)
print("SLIP-39 Shares:", shares)
```

---

## 🦊 Connecting MetaMask / Rabby / Viem

```typescript
import { createPublicClient, http } from 'viem';

export const pisoMainnet = {
  id: 2026001,
  name: 'PISO Chain Mainnet',
  network: 'piso',
  nativeCurrency: { name: 'PISO Coin', symbol: 'PISO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.piso-chain.org'] },
    public: { http: ['https://rpc.piso-chain.org'] },
  },
  blockExplorers: {
    default: { name: 'PISO Explorer', url: 'https://explorer.piso-chain.org' },
  },
};

const client = createPublicClient({
  chain: pisoMainnet,
  transport: http(),
});

const blockNumber = await client.getBlockNumber();
console.log('Current Block Height:', blockNumber);
```

---

## 🤖 PISO Agent OS — Autonomous AI Task Escrow

AI agents can lock bounties and verify task execution on-chain:

```python
import requests

# Dispatch AI Task Escrow via REST API
response = requests.post("http://localhost:8081/api/ai-agent", json={
    "agent_id": "jcode-swarm-agent-alpha",
    "task": "Automated Protocol Verification"
})
print("AI Task Escrow Status:", response.json())
```

---

## 📜 System Smart Contract Addresses

| Smart Contract | Address | Function |
| :--- | :--- | :--- |
| **`PISOValidatorSet`** | `0x0000000000000000000000000000000000001000` | Parlia PoSA Validator Election & Staking |
| **`PISOSlashIndicator`** | `0x0000000000000000000000000000000000001001` | Double-Sign Misdemeanors & Slashing |
| **`PISOQuantumSecurity`**| `0x0000000000000000000000000000000000001002` | NIST FIPS 204 ML-DSA / W-OTS+ Key Vault |
| **`PISOPaymaster`** | `0x0000000000000000000000000000000000001003` | Native EIP-4337 Gasless Paymaster |
| **`PISOBridge`** | `0x0000000000000000000000000000000000001004` | Cross-Chain Asset Lock/Mint Bridge |
| **`PISOZKRecovery`** | `0x0000000000000000000000000000000000001005` | ZK Merkle Proof Guardian Social Recovery |
| **`PISOAIOracle`** | `0x0000000000000000000000000000000000001006` | AI Agent Reputation Score Oracle |
