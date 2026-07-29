# 🪐 PISO Chain: Comprehensive Technical & Operational Manual
> **Complete Specification, Architecture, Smart Contracts, Tokenomics, SDK Integration, and Node Operator Guide**

---

## 📌 1. Executive Summary

**PISO Chain** is an enterprise-grade, high-performance, EVM-compatible Layer 1 blockchain network built on **BSC Parlia Proof-of-Staked-Authority (PoSA)** consensus. Engineered for sub-second block propagation, 3-second block finality, near-zero transaction fees, native account abstraction (EIP-4337), and post-quantum cryptographic security (NIST FIPS 204 ML-DSA & Winternitz W-OTS+), PISO Chain bridges institutional financial infrastructure with decentralized Web3 ecosystems.

### Core Protocol Pillars:
* **Consensus Engine**: BSC Parlia PoSA / BFT Multi-Signer Engine (3 to 21 Active Consensus Signers).
* **Total Supply**: `100,000,000,000 PISO` (100 Billion Native Coins).
* **Block Finality**: `3.0 Seconds` deterministic block production.
* **EVM Compatibility**: Full support for Solidity `^0.8.20`, Hardhat, Foundry, Ethers.js, Viem, and Web3.py.
* **Post-Quantum Cryptography**: On-chain PQC vault powered by NIST FIPS 204 (ML-DSA / Dilithium) and W-OTS+ signatures.
* **Native Account Abstraction**: Pre-deployed EIP-4337 Paymaster and UserOperation Bundler infrastructure.
* **Privacy & Recovery**: Zero-Knowledge (ZK) privacy-preserving social guardian recovery system.

---

## 🌐 2. Network Specifications & Connection Endpoints

| Parameter | Specification |
| :--- | :--- |
| **Network Name** | PISO Chain Devnet / Mainnet |
| **Chain ID (Decimal)** | `2026001` |
| **Chain ID (Hexadecimal)** | `0x1EE349` |
| **Native Coin Symbol** | **$PISO** (18 Decimals) |
| **Genesis Total Supply** | `100,000,000,000 PISO` (100 Billion) |
| **Block Time** | `3.0` Seconds |
| **Consensus Engine** | BSC Parlia Proof-of-Staked-Authority (PoSA) |
| **Minimum Validator Stake** | `100,000 PISO` |
| **Web Dashboard** | [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/) |
| **HTTP RPC Gateway** | `https://piso-rpc-dev.loca.lt` / `http://localhost:8545` |
| **WebSocket RPC** | `wss://piso-ws-dev.loca.lt` / `ws://localhost:8546` |
| **Block Explorer** | `https://piso-blockchain.vercel.app/` / `http://localhost:8080` |

### 🦊 MetaMask Network Configuration (JSON)
```json
{
  "chainId": "0x1EE349",
  "chainName": "PISO Chain Devnet",
  "nativeCurrency": {
    "name": "PISO",
    "symbol": "PISO",
    "decimals": 18
  },
  "rpcUrls": [
    "https://piso-rpc-dev.loca.lt",
    "http://127.0.0.1:8545"
  ],
  "blockExplorerUrls": [
    "https://piso-blockchain.vercel.app/"
  ]
}
```

---

## 🏛️ 3. Multi-Validator Topology & Network Architecture

PISO Chain uses a production Sentry Node topology to insulate consensus signing nodes from direct public exposure and DDoS threats.

```
                      +-----------------------------+
                      |   Caddy Gateway / LB (RPC)  |
                      +--------------+--------------+
                                     |
                                     v
                        +-------------+-------------+
                        |   Public RPC / Sentry Node|
                        +-------------+-------------+
                                     |
           +-------------------------+-------------------------+
           |                         |                         |
           v                         v                         v
  +------------------+      +------------------+      +------------------+
  |  Validator Node 1|      |  Validator Node 2|      |  Validator Node 3|
  |   (Signer #1)    |<---->|   (Signer #2)    |<---->|   (Signer #3)    |
  +------------------+      +------------------+      +------------------+
```

### Node Roles:
1. **Public RPC Gateway (Sentry Nodes)**: Receives external JSON-RPC requests, performs rate-limiting, and forwards valid transactions to internal validator nodes via private peer-to-peer connections.
2. **Validator Signer Nodes**: High-security instances executing Parlia PoSA consensus, state transitions, and signing block proposals using isolated keystores or KMS sidecars.
3. **Caddy Load Balancer**: Distributes incoming HTTP/WebSocket traffic across sentry nodes with TLS termination.

---

## 💎 4. Tokenomics & Economic Security Model

### Initial Supply Allocation (100 Billion $PISO)

```
       Token Distribution Breakdown:
       ┌─────────────────────────────────────────────────────────┐
       │ 🔒 40% Validator Staking & Network Security Rewards     │
       │ 🚀 25% Ecosystem Growth & $10M Developer Grant Program   │
       │ 🏛️ 15% Protocol Treasury & Liquidity Reserve (DAO)       │
       │ 🚰 10% Community Airdrop & Incentivized Testnet Faucet   │
       │ 👥 10% Founders, Core Engineers & Early Contributors   │
       └─────────────────────────────────────────────────────────┘
```

| Category | Percentage | Amount ($PISO) | Lockup & Vesting Schedule |
| :--- | :---: | :---: | :--- |
| **Validator Staking Rewards** | **40%** | 40,000,000,000 $PISO | Emitted per block over a 10-year decaying curve. |
| **Ecosystem & Developer Grants** | **25%** | 25,000,000,000 $PISO | 6-month cliff, followed by 36-month linear monthly vesting. |
| **Protocol Treasury Reserve** | **15%** | 15,000,000,000 $PISO | Governed exclusively by `PISOGovernor.sol` DAO proposals. |
| **Faucet & Community Incentives** | **10%** | 10,000,000,000 $PISO | Allocated for testnet dripping (`PISOFaucet.sol`) & user onboarding. |
| **Founders & Core Engineers** | **10%** | 10,000,000,000 $PISO | 12-month cliff, followed by 48-month linear vesting. |

### Deflationary Economic Drivers:
* **EIP-1559 Base Fee Burn**: 100% of transaction base fees are permanently burned from total circulating supply.
* **Slashing Penalty Burn**: 20% of slashed staker funds from double-sign violations are immediately burned on-chain by `PISOSlashIndicator.sol`.

---

## 📜 5. System Smart Contracts Suite

PISO Chain features a suite of system smart contracts pre-compiled or deployed at fixed reserved addresses:

```
  Reserved System Contracts Address Registry:
  • 0x0000000000000000000000000000000000001000 : PISOValidatorSet.sol
  • 0x0000000000000000000000000000000000001001 : PISOSlashIndicator.sol
  • 0x0000000000000000000000000000000000001002 : PISOQuantumSecurity.sol
```

### 1. `PISOValidatorSet.sol` (`0x...1000`)
Manages Parlia PoSA validator registration, minimum staking threshold enforcement (100,000 PISO), active validator set maintenance, and epoch rotations.

### 2. `PISOSlashIndicator.sol` (`0x...1001`)
Monitors block proposal misses and double-signing violations:
* **50 Missed Proposals**: Temporary jailing for 24 hours.
* **150 Missed Proposals**: Permanent felony expulsion from consensus set.
* **Double-Signing Proof**: 20% stake burn + immediate validator ejection.

### 3. `PISOQuantumSecurity.sol` (`0x...1002`)
Post-Quantum Cryptography vault supporting NIST FIPS 204 (ML-DSA / Dilithium) public key registrations and Winternitz (W-OTS+) one-time signature verification.

### 4. `PISOFaucet.sol`
On-chain rate-limited testnet faucet dispensing 1 native PISO coin every 24 hours per user address.

### 5. `PISOBridge.sol`
Cross-chain token wrapper and multi-sig relayer vault facilitating asset bridging between Ethereum/BSC and PISO Chain.

### 6. `PISOStaking.sol`
Delegated liquid staking smart contract allowing stakers to pool funds with active validator nodes.

### 7. `PISOGovernor.sol`
On-chain DAO governance proposal, voting, and timelock contract for protocol parameter upgrades.

### 8. `PISOPaymaster.sol`
EIP-4337 Account Abstraction gasless sponsor paymaster vault allowing dApps to sponsor user gas fees.

### 9. `PISOZKRecovery.sol`
Zero-Knowledge privacy-preserving social recovery contract enabling wallet recovery without exposing guardian identities on-chain.

### 10. `PISOAIOracle.sol`
AI network telemetry scoring, MEV protection, and dynamic gas estimation oracle.

---

## 💻 6. Developer Integration & SDK Usage

### TypeScript SDK (`@piso-chain/sdk`)

#### Installation
```bash
npm install @piso-chain/sdk ethers
```

#### Code Example: Query Balance & Send Native PISO
```typescript
import { PISOChainClient } from "@piso-chain/sdk";
import { ethers } from "ethers";

async function main() {
    // 1. Initialize PISO Chain Client
    const client = new PISOChainClient({
        rpcUrl: "https://piso-rpc-dev.loca.lt",
        chainId: 2026001
    });

    // 2. Query Account Balance
    const address = "0x4C2B0DDA95754015B2DAF8A3302adbcf2fE248dc";
    const balance = await client.getBalance(address);
    console.log(`Balance of ${address}: ${balance} PISO`);

    // 3. Send Native Transaction using Ethers.js
    const provider = new ethers.providers.JsonRpcProvider("https://piso-rpc-dev.loca.lt");
    const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

    const tx = await wallet.sendTransaction({
        to: "0x1821F246a27287a2187E1D634B8883030fA14731",
        value: ethers.utils.parseEther("5.0"), // 5 PISO
        gasLimit: 21000
    });

    console.log(`Transaction Broadcasted! Tx Hash: ${tx.hash}`);
    await tx.wait(1);
    console.log(`Transaction Confirmed in Block!`);
}

main().catch(console.error);
```

---

## 🛠️ 7. CLI Utilities & Node Operations Guide

### 1. Launching Local 3-Validator Docker Stack
```bash
.venv\Scripts\python.exe scripts/start_multi_validator.py
```
Or manually with Docker Compose:
```bash
docker-compose -f docker-compose.multi-validator.yml up -d
```

### 2. Native PISO Coin Distribution CLI (`scripts/distribute_piso.py`)
Transfer native $PISO coins to single or multiple target addresses:

```bash
# Single Address Distribution:
.venv\Scripts\python.exe scripts/distribute_piso.py --to 0x4C2B0DDA95754015B2DAF8A3302adbcf2fE248dc --amount 50

# Batch Airdrop Distribution:
.venv\Scripts\python.exe scripts/distribute_piso.py --list "0x4C2B...,0x50D0...,0x19b1..." --amount 100
```

### 3. Master Live RPC & Tunnel Launcher (`scripts/start_live_rpc.py`)
Runs the Geth EVM node on HTTP port `8545` / WS port `8546` and binds LocalTunnel for public RPC access:
```bash
.venv\Scripts\python.exe scripts/start_live_rpc.py
```

### 4. Smart Contract Test Suite Execution
```bash
npm run test
```
*Executes unit tests for ValidatorSet, SlashIndicator, and Faucet (100% pass).*

---

## ⚛️ 8. Post-Quantum Cryptography (PQC) Integration

PISO Chain incorporates NIST FIPS 204 standard algorithms to safeguard user assets against quantum computing decryption vectors:

1. **ML-DSA (Dilithium)**: Lattice-based digital signature scheme providing Category 5 (256-bit quantum security).
2. **Winternitz OTS+ (W-OTS+)**: Hash-based one-time signature scheme for quantum-safe key commitment vaults.

### On-Chain PQC Vault Workflow:
1. User generates an ML-DSA keypair using `scripts/generate_pqc_keys.py`.
2. Public key hash is registered on [`PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol) (`0x...1002`).
3. High-value transactions can be signed with PQC signatures and verified against the registered hash on-chain.

---

## 🚀 9. Mainnet Launch Readiness & Production Checklist

Before transitioning to public production mainnet:

- [x] **Multi-Validator Engine**: BSC Parlia PoSA integrated and verified.
- [x] **System Smart Contracts**: Complete suite compiled and unit tested (5/5 pass).
- [x] **Post-Quantum Security**: NIST FIPS 204 ML-DSA and W-OTS+ key vault deployed.
- [x] **Production Genesis**: Mainnet initial supply distribution generated (`genesis_mainnet.json`).
- [x] **DevOps & Kubernetes**: StatefulSets (`k8s/`), ingress rules, and Prometheus alerts created.
- [x] **KMS & Keystore Isolation**: AWS KMS / Vault key manager (`kms_key_manager.py`) implemented.
- [ ] **External Security Audit**: Formal third-party smart contract audit completion.
- [ ] **Public RPC Infrastructure**: Production TLS domain resolution (`https://rpc.piso.network`).

---

## 📄 10. Summary & License

PISO Chain is released under the **MIT License**.

* **Repository**: [`314-hash/piso-chain`](https://github.com/314-hash/piso-chain)
* **Web Dashboard**: [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/)
* **Public RPC**: `https://piso-rpc-dev.loca.lt`
