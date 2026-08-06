# 📈 Freqtrade Integration Guide

> **PISO Chain ↔ Freqtrade Algorithmic Trading Bot**  
> Version 1.0.0 | August 2026

Freqtrade is integrated as a **PISO Agent OS autonomous worker** — the trading bot earns `$PISO` token rewards for every verified profitable trade, recorded on-chain via `PISOFreqtradeOracle.sol`.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              PISO Chain (Chain ID 2026001)                    │
│  PISOFreqtradeOracle.sol  — records SHA-256 trade proofs     │
│  PISOProofOfWork.sol      — rewards profitable trades 10 PISO│
└──────────────────┬───────────────────────────────────────────┘
                   │ Web3.py / RPC (port 8545)
┌──────────────────▼───────────────────────────────────────────┐
│          PISO Freqtrade Bridge (bridge/freqtrade_bridge.py)   │
│  - Polls freqtrade REST API every 30s                        │
│  - Computes SHA-256 proof per closed trade                   │
│  - Submits proof on-chain via submitTradeProof()             │
└──────────────────┬───────────────────────────────────────────┘
                   │ REST API (port 8180)
┌──────────────────▼───────────────────────────────────────────┐
│          freqtrade/ (submodule)                               │
│  user_data/strategies/PISOStrategy.py  — EMA+RSI strategy    │
│  user_data/config/piso_config.json    — bot configuration    │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| [`contracts/PISOFreqtradeOracle.sol`](../contracts/PISOFreqtradeOracle.sol) | On-chain proof & reward contract |
| [`bridge/freqtrade_bridge.py`](../bridge/freqtrade_bridge.py) | Python bridge daemon |
| [`jcode/freqtrade_agent.py`](../jcode/freqtrade_agent.py) | jcode AI agent adapter |
| [`freqtrade/user_data/config/piso_config.json`](../freqtrade/user_data/config/piso_config.json) | Bot config (dry-run default) |
| [`freqtrade/user_data/strategies/PISOStrategy.py`](../freqtrade/user_data/strategies/PISOStrategy.py) | EMA+RSI trading strategy |

---

## 🚀 Quick Start

### 1. Install freqtrade dependencies
```bash
cd freqtrade
pip install -e .[all]
```

### 2. Run in dry-run (paper trading, no real money)
```bash
# Option A: via jcode agent
.venv\Scripts\python.exe jcode/freqtrade_agent.py --start-bot --dry-run

# Option B: directly via freqtrade CLI
cd freqtrade
freqtrade trade --config user_data/config/piso_config.json --strategy PISOStrategy

# Option C: via Docker
docker-compose up freqtrade
```

### 3. Start the PISO bridge daemon
```bash
# Dry-run (no on-chain txs)
.venv\Scripts\python.exe bridge/freqtrade_bridge.py --dry-run

# Live mode (requires WORKER_PRIVATE_KEY and FREQTRADE_ORACLE_ADDRESS in .env)
.venv\Scripts\python.exe bridge/freqtrade_bridge.py
```

### 4. View in Dashboard
- Open `http://localhost:8080`
- Click **"📈 Trading Bot (freqtrade)"** in the sidebar

---

## ⚙️ Configuration

Edit `.env` (copy from `.env.example`):

```env
# Freqtrade REST API
FREQTRADE_API_USER=pisobot
FREQTRADE_API_PASSWORD=changeme
FREQTRADE_API_URL=http://localhost:8180

# Exchange (leave blank for dry-run)
EXCHANGE_KEY=
EXCHANGE_SECRET=

# PISO Chain on-chain integration
WORKER_PRIVATE_KEY=0x...           # jcode agent wallet
FREQTRADE_ORACLE_ADDRESS=0x...     # PISOFreqtradeOracle.sol address
```

---

## 📜 PISOStrategy Signal Logic

| Signal | Condition |
|--------|-----------|
| **Entry Long** | EMA9 crosses above EMA21 + RSI 40-70 + Price > EMA50 + MACD histogram > 0 |
| **Exit** | EMA9 crosses below EMA21 OR RSI > 75 |
| **Stop Loss** | -3% |
| **Take Profit** | 8% → 4% → 2% → 1% (tiered ROI) |
| **Trailing Stop** | Activates at +1% profit |

---

## 🔗 On-Chain Proof Flow

```
1. Trade closes (profit > 0.10%)
2. bridge/freqtrade_bridge.py detects via REST API
3. SHA-256 proof computed:
   SHA256(tradeId | workerAddress | strategy | profitBps | closeTimestamp)
4. submitTradeProof() called on PISOFreqtradeOracle.sol
5. TradeVerified event emitted on PISO Chain
6. 10 $PISO reward sent to worker wallet
```

---

## 🐋 Docker

```bash
# Start just freqtrade + bridge
docker-compose up freqtrade freqtrade-bridge

# Or full stack (validator + explorer + freqtrade)
docker-compose up
```

Services:
- `freqtrade` → port `8180` (REST API + Web UI)
- `freqtrade-bridge` → no port (background daemon)

---

## 🔬 Backtesting

```bash
cd freqtrade
freqtrade backtesting \
  --config user_data/config/piso_config.json \
  --strategy PISOStrategy \
  --timerange 20240101-20241231
```

---

## 🔒 Security Notes

> [!WARNING]
> Never commit your `WORKER_PRIVATE_KEY` or `EXCHANGE_SECRET` to Git. They are `.gitignore`d via `.env`.

> [!NOTE]
> The default configuration runs in **dry-run mode** — no real funds are at risk. To enable live trading, set `"dry_run": false` in `piso_config.json` and provide exchange API keys.
