# 💎 PISO Chain ($PISO) Tokenomics & Economic Security Model

> **Institutional-Grade Economic Architecture, Distribution, Staking Yields, and Deflationary Mechanics**

[![Token: $PISO](https://img.shields.io/badge/Native_Coin-PISO-orange.svg)](TOKENOMICS.md)
[![Total Supply: 100 Billion](https://img.shields.io/badge/Genesis_Supply-100,000,000,000_PISO-blue.svg)](TOKENOMICS.md)
[![Consensus: BSC PoSA](https://img.shields.io/badge/Consensus-PoSA_Staking-emerald.svg)](README.md)

---

## 📌 Executive Summary

The **$PISO** native coin powers all consensus security, transaction execution fuel, account abstraction paymaster liquidity, and on-chain DAO governance across the **PISO Chain Layer 1 network**. 

Designed with long-term economic sustainability in mind, PISO Chain combines a **PoSA validator staking model**, **EIP-1559 base-fee burn mechanics**, **slashing penalty burns**, and **structured 4-year team/grant vesting cliffs** to align incentives between node operators, dApp developers, institutional stakers, and community token holders.

---

## 🪙 1. Native Token Specifications

| Parameter | Specification |
| :--- | :--- |
| **Token Name** | PISO Chain Native Coin |
| **Ticker Symbol** | **$PISO** |
| **Decimals** | `18` |
| **Genesis Initial Supply** | `100,000,000,000 PISO` (100 Billion) |
| **Network Standard** | Native Layer 1 EVM Coin |
| **Min Validator Stake** | `100,000 PISO` ([`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol)) |
| **Testnet Faucet Allocation** | `1 PISO` / 24 hours per user ([`PISOFaucet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOFaucet.sol)) |

---

## 📊 2. Token Allocation & Distribution Breakdown

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

| Allocation Category | % of Supply | Token Amount | Lockup & Vesting Schedule |
| :--- | :---: | :---: | :--- |
| **Validator Staking Rewards** | **40%** | 40,000,000,000 $PISO | Emitted per block over a 10-year decaying curve. |
| **Ecosystem & Developer Grants** | **25%** | 25,000,000,000 $PISO | 6-month cliff, followed by 36-month linear monthly vesting. |
| **Protocol Treasury Reserve** | **15%** | 15,000,000,000 $PISO | Unlocked at TGE, governed exclusively by [`PISOGovernor.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOGovernor.sol). |
| **Community Airdrop & Faucet** | **10%** | 10,000,000,000 $PISO | 20% unlocked at TGE, 80% distributed via testnet/faucet over 24 months. |
| **Founders & Core Team** | **10%** | 10,000,000,000 $PISO | **12-month 0% cliff**, followed by 36-month linear monthly vesting. |

---

## ⚡ 3. Utility & Core Value Drivers

```
                                  +---------------------------------------+
                                  |         $PISO TOKEN UTILITY           |
                                  +-------------------+-------------------+
                                                      |
         +------------------------+-------------------+-----------------------+------------------------+
         |                        |                   |                       |                        |
         v                        v                   v                       v                        v
+------------------+    +-------------------+ +---------------+     +-------------------+    +-------------------+
|  PoSA Consensus  |    |  EVM Gas Fuel &   | | EIP-4337      |     |  On-Chain DAO     |    |  Cross-Chain      |
|  Staking Bond    |    |  State Execution  | | Paymaster Liqu. |     |  Governance Vote  |    |  Bridge Collateral|
+------------------+    +-------------------+ +---------------+     +-------------------+    +-------------------+
```

### 1. PoSA Consensus Staking & Security
Nodes must bond a minimum of **100,000 $PISO** into [`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol) to compete for inclusion in the active consensus set. Stakers earn block transaction gas fees and staking inflation rewards.

### 2. EVM Transaction Gas Execution
All EVM transactions, smart contract executions, and state modifications require $PISO for gas payment. A portion of the base gas fee is permanently burned via EIP-1559 mechanics.

### 3. Native Account Abstraction (EIP-4337) Paymaster Liquidity
$PISO is deposited into [`PISOPaymaster.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOPaymaster.sol) to sponsor zero-gas dApp user operations, enabling gasless consumer UX.

### 4. On-Chain Governance Voting
1 $PISO = 1 Vote in [`PISOGovernor.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOGovernor.sol). Token holders vote on protocol parameter tweaks, validator capacity expansion, and treasury disbursements.

### 5. Slashing Collateral Protection
Malicious validators who attempt double-signing have **20% of their total bonded $PISO burned on-chain** via [`PISOSlashIndicator.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOSlashIndicator.sol), protecting the network against attacks.

---

## 📉 4. Emission Schedule & Deflationary Mechanics

### Emission Schedule (10-Year Curve)
To incentivize early validator operators, staking emission starts at 5.0% annual inflation in Year 1 and reduces by 15% annually until reaching a perpetual tail inflation of 1.5%.

```
       Annual Staking Emission Curve:
       Year 1 : 5.00%  (5,000,000,000 PISO)
       Year 2 : 4.25%  (4,250,000,000 PISO)
       Year 3 : 3.61%  (3,610,000,000 PISO)
       Year 5 : 2.60%  (2,600,000,000 PISO)
       Year 10: 1.50%  (Perpetual Tail Floor)
```

### Dual Deflationary Drivers
1. **EIP-1559 Fee Burn**: 50% of every transaction base fee is sent to a blackhole burn address (`0x0000000000000000000000000000000000000000`). When transaction volume surpasses 2,000 TPS, net token supply becomes net-deflationary.
2. **Slashing Penalty Burn**: 20% of slashed validator bonds are permanently destroyed upon double-signing verification.

---

## 📅 5. Vesting Timeline & Circulating Supply Schedule

```
+-----------------------------------------------------------------------------------------+
|                              CIRCULATING SUPPLY HORIZON                                 |
+-------------------+--------------------+--------------------+---------------------------+
| TGE (Month 0)     | Month 12           | Month 24           | Month 48 (Fully Vested)   |
| 17B PISO (17%)    | 31B PISO (31%)     | 65B PISO (65%)     | 100B PISO (100%)          |
+-------------------+--------------------+--------------------+---------------------------+
```

| Timeline Milestone | Circulating Supply | Unlocked Allocation Categories |
| :--- | :---: | :--- |
| **Month 0 (TGE)** | **17,000,000,000 PISO (17%)** | Treasury Reserve (15B) + Airdrop TGE Unlocks (2B). |
| **Month 6** | **21,000,000,000 PISO (21%)** | Treasury + Airdrop + Grant Monthly Vesting Starts. |
| **Month 12** | **31,000,000,000 PISO (31%)** | **Founder/Team 12-Month Cliff Ends** -> Monthly Linear Vesting Begins. |
| **Month 24** | **65,000,000,000 PISO (65%)** | Team Vesting (50%) + Grants (50%) + Staking Rewards. |
| **Month 48** | **100,000,000,000 PISO (100%)**| **100% Fully Vested Circulating Supply**. |

---

## 💰 6. Validator Staking Yield (APR) Projection

Expected annual staking yield for validator node operators based on total network staking ratio:

$$\text{Estimated Staking APR} = \frac{\text{Annual Inflation Rewards} + \text{Annual Transaction Fees}}{\text{Total Staked \$PISO}}$$

| Network Staking Ratio (% of Total Supply Staked) | Total Staked $PISO | Projected Staking APR (Year 1) |
| :---: | :---: | :---: |
| **15% (Low Staking Ratio)** | 15,000,000,000 PISO | **33.3% APR** |
| **30% (Target Staking Ratio)** | 30,000,000,000 PISO | **16.6% APR** |
| **50% (High Staking Ratio)** | 50,000,000,000 PISO | **10.0% APR** |

---

*PISO Chain Tokenomics — Securing High-Throughput Layer 1 Execution with Sustainable Economic Alignment.*
