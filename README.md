# PISO Chain (Layer 1 Blockchain)

**PISO Chain** is a dedicated EVM-compatible Layer 1 blockchain network utilizing Clique Proof-of-Authority (PoA) consensus for high-speed, low-cost transactions powered by the native **PISO** coin.

---

## Network Parameters

| Parameter | Specification |
| :--- | :--- |
| **Chain Name** | PISO Chain |
| **Native Coin** | PISO |
| **Symbol** | PISO |
| **Decimals** | 18 |
| **Chain ID** | `2026001` |
| **Block Time** | 5 Seconds |
| **Consensus Engine** | Clique PoA (Devnet/Testnet) / QBFT or PoS (Production) |
| **HTTP RPC Port** | `8545` |
| **WebSocket Port** | `8546` |
| **P2P Port** | `30303` |

---

## Directory Structure

```
piso-chain/
├── genesis.json            # Network Genesis configuration
├── bootnodes.txt           # Enode addresses for network bootstrap nodes
├── validators/             # Keyfiles and keystores for validator nodes
├── contracts/              # System & utility smart contracts (Bridge, Staking)
├── explorer/               # Block explorer integration configs
├── rpc/                    # RPC load balancer & proxy setup
├── wallets/                # Web wallet interface configuration
├── bridge/                 # Cross-chain relayer & bridge service
├── docs/                   # Architecture & API documentation
├── docker/                 # Containerized multi-node devnet launcher
└── scripts/                # Helper tools for keys & extraData generation
```

---

## Quick Start (Local Devnet)

### 1. Generate Clique `extraData` for Genesis

To register your validator node's address into `genesis.json`:

```bash
python scripts/generate_extradata.py 0xYOUR_VALIDATOR_ADDRESS
```

Copy the output hex string into the `"extraData"` field in `genesis.json`.

### 2. Initialize Node Data Directory

```bash
geth --datadir ./docker/data/validator1 init genesis.json
```

### 3. Spin Up Validator & RPC via Docker

```bash
cd docker
docker-compose up -d
```

### 4. Connect Wallet (MetaMask)

- **Network Name:** PISO Chain Local
- **New RPC URL:** `http://localhost:8545`
- **Chain ID:** `2026001`
- **Currency Symbol:** `PISO`
- **Block Explorer URL:** `http://localhost:8080`

---

## Production Readiness Checklist

1. **Consensus Upgrade:** Upgrade from Clique PoA to Polygon Edge / QBFT / BSC-style PoS engine for public decentralization.
2. **Bootnodes:** Deploy at least 3 geographically dispersed bootnode instances.
3. **RPC Load Balancing:** Use Nginx / HAProxy in front of multiple read-only RPC nodes.
4. **Explorer:** Deploy Blockscout or Otterscan instance.
5. **Bridge Infrastructure:** Deploy multi-sig relayer nodes for cross-chain wrapping to Ethereum/BNB Chain.
