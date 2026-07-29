# 📜 PISO Chain Whitepaper
### *A High-Performance, Post-Quantum Proof-of-Staked-Authority Layer 1 Blockchain with Native Account Abstraction & Zero-Knowledge Privacy*

> **Version 1.0.0 | July 2026**  
> **Authors**: PISO Chain Core Protocol Engineers & Advisory Board ([`314-hash/piso-chain`](https://github.com/314-hash/piso-chain))  
> **Official Website**: [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/)  
> **Public RPC**: `https://piso-rpc-dev.loca.lt` | `http://localhost:8545`  

---

## 📌 Abstract

As distributed ledger technology transitions from experimental adoption to mission-critical enterprise financial infrastructure, traditional Layer 1 networks face fundamental challenges: escalating gas fees, slow transaction finality, vulnerable key management paradigms, and impending cryptographic obsolescence driven by quantum computing. 

**PISO Chain** addresses these systemic limitations by introducing an enterprise-grade, EVM-compatible Layer 1 blockchain powered by **BSC Parlia Proof-of-Staked-Authority (PoSA)** consensus. Engineered for **3.0-second block finality**, near-zero transaction overhead, and **100 Billion $PISO** genesis economic capacity, PISO Chain natively integrates three core breakthroughs:

1. **NIST FIPS 204 Post-Quantum Cryptography (PQC)**: On-chain lattice-based (ML-DSA / Dilithium) and Winternitz (W-OTS+) cryptographic key vaults ([`PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol) at `0x...1002`) protecting user assets against quantum decryption vectors.
2. **Native EIP-4337 Account Abstraction**: On-chain Paymaster liquidity pools ([`PISOPaymaster.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOPaymaster.sol)) enabling gasless user onboarding and automated transaction sponsorship.
3. **Zero-Knowledge Privacy Social Recovery**: Zero-Knowledge Merkle proof verification ([`PISOZKRecovery.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOZKRecovery.sol)) allowing guardian wallet recovery without exposing guardian identities on-chain.

This whitepaper details the mathematical, architectural, economic, and security foundations of the PISO Chain protocol.

---

## 🏛️ 1. Introduction & Market Imperatives

### 1.1 The Blockchain Trilemma & Enterprise Requirements
Enterprise financial applications require deterministic low latency, predictable operational costs, and robust consensus security. PoW networks present unacceptable energy and latency overheads, while uncoordinated PoS networks suffer from long finality windows and MEV exploitation. PISO Chain leverages **Proof-of-Staked-Authority (PoSA)** to combine the high throughput of Proof-of-Authority with the decentralized staker governance of Proof-of-Stake.

### 1.2 The Quantum Cryptographic Threat Horizon
Elliptic Curve Cryptography (ECDSA secp256k1) underpins legacy EVM address generation and digital signature validation. Quantum algorithms—specifically **Shor’s Algorithm**—will break prime factorization and discrete logarithm assumptions, enabling quantum computers to derive private keys directly from public keys exposed on-chain. PISO Chain proactively mitigates this existential risk by embedding **NIST FIPS 204 ML-DSA** signature vaults into its core execution layer.

---

## ⚡ 2. Consensus Mechanism & Network Architecture

### 2.1 BSC Parlia Proof-of-Staked-Authority (PoSA)
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
* **Minimum Validator Stake**: `100,000 PISO`

### 2.2 Slashing & Misdemeanor Defense Matrix
Consensus integrity is enforced on-chain via [`PISOSlashIndicator.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOSlashIndicator.sol) (`0x...1001`):

```
       Slashing Severity & Penalty Escalation Model:
       ┌──────────────────────────────────────────────────────────────┐
       │ ⚠️ Misdemeanor (50 Missed Blocks) -> 24h Jailing & Zero Yield │
       │ 🚨 Felony (150 Missed Blocks)     -> Permanent Expulsion     │
       │ 🔥 Double-Signing Proof            -> 20% Stake Burn + Ejection│
       └──────────────────────────────────────────────────────────────┘
```

1. **Misdemeanors (50 Proposal Misses)**: Automatically removes the validator from the active consensus set for a 24-hour jailing period.
2. **Felonies (150 Proposal Misses)**: Permanently unregisters the validator address and forfeits accrued staking rewards.
3. **Double-Signing Verification**: Submitting cryptographic proof of a validator signing two distinct blocks at the same block height triggers an immediate **20% stake burn** and permanent node ejection.

---

## ⚛️ 3. Post-Quantum Cryptographic (PQC) Security Suite

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

### 3.1 On-Chain PQC Vault Contract ([`PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol))
The system contract at reserved address `0x0000000000000000000000000000000000001002` stores and verifies quantum public key commitments:

$$H_{PQC} = \text{Keccak256}(PK_{ML-DSA} \parallel \text{Salt})$$

When executing high-value operations or account migrations, users provide an ML-DSA proof that evaluates against $H_{PQC}$ on-chain, rendering classical signature forgery mathematically impossible even under quantum attack scenarios.

---

## 💎 4. Tokenomics & Macroeconomic Architecture

### 4.1 Genesis Supply & Token Specifications
The **$PISO** native coin powers consensus staking, gas execution fees, account abstraction paymaster liquidity, and DAO governance.

| Parameter | Value |
| :--- | :--- |
| **Token Symbol** | **$PISO** |
| **Decimals** | `18` |
| **Total Genesis Supply** | `100,000,000,000 PISO` (100 Billion) |
| **Standard** | Native Layer 1 Coin |
| **Genesis Treasury Address** | `0x1821F246a27287a2187E1D634B8883030fA14731` |

### 4.2 Allocation Breakdown

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

| Allocation Category | Supply % | Tokens ($PISO) | Vesting & Lockup Schedule |
| :--- | :---: | :---: | :--- |
| **Validator Staking Rewards** | **40%** | 40,000,000,000 $PISO | Emitted per block over a 10-year decaying inflation curve. |
| **Ecosystem & Developer Grants** | **25%** | 25,000,000,000 $PISO | 6-month cliff, 36-month linear monthly vesting. |
| **Protocol Treasury Reserve** | **15%** | 15,000,000,000 $PISO | Governed exclusively by `PISOGovernor.sol` DAO voting. |
| **Community Faucet & Airdrops** | **10%** | 10,000,000,000 $PISO | Testnet faucet dripping (`PISOFaucet.sol`) and community grants. |
| **Founders & Core Contributors** | **10%** | 10,000,000,000 $PISO | 12-month cliff, 48-month linear monthly vesting. |

### 4.3 Deflationary Burn Mechanics
1. **EIP-1559 Base Fee Burn**: $100\%$ of transaction base fees are permanently destroyed from circulation.
2. **Slashing Penalty Burn**: $20\%$ of slashed validator stakes from double-sign violations are immediately burned.

---

## 📜 5. System Smart Contracts Architecture

PISO Chain reserves the first `0x...1000` to `0x...1002` address space for core system contracts:

```
+-----------------------------------------------------------------------------------+
| Address                                    | Contract Name                        |
+--------------------------------------------+--------------------------------------+
| 0x0000000000000000000000000000000000001000 | PISOValidatorSet.sol                 |
| 0x0000000000000000000000000000000000001001 | PISOSlashIndicator.sol               |
| 0x0000000000000000000000000000000000001002 | PISOQuantumSecurity.sol              |
+--------------------------------------------+--------------------------------------+
```

### Key Contract Suite Overview:
* [`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol): Validator election, staking deposit handling, epoch updates.
* [`PISOSlashIndicator.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOSlashIndicator.sol): Misdemeanor and felony tracking, jailing enforcement.
* [`PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol): NIST FIPS 204 PQC key registry.
* [`PISOFaucet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOFaucet.sol): 1 PISO / 24h developer drip vault.
* [`PISOBridge.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOBridge.sol): Cross-chain asset wrapper and multi-sig relayer vault.
* [`PISOStaking.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOStaking.sol): Liquid delegated staking vault.
* [`PISOGovernor.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOGovernor.sol): DAO governance proposal and voting timelock engine.
* [`PISOPaymaster.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOPaymaster.sol): EIP-4337 Account Abstraction gasless sponsor paymaster.
* [`PISOZKRecovery.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOZKRecovery.sol): ZK Merkle guardian social recovery vault.
* [`PISOAIOracle.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOAIOracle.sol): AI network threat telemetry and gas oracle.

---

## 💻 6. Developer SDK & API Integration

Developer tooling is available via the `@piso-chain/sdk` TypeScript package:

```typescript
import { PISOChainClient } from "@piso-chain/sdk";
import { ethers } from "ethers";

// Connect to PISO Chain RPC
const client = new PISOChainClient({
    rpcUrl: "https://piso-rpc-dev.loca.lt",
    chainId: 2026001
});

// Query Account Balance
const balance = await client.getBalance("0x4C2B0DDA95754015B2DAF8A3302adbcf2fE248dc");
console.log(`Balance: ${balance} PISO`);
```

---

## 🚀 7. Production DevOps & Security Infrastructure

### 7.1 Multi-Cloud Bootnode Topology
Production bootnodes are dispersed across separate cloud providers:
* **Bootnode 1**: AWS `us-east-1` (N. Virginia, USA)
* **Bootnode 2**: Hetzner `fsn1` (Frankfurt, Germany)
* **Bootnode 3**: AWS `ap-northeast-1` (Tokyo, Japan)

### 7.2 Key Isolation & KMS Clef Sidecars
Consensus keys are stored in AWS KMS / GCP Secret Manager and accessed exclusively via Clef hardware sidecars ([`k8s/clef-sidecar.yaml`](file:///c:/Users/janla/extropianjanus/piso-chain/k8s/clef-sidecar.yaml)) inside production Kubernetes StatefulSet clusters.

---

## 📄 8. Conclusion & References

**PISO Chain** provides an enterprise-ready, post-quantum secure, zero-knowledge enabled EVM Layer 1 blockchain network. By uniting BSC Parlia PoSA consensus performance with EIP-4337 Account Abstraction and NIST FIPS 204 cryptography, PISO Chain delivers an ultra-scalable foundation for the next decade of Web3 innovation.

* **GitHub Repository**: [`https://github.com/314-hash/piso-chain`](https://github.com/314-hash/piso-chain)
* **Web Application**: [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/)
* **Public RPC URL**: `https://piso-rpc-dev.loca.lt`
* **License**: MIT Open Source License
