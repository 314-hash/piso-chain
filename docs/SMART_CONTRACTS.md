# PISO Chain Smart Contracts Reference

This document details the complete suite of **19 System Smart Contracts** precompiled and deployed on **PISO Chain Mainnet** (Chain ID `2026001`).

---

## 📜 Master System Contracts Registry

| # | Contract Name | System Address | Source File | Core Protocol Functionality |
| :-: | :--- | :--- | :--- | :--- |
| **1** | `PISOValidatorSet` | `0x0000000000000000000000000000000000001000` | [`contracts/PISOValidatorSet.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOValidatorSet.sol) | PoSA consensus validator registration, 100k PISO min stake, epoch rotation (`200` blocks). |
| **2** | `PISOSlashIndicator` | `0x0000000000000000000000000000000000001001` | [`contracts/PISOSlashIndicator.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOSlashIndicator.sol) | Misdemeanor tracking (50 misses = jailing) & double-signing proof verification (20% burn). |
| **3** | `PISOQuantumSecurity` | `0x0000000000000000000000000000000000001002` | [`contracts/PISOQuantumSecurity.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOQuantumSecurity.sol) | NIST FIPS 204 (ML-DSA / Dilithium) & Winternitz (W-OTS+) Post-Quantum Cryptography vault. |
| **4** | `PISOProofOfWork` | `0x0000000000000000000000000000000000001003` | [`contracts/PISOProofOfWork.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOProofOfWork.sol) | PoW target difficulty nonce verification engine & reward vault (`nonReentrant` defense). |
| **5** | `PISOFaucet` | `0x0000000000000000000000000000000000001004` | [`contracts/PISOFaucet.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOFaucet.sol) | Rate-limited testnet faucet dispensing `1 PISO` per 24 hours. |
| **6** | `PISOStaking` | `0x0000000000000000000000000000000000001005` | [`contracts/PISOStaking.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOStaking.sol) | Native liquid staking delegation protocol earning block transaction fee rewards. |
| **7** | `PISOGovernor` | `0x0000000000000000000000000000000000001006` | [`contracts/PISOGovernor.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOGovernor.sol) | On-chain DAO governance proposal & voting system for protocol parameter upgrades. |
| **8** | `PISOPaymaster` | `0x0000000000000000000000000000000000001007` | [`contracts/PISOPaymaster.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOPaymaster.sol) | Native EIP-4337 Account Abstraction paymaster for sponsoring gasless dApp transactions. |
| **9** | `PISOBridge` | `0x0000000000000000000000000000000000001008` | [`contracts/PISOBridge.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOBridge.sol) | Multi-sig threshold cross-chain bridge relayer for wrapping and transferring PISO assets. |
| **10** | `PISOZKRecovery` | `0x0000000000000000000000000000000000001009` | [`contracts/PISOZKRecovery.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOZKRecovery.sol) | Zero-Knowledge privacy-preserving social guardian wallet recovery via Merkle roots. |
| **11** | `PISOAIOracle` | `0x000000000000000000000000000000000000100A` | [`contracts/PISOAIOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOAIOracle.sol) | Dynamic AI network threat scoring engine and dynamic gas floor adjustment oracle. |
| **12** | `PISOValidatorGeoLocation` | `0x000000000000000000000000000000000000100B` | [`contracts/PISOValidatorGeoLocation.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOValidatorGeoLocation.sol) | DePIN proof-of-physical-location & GeoLibre GIS spatial oracle validator mapping. |
| **13** | `PISOTurboFieldfareAI` | `0x000000000000000000000000000000000000100C` | [`contracts/PISOTurboFieldfareAI.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOTurboFieldfareAI.sol) | On-chain verification vault for Turbo-Fieldfare ultra-low-RAM (~2 GB RAM) AI inference. |
| **14** | `PISOAgentReachOracle` | `0x000000000000000000000000000000000000100D` | [`contracts/PISOAgentReachOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOAgentReachOracle.sol) | Agent-Reach real-time web intelligence, YouTube, RSS, and GitHub oracle proof vault. |
| **15** | `PISOOpenPlanter` | `0x000000000000000000000000000000000000100E` | [`contracts/PISOOpenPlanter.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOOpenPlanter.sol) | OpenPlanter recursive entity resolution & Cytoscape.js knowledge graph evidence vault. |
| **16** | `PISOCopilotKit` | `0x000000000000000000000000000000000000100F` | [`contracts/PISOCopilotKit.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOCopilotKit.sol) | CopilotKit AG-UI protocol, Generative UI, and Human-in-the-Loop signature approval vault. |
| **17** | `PISOBullshitDetector` | `0x0000000000000000000000000000000000001010` | [`contracts/PISOBullshitDetector.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOBullshitDetector.sol) | Bullshit-Detector claim verification, independent web source checking, and 0-10 BS score vault. |
| **18** | `PISOPublicApisOracle` | `0x0000000000000000000000000000000000001011` | [`contracts/PISOPublicApisOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOPublicApisOracle.sol) | Public APIs discovery catalog & cryptographic API query proof vault. |
| **19** | `PISOFreqtradeOracle` | `0x0000000000000000000000000000000000001012` | [`contracts/PISOFreqtradeOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOFreqtradeOracle.sol) | Freqtrade algorithmic trading proof-of-work verification oracle & $PISO rewards. |


---

## 🏛️ Detailed Contract Specifications

### 1. `PISOValidatorSet.sol` (`0x...1000`)
- **Source:** [`contracts/PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol)
- **Description:** Core PoSA consensus contract managing active validator registration, minimum stake requirements (100k PISO), missing proposal count tracking, node jailing, and stake burning.
- **Key Functions**:
  - `getValidators()`: Returns list of active consensus signer addresses.
  - `registerValidator(address feeRecipient)`: Stake native PISO coins to register as a consensus candidate.
  - `reportMissedBlock(address validator)`: Engine call to record missing proposals.
  - `jailValidator(address validator, uint256 duration)`: Jail non-responsive nodes.
  - `unjail()`: Re-enable jailed validator after penalty block height expires.

---

### 2. `PISOSlashIndicator.sol` (`0x...1001`)
- **Source:** [`contracts/PISOSlashIndicator.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOSlashIndicator.sol)
- **Description:** Slashing mechanism tracking misdemeanors (50 missed blocks), felonies (150 missed blocks), and cryptographic double-signing evidence.
- **Key Functions**:
  - `slash(address validator)`: Engine hook called on missed proposal slots.
  - `submitDoubleSignEvidence(address validator, bytes header1, bytes header2)`: Public submission of double-signing proofs. Triggers immediate 20% stake burn.

---

### 3. `PISOQuantumSecurity.sol` (`0x...1002`)
- **Source:** [`contracts/PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol)
- **Description:** NIST FIPS 204 (ML-DSA / Dilithium) and Winternitz (W-OTS+) post-quantum signature verification vault.
- **Key Functions**:
  - `verifyMLDSASignature(bytes32 msgHash, bytes signature, bytes pubKey)`: Validates ML-DSA signatures on-chain.
  - `verifyWinternitzOTS(bytes32 msgHash, bytes signature, bytes pubKey)`: Validates W-OTS+ signatures on-chain.

---

### 4. `PISOFaucet.sol` (`0x...1003`)
- **Source:** [`contracts/PISOFaucet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOFaucet.sol)
- **Description:** On-chain rate-limited faucet dispensing 1 PISO testnet coin every 24 hours.

---

### 5. `PISOStaking.sol` (`0x...1004`)
- **Source:** [`contracts/PISOStaking.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOStaking.sol)
- **Description:** Native liquid staking delegation protocol allowing PISO holders to delegate coins to consensus validators and earn block fee rewards.

---

### 6. `PISOGovernor.sol` (`0x...1005`)
- **Source:** [`contracts/PISOGovernor.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOGovernor.sol)
- **Description:** On-chain DAO governance protocol for proposing, voting on, and executing network parameter upgrades and treasury disbursements.

---

### 7. `PISOPaymaster.sol` (`0x...1006`)
- **Source:** [`contracts/PISOPaymaster.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOPaymaster.sol)
- **Description:** Native EIP-4337 Account Abstraction paymaster allowing dApps to sponsor gasless transactions for end users.

---

### 8. `PISOBridge.sol` (`0x...1007`)
- **Source:** [`contracts/PISOBridge.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOBridge.sol)
- **Description:** Multi-sig cross-chain bridge relayer for wrapping and transferring native PISO assets between PISO Chain, Ethereum, and BNB Smart Chain.

---

### 9. `PISOZKRecovery.sol` (`0x...1008`)
- **Source:** [`contracts/PISOZKRecovery.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOZKRecovery.sol)
- **Description:** Privacy-preserving Zero-Knowledge social recovery contract utilizing Merkle root secret commitments.

---

### 10. `PISOAIOracle.sol` (`0x...1009`)
- **Source:** [`contracts/PISOAIOracle.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOAIOracle.sol)
- **Description:** Dynamic AI network threat scoring engine and dynamic gas floor adjustment oracle.

---

### 11. `PISOAccountRecovery.sol` (`0x...100A`)
- **Source:** [`contracts/PISOAccountRecovery.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOAccountRecovery.sol)
- **Description:** On-chain guardian multi-sig key rotation and smart contract account recovery engine.

---

### 19. `PISOFreqtradeOracle.sol` (`0x...1012`)
- **Source:** [`contracts/PISOFreqtradeOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOFreqtradeOracle.sol)
- **Description:** Algorithmic trading proof verification oracle. Polls Freqtrade REST API sessions, verifies SHA-256 trade work proofs (`submitTradeProof`), checks profit threshold (>0.10% min profit), and rewards authorized worker wallets with 10 PISO tokens per verified profitable trade.
- **Key Functions**:
  - `submitTradeProof(bytes32 sha256Proof, uint256 tradeId, uint256 profitBps, uint256 timestamp)`: Verifies trade proofs on-chain.
  - `verifyProfitThreshold(uint256 profitBps)`: Ensures minimum profit percentage before dispensing rewards.
  - `authorizeWorker(address worker)`: Grants trading bot worker permission to submit work proofs.

