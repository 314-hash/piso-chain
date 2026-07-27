# PISO Chain (Layer 1 Blockchain - Multi-Validator Enterprise Edition)

**PISO Chain** is a high-performance EVM-compatible Layer 1 blockchain powered by **BSC Parlia Proof-of-Staked-Authority (PoSA)** consensus, delivering 3-second block times, low-cost gas, enterprise multi-validator Byzantine fault tolerance, and native smart contract staking governance.

---

## Network Parameters

| Parameter | Specification |
| :--- | :--- |
| **Chain Name** | PISO Chain |
| **Web Dashboard** | [`https://piso-blockchain.vercel.app/`](https://piso-blockchain.vercel.app/) |
| **Native Coin** | PISO |
| **Symbol** | PISO |
| **Decimals** | 18 |
| **Chain ID** | `2026001` |
| **Block Time** | 3 Seconds |
| **Consensus Engine** | BSC Parlia PoSA / QBFT Multi-Validator Engine |
| **Validator Capacity**| 3 to 21 Active Consensus Signers |
| **HTTP RPC Port** | `8545` |
| **WebSocket Port** | `8546` |
| **P2P Ports** | `30303` (Val 1), `30304` (Val 2), `30305` (Val 3) |

---

## Multi-Validator Architecture

PISO Chain uses a robust multi-node architecture designed for high availability and DDoS resilience:

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

1. **Signer Consensus Nodes (Validators):** Execute state transitions and generate blocks. They exchange signatures over P2P using Parlia PoSA engine.
2. **Sentry Nodes:** Internet-facing non-validating nodes that shield validator IP addresses from direct DDoS attacks.
3. **On-Chain ValidatorSet Contract (`PISOValidatorSet.sol`):** Manages dynamic validator registration, delegation, block missing count tracking, and automatic jailing/slashing of faulty validators.

---

## Quick Start: Launching Local 3-Validator Cluster

### 1. Provision Keystores & Multi-Validator Genesis

Run the cluster provisioner script to create validator accounts and insert their consensus addresses into the genesis `extraData`:

```bash
python scripts/setup_multi_validator_cluster.py
```

Outputs created:
- `genesis/genesis_multi_validator.json` (Multi-validator Genesis file)
- `docker/data/validator_1/`, `validator_2/`, `validator_3/` (Node data & keystores)

### 2. Launch Multi-Validator Docker Stack

```bash
python scripts/start_multi_validator.py
```

Or manually using Docker Compose:

```bash
docker-compose -f docker-compose.multi-validator.yml up -d
```

---

## Core System Smart Contracts

- [`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol): Handles validator registration, staking, missing block slashing, and unjailing. Deployed at precompiled address `0x0000000000000000000000000000000000001000`.
- [`PISOStaking.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOStaking.sol): Liquid staking and yields for PISO holders.
- [`PISOBridge.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOBridge.sol): Cross-chain asset bridge to Ethereum & BNB Smart Chain.
- [`PISOGovernor.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOGovernor.sol): On-chain DAO governance proposal & voting system.

---

## Directory Structure

```
piso-chain/
├── genesis/
│   ├── genesis_multi_validator.json  # 3-Validator Parlia PoSA genesis config
│   └── config.toml                   # Geth/BSC node engine configuration
├── contracts/                        # System & Governance Smart Contracts
│   ├── PISOValidatorSet.sol          # Dynamic Multi-Validator PoSA engine contract
│   ├── PISOStaking.sol               # Native staking contract
│   ├── PISOBridge.sol                # Relayer & Bridge contract
│   └── PISOGovernor.sol              # On-chain DAO Governance
├── docker/                           # Containerized node data & keystores
├── docker-compose.yml                # Legacy Single-Node launcher
├── docker-compose.multi-validator.yml# Multi-Validator Cluster Compose configuration
├── scripts/
│   ├── setup_multi_validator_cluster.py # Provisions dynamic N-validator genesis & keys
│   ├── start_multi_validator.py      # Automated cluster orchestrator
│   └── test_rpc.py                   # RPC connectivity & health check tool
└── gateway/                          # Caddy reverse proxy & load balancer
```

---

## Security & Best Practices

1. **Validator Key Isolation:** Store consensus private keys in hardware modules (HSM / AWS KMS) or encrypted keystores with unique vault passwords.
2. **Private Network Peering:** Never expose validator node RPC or SSH ports directly to the internet. Connect validators strictly through Sentry Nodes via WireGuard/VPC Peering.
3. **Slashing Protection:** Run strict missing-block accounting (`PISOValidatorSet.sol`) to automatically jail unresponsive nodes after 50 missed blocks.
