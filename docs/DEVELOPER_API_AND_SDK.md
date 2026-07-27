# PISO Chain Developer API & SDK Integration Guide

This guide details how dApp developers can query, submit transactions, and build applications on **PISO Chain** using Viem, Ethers.js, and Web3.py.

---

## 🌐 Network Credentials

| Parameter | Specification |
| :--- | :--- |
| **Network Name** | PISO Chain Devnet |
| **Chain ID** | `2026001` (`0x1EE349`) |
| **Currency Symbol** | PISO |
| **Decimals** | 18 |
| **HTTP RPC Endpoint** | `http://localhost:8545` / `https://piso-rpc-dev.loca.lt` |
| **WebSocket RPC Endpoint** | `ws://localhost:8546` / `wss://piso-ws-dev.loca.lt` |
| **Block Explorer** | [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/) |

---

## ⚡ 1. Integrating with Viem (TypeScript / JavaScript)

Viem is the recommended lightweight Web3 engine for PISO Chain dApps.

```typescript
import { createPublicClient, createWalletClient, http, custom, parseEther } from 'viem';

// 1. Define PISO Chain Network Object
export const pisoChain = {
  id: 2026001,
  name: 'PISO Chain Devnet',
  network: 'piso',
  nativeCurrency: { name: 'PISO', symbol: 'PISO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://piso-rpc-dev.loca.lt'] },
    public: { http: ['https://piso-rpc-dev.loca.lt'] },
  },
  blockExplorers: {
    default: { name: 'PISO Explorer', url: 'https://piso-blockchain.vercel.app/' },
  },
};

// 2. Initialize Public Client
const publicClient = createPublicClient({
  chain: pisoChain,
  transport: http(),
});

// 3. Query Block & Balance
const blockNumber = await publicClient.getBlockNumber();
console.log('Current Block:', blockNumber);

const balance = await publicClient.getBalance({
  address: '0x1821F246a27287a2187E1D634B8883030fA14731',
});
console.log('Balance:', balance);
```

---

## 🐍 2. Integrating with Web3.py (Python)

```python
from web3 import Web3

RPC_URL = "https://piso-rpc-dev.loca.lt"

# Bypass tunnel headers if using remote proxy
w3 = Web3(Web3.HTTPProvider(RPC_URL, request_kwargs={"headers": {"Bypass-Tunnel-Remainder": "true"}}))

print("Is Connected:", w3.is_connected())
print("Chain ID:", w3.eth.chain_id)
print("Latest Block Number:", w3.eth.block_number)

balance_wei = w3.eth.get_balance("0x1821F246a27287a2187E1D634B8883030fA14731")
print("Balance in PISO:", w3.from_wei(balance_wei, "ether"))
```

---

## 🦊 3. Programmatically Adding PISO Chain to MetaMask

```javascript
const PISO_CHAIN_PARAMS = {
  chainId: "0x1EE349", // 2026001 hex
  chainName: "PISO Chain Devnet",
  nativeCurrency: { name: "PISO", symbol: "PISO", decimals: 18 },
  rpcUrls: ["https://piso-rpc-dev.loca.lt"],
  blockExplorerUrls: ["https://piso-blockchain.vercel.app/"]
};

async function addPisoChain() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [PISO_CHAIN_PARAMS]
      });
      console.log("PISO Chain successfully added to wallet!");
    } catch (err) {
      console.error("User rejected network addition:", err);
    }
  }
}
```

---

## ⛽ 4. Native Gasless Paymaster API (EIP-4337)

PISO Chain supports sponsored zero-gas transactions.

1. Deposit gas sponsorship funds into [`contracts/PISOPaymaster.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOPaymaster.sol).
2. Attach `paymasterAndData` hex payload to `UserOperation` struct when submitting transactions.
