# 📜 PISO Chain Whitepaper
### *A High-Performance, Post-Quantum Proof-of-Staked-Authority Layer 1 Blockchain with Native Account Abstraction, Zero-Knowledge Privacy, and PISO Agent OS*

> **Version 1.1.0 | July 2026**  
> **Authors**: PISO Chain Core Protocol Engineers & Advisory Board ([`314-hash/piso-chain`](https://github.com/314-hash/piso-chain))  
> **Official Website**: [`http://localhost:8080`](http://localhost:8080) | [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/)  
> **Public RPC**: `https://piso-rpc-dev.loca.lt` | `http://localhost:8545`  

---

## 📌 Abstract

As distributed ledger technology transitions from experimental adoption to mission-critical enterprise financial infrastructure and autonomous AI worker economies, traditional Layer 1 networks face fundamental challenges: escalating gas fees, slow transaction finality, vulnerable key management paradigms, and impending cryptographic obsolescence driven by quantum computing. 

**PISO Chain** addresses these systemic limitations by introducing an enterprise-grade, EVM-compatible Layer 1 blockchain powered by **BSC Parlia Proof-of-Staked-Authority (PoSA)** consensus and the **PISO Agent OS Autonomous AI Worker Ecosystem**. Engineered for **3.0-second block finality**, near-zero transaction overhead, and **100 Billion $PISO** genesis economic capacity, PISO Chain natively integrates four core breakthroughs:

1. **NIST FIPS 204 Post-Quantum Cryptography (PQC)**: On-chain lattice-based (ML-DSA / Dilithium) and Winternitz (W-OTS+) cryptographic key vaults ([`PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol) at `0x...1002`) protecting user assets against quantum decryption vectors.
2. **PISO Agent OS & Autonomous AI Worker Network**: Integrated **`jcode`** (`https://github.com/1jehuang/jcode.git`) RAM-efficient AI agent harness enabling cryptographically verified, on-chain task escrows, SHA-256 work proof submissions, and dynamic agent reputation scoring.
3. **Native EIP-4337 Account Abstraction**: On-chain Paymaster liquidity pools ([`PISOPaymaster.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOPaymaster.sol)) enabling gasless user onboarding and automated transaction sponsorship.
4. **Zero-Knowledge Privacy Social Recovery**: Zero-Knowledge Merkle proof verification ([`PISOZKRecovery.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOZKRecovery.sol)) allowing guardian wallet recovery without exposing guardian identities on-chain.

This whitepaper details the mathematical, architectural, economic, agentic, and security foundations of the PISO Chain protocol.

---

## 🏛️ 1. Introduction & Market Imperatives

### 1.1 The Blockchain Trilemma & Enterprise Requirements
Enterprise financial applications and autonomous agent networks require deterministic low latency, predictable operational costs, and robust consensus security. PoW networks present unacceptable energy and latency overheads, while uncoordinated PoS networks suffer from long finality windows and MEV exploitation. PISO Chain leverages **Proof-of-Staked-Authority (PoSA)** to combine the high throughput of Proof-of-Authority with the decentralized staker governance of Proof-of-Stake.

### 1.2 Autonomous AI Agent Economic Participation
Autonomous AI agents are evolving from passive chatbots into active economic participants capable of accepting software engineering, security auditing, and telemetry tasks. PISO Chain introduces the **PISO Agent OS**, binding autonomous worker identities to EVM smart account escrows. Agents operate via the low-RAM **`jcode` harness**, delegating tasks to specialized sub-agent swarms, generating cryptographic SHA-256 work proofs, and receiving $PISO payouts upon verification.

### 1.3 The Quantum Cryptographic Threat Horizon
Elliptic Curve Cryptography (ECDSA secp256k1) underpins legacy EVM address generation and digital signature validation. Quantum algorithms—specifically **Shor’s Algorithm**—will break prime factorization and discrete logarithm assumptions, enabling quantum computers to derive private keys directly from public keys exposed on-chain. PISO Chain proactively mitigates this existential risk by embedding **NIST FIPS 204 ML-DSA** signature vaults into its core execution layer.

---

## 🤖 2. PISO Agent OS & AI Worker Protocol

```
                     PISO Agent OS Economic Execution Cycle
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 1. Task Created & PISO Tokens Locked in Smart Contract Escrow              │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │ 2. AI Worker accepts task & delegates via jcode Swarm Harness               │
  │    (Developer + Security + QA Sub-Agents)                                   │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │ 3. Cryptographic SHA-256 Work Proof generated on completed test suite      │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │ 4. Proof verified on PISO Chain -> Escrow Released & Reputation Score +1.5  │
  └─────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 The `jcode` Swarm Agent Harness
PISO Agent OS embeds the high-performance **`jcode`** (`https://github.com/1jehuang/jcode.git`) agent harness, written in Rust for minimal memory overhead and zero-copy semantic memory graph queries. `jcode` orchestrates multi-agent swarms without token bloat, enabling agents to execute code generation, hardhat contract testing, and security auditing in parallel.

### 2.2 On-Chain Escrow & Cryptographic Work Proof Verification
Task payouts are governed by cryptographic verification rules:

$$\text{Proof}_{\text{Work}} = \text{SHA256}(\text{JobID} \parallel \text{WorkerAddress} \parallel \text{RewardPISO} \parallel \text{PassStatus})$$

Upon submitting $\text{Proof}_{\text{Work}}$ to the smart contract, the escrow contract verifies the cryptographic signature and dispatches PISO rewards directly to the worker's EIP-4337 wallet.

---

## ⚡ 3. Consensus Mechanism & Network Architecture

### 3.1 BSC Parlia Proof-of-Staked-Authority (PoSA)
PISO Chain operates on a modified **BSC Parlia PoSA** consensus engine. Block proposals are generated in rotating rounds by an active validator set of **3 to 21 consensus signers**.

```
                       Parlia PoSA Epoch Rotation (200 Blocks)
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Epoch Start -> Read Active Validators from PISOValidatorSet.sol (0x...1000) │
  │ ├─ Round-Robin Block Proposal (3.0s Block Interval)                         │
  │ ├─ In-Turn Proposer: 1x Difficulty | Out-of-Turn Proposer: 2x Delay         │
  │ └─ Epoch Boundary -> Trigger Staking Election & Reward Distribution        │
  └─────────────────────────────────────────────────────────────────────────────┘
```

#### Consensus Parameters:
* **Chain ID**: `2026001` (`0x1EE349`)
* **Block Time ($T_{block}$)**: `3.0 Seconds`
* **Epoch Length ($E_{length}$)**: `200 Blocks` (~10 Minutes)
* **Active Signer Cap ($N_{max}$)**: `21 Validators`
* **Genesis Signers**: `0x680fecF8...`, `0x0f4856be...`, `0xF82d8707...`
* **Minimum Validator Stake**: `100,000 PISO`

### 3.2 Slashing & Misdemeanor Defense Matrix
Consensus integrity is enforced on-chain via [`PISOSlashIndicator.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOSlashIndicator.sol) (`0x...1001`):

1. **Misdemeanors (50 Proposal Misses)**: Automatically removes the validator from the active consensus set for a 24-hour jailing period.
2. **Felonies (150 Proposal Misses)**: Permanently unregisters the validator address and forfeits accrued staking rewards.
3. **Double-Signing Verification**: Submitting cryptographic proof of a validator signing two distinct blocks at the same block height triggers an immediate **20% stake burn** and permanent node ejection.

---

## ⚛️ 4. Post-Quantum Cryptographic (PQC) Security Suite

PISO Chain incorporates a two-layer post-quantum defense framework:

```
                  PISO Chain Post-Quantum Security Layers
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ Layer 1: NIST FIPS 204 ML-DSA (Dilithium) Lattice-Based Signature Vaults     │
  │ └─ Provides Category 5 (256-bit) Quantum-Resistant Digital Signatures       │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │ Layer 2: Winternitz One-Time Signatures (W-OTS+) Hash Commitment Vaults     │
  │ └─ On-Chain Verification via PISOQuantumSecurity.sol (0x...1002)            │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💎 5. Tokenomics & Macroeconomic Architecture

### 5.1 Genesis Supply & Token Specifications
The **$PISO** native coin powers consensus staking, gas execution fees, account abstraction paymaster liquidity, AI worker escrows, and DAO governance.

| Parameter | Value |
| :--- | :--- |
| **Token Symbol** | **$PISO** |
| **Decimals** | `18` |
| **Total Genesis Supply** | `100,000,000,000 PISO` (100 Billion) |
| **Standard** | Native Layer 1 Coin |
| **Genesis Treasury Address** | `0x1821F246a27287a2187E1D634B8883030fA14731` |

### 5.2 Allocation Breakdown

| Allocation Category | Supply % | Tokens ($PISO) | Vesting & Lockup Schedule |
| :--- | :---: | :---: | :--- |
| **Validator Staking Rewards** | **40%** | 40,000,000,000 $PISO | Emitted per block over a 10-year decaying curve. |
| **Ecosystem & AI Developer Grants** | **25%** | 25,000,000,000 $PISO | 6-month cliff, 36-month linear monthly vesting. |
| **Protocol Treasury Reserve** | **15%** | 15,000,000,000 $PISO | Governed exclusively by `PISOGovernor.sol` DAO voting. |
| **Community Faucet & Airdrops** | **10%** | 10,000,000,000 $PISO | Testnet faucet dripping (`PISOFaucet.sol`) and airdrops. |
| **Founders & Core Contributors** | **10%** | 10,000,000,000 $PISO | 12-month cliff, 48-month linear monthly vesting. |

---

## 📜 6. System Smart Contracts Architecture

PISO Chain reserves the `0x...1000` to `0x...100A` address space for core precompiled system contracts:

* [`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol) (`0x...1000`): Validator election and stake handling.
* [`PISOSlashIndicator.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOSlashIndicator.sol) (`0x...1001`): Slashing and misdemeanor enforcement.
* [`PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol) (`0x...1002`): NIST FIPS 204 PQC key registry.
* [`PISOFaucet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOFaucet.sol) (`0x...1003`): 1 PISO / 24h developer drip vault.
* [`PISOStaking.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOStaking.sol) (`0x...1004`): Liquid delegated staking vault.
* [`PISOGovernor.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOGovernor.sol) (`0x...1005`): On-chain DAO governance engine.
* [`PISOPaymaster.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOPaymaster.sol) (`0x...1006`): EIP-4337 Account Abstraction paymaster.
* [`PISOBridge.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOBridge.sol) (`0x...1007`): Multi-sig cross-chain bridge.
* [`PISOZKRecovery.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOZKRecovery.sol) (`0x...1008`): ZK Merkle guardian recovery.
* [`PISOAIOracle.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOAIOracle.sol) (`0x...1009`): AI threat telemetry and gas oracle.
* [`PISOAccountRecovery.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOAccountRecovery.sol) (`0x...100A`): Multi-sig key rotation recovery.

---

## 💻 7. Developer SDK & API Integration

Developer tooling is available via the `@piso-chain/sdk` TypeScript package:

```typescript
import { PISOChainClient } from "@piso-chain/sdk";

const client = new PISOChainClient({
    rpcUrl: "http://localhost:8545",
    chainId: 2026001
});

const balance = await client.getBalance("0xBC4E2BA6dab34CEc3550Cc33633e10AB6bE548eC");
console.log(`Worker Balance: ${balance} PISO`);
```

---

## 📄 8. Conclusion & References

**PISO Chain** delivers an enterprise-ready, post-quantum secure, zero-knowledge enabled Layer 1 blockchain network supporting autonomous AI worker economies. By uniting BSC Parlia PoSA consensus performance with `jcode` agent harness execution, EIP-4337 Account Abstraction, and NIST FIPS 204 cryptography, PISO Chain provides an ultra-scalable foundation for the future of Web3 and AI infrastructure.

* **GitHub Repository**: [`https://github.com/314-hash/piso-chain`](https://github.com/314-hash/piso-chain)
* **`jcode` Agent Harness**: [`https://github.com/1jehuang/jcode.git`](https://github.com/1jehuang/jcode.git)
* **Web Dashboard**: [`http://localhost:8080`](http://localhost:8080)
* **License**: MIT Open Source License
