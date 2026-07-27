# PISO Chain Smart Contracts Reference

This document details the system smart contracts and governance suite powering **PISO Chain**.

---

## 📜 Core System & Consensus Contracts

### 1. `PISOValidatorSet.sol`
- **Address:** `0x0000000000000000000000000000000000001000` (Precompiled System Contract)
- **Source:** [`contracts/PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol)
- **Description:** Core PoSA consensus contract managing active validator registration, minimum stake requirements (100k PISO), missing proposal count tracking, node jailing, and stake burning.

#### Key Functions
- `registerValidator(address feeRecipient)`: Stake native PISO coins to register as a consensus candidate.
- `reportMissedBlock(address validator)`: System engine call to record missing proposals.
- `jailValidator(address validator, uint256 duration)`: Jail non-responsive nodes.
- `slashValidatorStake(address validator, uint256 percentage)`: Burn slashed stake for severe infractions.
- `unjail()`: Re-enable jailed validator after penalty block height expires.

---

### 2. `PISOSlashIndicator.sol`
- **Address:** `0x0000000000000000000000000000000000001001` (Precompiled System Contract)
- **Source:** [`contracts/PISOSlashIndicator.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOSlashIndicator.sol)
- **Description:** Slashing mechanism tracking misdemeanors (50 missed blocks), felonies (150 missed blocks), and cryptographic double-signing evidence.

#### Key Functions
- `slash(address validator)`: Engine hook called on missed proposal slots.
- `submitDoubleSignEvidence(address validator, bytes header1, bytes header2)`: Public submission of double-signing proofs. Immediate 20% stake slash.

---

### 3. `PISOStaking.sol`
- **Source:** [`contracts/PISOStaking.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOStaking.sol)
- **Description:** Native liquid staking delegation allowing PISO holders to delegate coins to consensus validators and earn block fee rewards.

---

### 4. `PISOBridge.sol`
- **Source:** [`contracts/PISOBridge.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOBridge.sol)
- **Description:** Multi-sig cross-chain bridge relayer for wrapping and transferring native PISO assets between PISO Chain, Ethereum, and BNB Smart Chain.

---

### 5. `PISOGovernor.sol`
- **Source:** [`contracts/PISOGovernor.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOGovernor.sol)
- **Description:** On-chain DAO governance protocol for proposing, voting on, and executing network parameter upgrades and treasury disbursements.

---

### 6. `PISOPaymaster.sol` (EIP-4337)
- **Source:** [`contracts/PISOPaymaster.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOPaymaster.sol)
- **Description:** Native account abstraction paymaster allowing dApps to sponsor gasless transactions for end users.

---

### 7. `PISOZKRecovery.sol`
- **Source:** [`contracts/PISOZKRecovery.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOZKRecovery.sol)
- **Description:** Privacy-preserving Zero-Knowledge social recovery contract utilizing Merkle root secret commitments.
