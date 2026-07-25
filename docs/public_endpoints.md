# PISO Chain Public Network Endpoints

Your **PISO Chain Layer 1 network** is now live and accessible publicly on the internet!

---

## 🌐 Public Network Details

| Parameter | Value |
| :--- | :--- |
| **Network Name** | PISO Chain Devnet |
| **Native Coin** | PISO |
| **Symbol** | PISO |
| **Decimals** | 18 |
| **Chain ID** | `2026001` (`0x1EE349`) |
| **Web Dashboard (Vercel)** | [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/) |
| **HTTP RPC URL** | `https://piso-rpc.loca.lt` |
| **WebSocket RPC URL** | `wss://piso-ws.loca.lt` |
| **Block Explorer** | `https://piso-explorer.loca.lt` |


---

## 🦊 Connecting MetaMask / Web3 Wallet

To connect MetaMask or any EVM wallet (Rabby, Rainbow, Coinbase Wallet):

1. Open **MetaMask** $\rightarrow$ Click Network Selector $\rightarrow$ **Add Network** $\rightarrow$ **Add network manually**.
2. Fill in the network details:
   - **Network name:** `PISO Chain Devnet`
   - **New RPC URL:** `https://piso-rpc.loca.lt`
   - **Chain ID:** `2026001`
   - **Currency symbol:** `PISO`
   - **Block explorer URL:** `https://piso-explorer.loca.lt`
3. Click **Save**.

---

## 💻 Web3.py / Ethers.js Code Snippet

### Python (Web3.py)
```python
from web3 import Web3

rpc_url = "https://piso-rpc.loca.lt"
w3 = Web3(Web3.HTTPProvider(rpc_url, request_kwargs={"headers": {"Bypass-Tunnel-Remainder": "true"}}))

print("Connected:", w3.is_connected())
print("Chain ID:", w3.eth.chain_id)
print("Latest Block:", w3.eth.block_number)
```

### JavaScript (Ethers.js / Viem)
```javascript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://piso-rpc.loca.lt");
const blockNumber = await provider.getBlockNumber();
console.log("Current PISO Block:", blockNumber);
```

---

## 🔑 Initial Funded Validator Account

- **Validator Address:** `0x1821F246a27287a2187E1D634B8883030fA14731`
- **Initial Balance:** `10,000,000,000 PISO`
