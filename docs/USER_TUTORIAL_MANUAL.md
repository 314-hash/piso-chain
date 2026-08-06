# 📖 PISO Chain - First-Time User Tutorial & Manual

Welcome to **PISO Chain**! This beginner-friendly manual guides you step-by-step through setting up your Web3 wallet, starting your 1-Click 24-Hour Mining cycle, interacting with smart contracts, and using the mobile app.

---

## 🌐 Network Quick Reference

| Parameter | Value |
| :--- | :--- |
| **Network Name** | PISO Chain Mainnet / Devnet |
| **Chain ID** | `2026001` (`0x1EE349`) |
| **Coin Symbol** | `PISO` (18 Decimals) |
| **SLIP-0044 Coin Type** | `2026'` (`m/44'/2026'/0'/0/0`) |
| **Block Time** | `3.0` Seconds |
| **Local Web Dashboard** | [`http://localhost:8085`](http://localhost:8085) |
| **Local HTTP RPC** | `http://localhost:8545` |
| **PoW System Contract** | `0x0000000000000000000000000000000000001003` |

---

## 🎨 Beginner Infographic Dashboard Roadmap

The PISO Chain Web Dashboard ([`http://localhost:8085`](http://localhost:8085)) includes a visual 6-card Infographic Guide designed specifically for first-time users:

1. 👛 **Step 1: Create Free Wallet** — Connect MetaMask or generate a 24-word secret phrase (`m/44'/2026'/0'/0/0`).
2. ⛏️ **Step 2: 1-Click 24h Mining** — Tap the gold **"Start 24h Mining"** button to accumulate `+0.000578 PISO/sec` and claim 50 PISO daily.
3. 🗺️ **Step 3: DePIN GIS Node Map** — View live validator node positions across Manila, Singapore, Tokyo, London, and San Francisco.
4. 🤖 **Step 4: AI Agents & Copilot** — Run local ~2GB Gemma 4 LLMs, search live Web data via Agent-Reach, and render Generative UI cards.
5. 🛡️ **Step 5: Bullshit Detector** — Fact-check any YouTube video, tweet, or article URL for claim accuracy and get a 0–10 BS hype score.
6. ⛽ **Step 6: Zero-Gas Transactions** — Send free gasless transactions sponsored by EIP-4337 Paymaster and claim testnet coins daily.

---

## 👛 Step 1: Setting Up Your PISO Wallet

### Option A: Connect MetaMask (1-Click Setup)
1. Open [`http://localhost:8085`](http://localhost:8085) in your web browser.
2. Click **🦊 Add to MetaMask** in the top right corner.
3. Approve the network addition dialog in MetaMask. MetaMask will automatically configure Chain ID `2026001` and RPC `http://localhost:8545`.

### Option B: Create a New HD Wallet via PISO CLI
```bash
# Create a new 24-word BIP-39 mnemonic & SLIP-0044 wallet
.venv\Scripts\python.exe cli/piso_cli.py wallet:create --words 24
```
**Sample Output**:
```json
{
  "status": "success",
  "mnemonic": "abandon amount zesty zebra ...",
  "address": "0x1821F246a27287a2187E1D634B8883030fA14731",
  "derivation_path": "m/44'/2026'/0'/0/0"
}
```

---

## ⚡ Step 2: 1-Click 24-Hour Mining Guide (For Beginners)

PISO Chain includes an automated **1-Click 24-Hour Mining Engine** designed for effortless daily coin generation.

### How to Mine:
1. Navigate to the **⛏️ PoW Mining Studio** tab on [`http://localhost:8085`](http://localhost:8085).
2. Click the gold button: **`⛏️ START 24-HOUR MINING SESSION`**.
3. **Mining Active**:
   - A 24-hour countdown clock (`23:59:59`) starts counting down.
   - PISO yield accumulates continuously in real time (`+0.000578 PISO / sec` up to **50.0 PISO**).
   - Your progress is saved automatically in `localStorage`. You can safely close or refresh your browser.
4. **Claiming Daily Rewards**:
   - When the 24-hour timer reaches `00:00:00`, the button changes to:
     **`🎁 CLAIM 50.0 PISO & RESET 24H TIMER`**.
   - Click to claim your 50 PISO coins and reset the timer for the next daily mining cycle!

---

## ⛏️ Step 3: Advanced Proof of Work (PoW) Nonce Solver

For advanced miners and node operators wanting to solve cryptographic block nonces:

### 1. Benchmark Local Hashing Speed
```bash
.venv\Scripts\python.exe cli/piso_cli.py pow:benchmark
```

### 2. Mine Proof of Work Solutions
```bash
.venv\Scripts\python.exe cli/piso_cli.py pow:mine --challenge 0x1111111111111111111111111111111111111111111111111111111111111111 --difficulty 8
```

### 3. Run Background Miner Worker
```bash
.venv\Scripts\python.exe scripts/pow_miner.py --difficulty 8
```

---

## 🚰 Step 4: Claiming Free Testnet Coins

Need native PISO coins for gas or contract testing?

1. Scroll to the **🚰 Testnet Faucet** section in the Dashboard.
2. Enter your wallet address (`0x...`).
3. Click **🚰 Claim 1 PISO Testnet Coin**.
4. 1 PISO coin will be transferred directly to your address (24-hour cooldown per address).

---

## ⛽ Step 5: Sponsoring Gasless Transactions (EIP-4337)

dApp users can send zero-gas transactions sponsored by system paymaster vaults:

1. Scroll to **⛽ Native Gasless Paymaster (EIP-4337)**.
2. Deposit PISO coins into the Paymaster Vault (`PISOPaymaster.sol`).
3. Click **Simulate Sponsored Tx** to execute gasless microtransactions.

---

## 📱 Step 6: Mobile App Installation (Android)

Access PISO Chain on your Android smartphone:

1. Copy the WTA1 import code from `config/piso_chain_wta1_export.txt`.
2. Open **WebToApp** on your Android device.
3. Tap **Import App** and paste the code.
4. Tap **Build APK** to install **PISO Chain Mainnet.apk**!

---

## ❓ Frequently Asked Questions (FAQ)

### Q: Do I need expensive GPU mining rigs for 1-Click Mining?
**No!** The 1-Click 24-Hour Miner runs lightweight background workers directly inside your browser or mobile app.

### Q: What happens if I close my browser during 24-Hour Mining?
Your 24-hour session, elapsed time, and accumulated PISO rewards are persisted automatically in your browser's local storage.

### Q: Where are precompiled system contracts located?
System contracts are deployed on addresses `0x0000000000000000000000000000000000001000` to `1003` (including `PISOValidatorSet`, `PISOSlashIndicator`, `PISOQuantumSecurity`, and `PISOProofOfWork`).
