# PISO Chain Validator Node Operator Guide

This guide provides step-by-step instructions for node operators to set up, secure, and maintain a consensus validator node on **PISO Chain**.

---

## 📋 Prerequisites & Hardware Requirements

### Minimum Hardware Specs (Devnet / Testnet)
- **CPU:** 4 Cores (x86_64)
- **RAM:** 8 GB
- **Disk:** 100 GB NVMe SSD
- **Bandwidth:** 100 Mbps symmetric

### Recommended Hardware Specs (Mainnet Production)
- **CPU:** 8+ Cores (AMD EPYC / Intel Xeon)
- **RAM:** 32 GB DDR4/DDR5
- **Disk:** 1 TB High-IOPS Enterprise NVMe SSD
- **Bandwidth:** 1 Gbps symmetric unmetered

---

## 🛠️ Step 1: Generating Keystore & Validator Keys

Run the dynamic cluster provisioner script to create your node account and encrypted keystore:

```bash
.venv\Scripts\python.exe scripts/setup_multi_validator_cluster.py
```

Keystores will be generated under:
`docker/data/validator_1/keystore/`

> [!IMPORTANT]
> Keep your password file (`password.txt`) and private keys secret. Never upload keystores to public version control.

---

## 🚀 Step 2: Initializing Geth Data Directory & Genesis

Initialize your node directory with the multi-validator genesis configuration:

```bash
geth --datadir ./docker/data/validator_1/data init genesis/genesis_multi_validator.json
```

---

## 🐳 Step 3: Launching Validator Container via Docker

Spin up your validator node using Docker Compose:

```bash
docker-compose -f docker-compose.multi-validator.yml up -d validator1
```

Verify that block production is running:

```bash
docker logs -f piso-validator-1
```

Look for log entries indicating block proposal signatures:
`Successfully sealed new block number=1249 hash=0x...`

---

## 💰 Step 4: Staking & Joining Active Signer Set

To become an active consensus signer on an existing network:

1. Deposit at least `100,000 PISO` stake into the [`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol) contract deployed at `0x0000000000000000000000000000000000001000`.
2. Call `registerValidator(feeRecipient)` with your payout address.
3. Upon the next epoch transition (`200` blocks), your node will be rotated into the active consensus signer list.

---

## 🚨 Troubleshooting & Node Unjailing

If your validator node misses more than 50 blocks due to network downtime, it will be automatically jailed:

1. Restore node connectivity and ensure blocks are synced to latest height.
2. Call the `unjail()` function on [`PISOValidatorSet.sol`](file:///c:/Users/janla/extropianjanus/piso-chain/contracts/PISOValidatorSet.sol) from your validator address.
