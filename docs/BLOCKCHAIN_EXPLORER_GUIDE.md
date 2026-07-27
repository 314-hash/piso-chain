# PISO Chain Block Explorer Guide (BscScan / Etherscan Open Source Clone)

This guide details how to host, configure, and maintain an enterprise open-source block explorer (Blockscout / Otterscan) for **PISO Chain**.

---

## 🔍 Overview & Open-Source Options

While Etherscan and BscScan are proprietary closed-source applications, **Blockscout** and **Otterscan** are the leading open-source block explorer engines used by Polygon, Base, Arbitrum, Gnosis, and Optimism.

### Comparison

| Feature | Blockscout (Recommended) | Otterscan |
| :--- | :--- | :--- |
| **Backend Stack** | Elixir / Rust / PostgreSQL 15 | Light Client / Direct Node Tracing |
| **Token Tracking** | ERC-20, ERC-721, ERC-1155 | Basic Asset Balances |
| **Contract Verification** | Hardhat, Foundry, Sourcify | Bytecode matching |
| **API Support** | REST, GraphQL, Etherscan Compatible | Standard EVM RPC |

---

## 🛠️ Step 1: Launch Blockscout via Docker Compose

PISO Chain includes Blockscout services in [`docker-compose.multi-validator.yml`](file:///c:/Users/janla/extropianjanus/piso-chain/docker-compose.multi-validator.yml):

```yaml
version: '3.8'

services:
  # 1. Blockscout Database
  blockscout-db:
    image: postgres:15-alpine
    container_name: piso-blockscout-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: blockscout
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: piso_password_123

  # 2. Blockscout Redis
  blockscout-redis:
    image: redis:7-alpine
    container_name: piso-blockscout-redis

  # 3. Blockscout Full Explorer Interface
  explorer:
    image: blockscout/blockscout:latest
    container_name: piso-explorer
    restart: unless-stopped
    ports:
      - "8080:4000"
    environment:
      - ETHEREUM_JSONRPC_VARIANT=geth
      - ETHEREUM_JSONRPC_HTTP_URL=http://validator1:8545
      - ETHEREUM_JSONRPC_WS_URL=ws://validator1:8546
      - DATABASE_URL=postgresql://postgres:piso_password_123@blockscout-db:5432/blockscout
      - REDIS_URL=redis://blockscout-redis:6379/0
      - NETWORK=PISO Multi-Validator Chain
      - SUBNETWORK=PISO
      - CHAIN_ID=2026001
      - COIN=PISO
      - ENABLE_SOURCIFY_INTEGRATION=true
      - SOURCIFY_SERVER_URL=https://sourcify.dev/server
```

Start the containers:

```bash
docker-compose -f docker-compose.multi-validator.yml up -d blockscout-db blockscout-redis explorer
```

Access the UI locally at `http://localhost:8080`.

---

## 🔐 Step 2: Smart Contract Verification Setup

Blockscout supports verifying compiled Solidity code via Sourcify or standard Hardhat verification:

### Verifying Contracts with Hardhat

Add PISO Chain network to `hardhat.config.js`:

```javascript
module.exports = {
  networks: {
    piso: {
      url: "https://piso-rpc-dev.loca.lt",
      chainId: 2026001,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: { piso: "abc" },
    customChains: [
      {
        network: "piso",
        chainId: 2026001,
        urls: {
          apiURL: "http://localhost:8080/api",
          browserURL: "http://localhost:8080"
        }
      }
    ]
  }
};
```

Run verification command:

```bash
npx hardhat verify --network piso 0xYourDeployedContractAddress "ConstructorArgument1"
```

---

## 🌐 Step 3: Public HTTPS Domain Gateway (Caddy)

Configure [`gateway/Caddyfile`](file:///c:/Users/janla/extropianjanus/piso-chain/gateway/Caddyfile) to route `scan.piso.network`:

```caddy
scan.piso.network {
    reverse_proxy explorer:4000
}
```
