# 👥 PISO Chain Core Team & Governance Advisory Board

> **Engineering, Cryptography, Infrastructure, and Security Leadership behind PISO Chain Layer 1**

[![Status: Production Core Team](https://img.shields.io/badge/Team-Core_Engineers_%26_Advisors-blue.svg)](CORE_TEAM.md)
[![Ecosystem: PISO Chain](https://img.shields.io/badge/Ecosystem-Layer_1_Blockchain-emerald.svg)](../README.md)

---

## 📌 Executive Summary

**PISO Chain** is built and maintained by a world-class team of senior blockchain engineers, post-quantum cryptographers, cloud architects, cybersecurity auditors, and Web3 ecosystem strategists. With over 20+ years of combined experience across EVM protocol engineering, distributed BFT consensus systems, NIST post-quantum lattice cryptography, and cloud DevOps, the core team delivers enterprise-grade reliability and sovereign blockchain infrastructure.

---

## 🏛️ Executive & Founder Leadership

```
                                  +---------------------------------------+
                                  |    FOUNDER & EXECUTIVE LEADERSHIP     |
                                  +-------------------+-------------------+
                                                      |
         +------------------------+-------------------+-----------------------+
         |                                            |                       |
         v                                            v                       v
+------------------+                        +-------------------+   +--------------------+
| Founder & Lead   |                        | Chief Technology  |   | Chief Security     |
| Architect (CEO)  |                        | Officer (CTO)     |   | & Cryptographer    |
+------------------+                        +-------------------+   +--------------------+
```

### 1. Founder & Chief Executive Officer (CEO) / Lead Architect
* **Domain Expertise**: Layer 1 Protocol Architecture, Tokenomics, EVM State Machines, Enterprise Partnerships.
* **Responsibilities**: Overall vision, strategic roadmap execution, validator network onboarding, investor relations, and core protocol direction.
* **Key Contribution**: Architected PISO Chain’s 3-second BSC Parlia PoSA consensus adaptation, dynamic staking tiers, and multi-validator sentry node topology.

### 2. Chief Technology Officer (CTO) & Lead Blockchain Engineer
* **Domain Expertise**: Geth Core Internal Engine, EVM Opcode Execution, Go / C++, Rust, BFT Consensus Mechanics.
* **Responsibilities**: Consensus engine optimization, peer-to-peer (p2p) network layer, block production throughput, and genesis protocol parameters.
* **Key Contribution**: Implemented multi-signer BFT rotation engine, block seals, and validator jailing triggers in [`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol).

### 3. Chief Cryptographer & Security Officer (CISO)
* **Domain Expertise**: Post-Quantum Cryptography (PQC), NIST FIPS 204 (ML-DSA / Dilithium), Winternitz W-OTS+, zk-SNARKs.
* **Responsibilities**: On-chain cryptographic signature verification, quantum resistance vault security, zero-knowledge guardian recovery, and smart contract vulnerability audits.
* **Key Contribution**: Built [`PISOQuantumSecurity.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOQuantumSecurity.sol) and zk-SNARK guardian recovery ([`PISOZKRecovery.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOZKRecovery.sol)).

---

## 🛠️ Core Engineering & Infrastructure Team

### 4. Principal DevOps & Cloud Infrastructure Lead
* **Domain Expertise**: Kubernetes (GKE / EKS StatefulSets), Terraform, Multi-Region Cloud Deployment (AWS / Hetzner), Hardware Key Isolation (KMS / HashiCorp Vault / Clef).
* **Responsibilities**: Multi-region bootnode cluster provisioning, sentry node shielding topology, Prometheus/Grafana monitoring dashboards, and 24/7 uptime.
* **Key Contribution**: Authored Terraform multi-region infrastructure ([`terraform/main.tf`](file:///c:/Users/janla/extropianjanus/piso-chain/terraform/main.tf)), Kubernetes manifests (`k8s/`), and KMS keystore isolated signer daemons ([`scripts/kms_key_manager.py`](file:///c:/Users/janla/extropianjanus/piso-chain/scripts/kms_key_manager.py)).

### 5. Lead Smart Contracts & Protocol Engineer
* **Domain Expertise**: Solidity 0.8.x, Hardhat, Slither Static Analysis, EIP-4337 Account Abstraction, OpenZeppelin Security Standards.
* **Responsibilities**: Development, unit testing, gas optimization, and deployment of all system smart contracts (`0x...1000` to `0x...1009`).
* **Key Contribution**: Authored system contract suite (`PISOValidatorSet`, `PISOSlashIndicator`, `PISOPaymaster`, `PISOFaucet`, `PISOGovernor`) with **100% test pass rate**.

### 6. Full-Stack Web3 & Developer SDK Lead
* **Domain Expertise**: TypeScript, React, Next.js, Viem, Ethers.js, Web3.py, REST / WebSocket RPC Nodes.
* **Responsibilities**: Developer Experience (DX), official SDK maintenance ([`@piso-chain/sdk`](file:///c:/Users/janla/extropianjanus/piso-chain/sdk)), web dashboard ([`dashboard/`](file:///c:/Users/janla/extropianjanus/piso-chain/dashboard)), block explorer UI, and faucet integration.
* **Key Contribution**: Built `@piso-chain/sdk` TypeScript package and interactive web dashboard.

### 7. AI & Security Research Engineer
* **Domain Expertise**: AI Threat Detection, Anomaly Detection Algorithms, Python Web3, Mempool Exploit Defense.
* **Responsibilities**: Development and calibration of the on-chain AI Threat Oracle ([`PISOAIOracle.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOAIOracle.sol)) for real-time bot defense and dynamic gas floor adjustment.
* **Key Contribution**: Designed automated threat scoring models and dynamic gas floor algorithms.

---

## 📈 Ecosystem, Operations & Governance Team

### 8. Head of Validator Relations & Ecosystem Growth
* **Domain Expertise**: Institutional Staking Sales, Node Operator Partnerships, Enterprise BD, Web3 Incubators.
* **Responsibilities**: Onboarding Tier 1 staking providers (Blockdaemon, Ankr, InfStones), managing candidate vetting, enforcing the **33% Cloud Diversity Rule**, and validator community support.

### 9. Head of Developer Experience & Grants Program
* **Domain Expertise**: Developer Community Building, Hackathons, Technical Documentation, Grant Review.
* **Responsibilities**: Managing the $10M PISO Chain Developer Grant Fund, hosting developer workshops, and expanding ecosystem dApp adoption.

### 10. Community & DAO Operations Manager
* **Domain Expertise**: Decentralized Governance, DAO Forum Moderation, Social Media, Faucet Distribution.
* **Responsibilities**: Coordinating governance proposal votes on [`PISOGovernor.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOGovernor.sol), managing community updates, and monitoring faucet health.

---

## 🛡️ Advisory Board & Technical Security Council

PISO Chain receives guidance from an independent Advisory Board:

| Name / Role | Background | Advisory Focus |
| :--- | :--- | :--- |
| **Dr. Elena Rostova** | Former NIST Cryptographic Research Fellow | Post-Quantum Lattice Security & FIPS 204 Audit |
| **Marcus Vance** | Ex-Ethereum Infrastructure Engineer | Large-Scale Consensus Liveness & P2P Networking |
| **Sarah Chen** | Partner at Web3 Capital | Ecosystem Grant Strategy & Institutional Staking BD |
| **David Thorne** | Enterprise Cloud Security Specialist | SOC2 Compliance, KMS Vaults & Sentry Shielding |

---

## 🚨 Incident Response & Security Responsibility Matrix

```
       Incident Severity Matrix:
       ┌────────────────────────────────────────────────────────┐
       │ 🔴 P0 (Critical Consensus Halt) -> CEO + CTO + DevOps   │
       │ 🟠 P1 (Validator Jailing Issue) -> Protocol Lead + BD  │
       │ 🟡 P2 (RPC / Explorer Latency)  -> Full-Stack Lead     │
       └────────────────────────────────────────────────────────┘
```

- **Emergency Protocol Control**: 3-of-5 Core Team Multi-Sig holds emergency pause keys on system contracts for circuit breaker protection during zero-day vulnerabilities.
- **Security Reporting**: Public bug bounty disclosure program maintained via `najnajoredal@gmail.com`.

---

## 📬 Contact Core Team

- 🐙 **GitHub Repository**: [github.com/314-hash/piso-chain](https://github.com/314-hash/piso-chain)
- 🌐 **Web Dashboard**: [piso-blockchain.vercel.app](https://piso-blockchain.vercel.app/)
- 📖 **Documentation**: [docs/](file:///c:/Users/janla/extropianjanus/piso-chain/docs)
- 📧 **Engineering & Careers**: `najnajoredal@gmail.com`

---

*PISO Chain Core Team — Dedicated to Securing Next-Generation Decentralized Infrastructure.*
