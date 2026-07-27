# PISO Chain Deployment & DevOps Guide

This document outlines DevOps procedures, containerized multi-validator orchestration, RPC load balancing, and production monitoring for **PISO Chain**.

---

## 🐋 Docker Multi-Validator Cluster Architecture

PISO Chain includes a pre-configured 3-validator cluster specification ([`docker-compose.multi-validator.yml`](file:///c:/Users/janla/extropianjanus/piso-chain/docker-compose.multi-validator.yml)).

```
                       +-----------------------------+
                       |   Caddy Reverse Proxy (80/443)|
                       +--------------+--------------+
                                      |
                                      v
                       +--------------+--------------+
                       |  PISO Validator 1 (HTTP 8545)|
                       +--------------+--------------+
                                      |
            +-------------------------+-------------------------+
            |                         |                         |
            v                         v                         v
   +------------------+      +------------------+      +------------------+
   | piso-validator-1 |      | piso-validator-2 |      | piso-validator-3 |
   |   (Port 30303)   |<---->|   (Port 30304)   |<---->|   (Port 30305)   |
   +------------------+      +------------------+      +------------------+
```

### Quick Commands

```bash
# 1. Provision dynamic genesis and keys
.venv\Scripts\python.exe scripts/setup_multi_validator_cluster.py

# 2. Start multi-validator Docker cluster
.venv\Scripts\python.exe scripts/start_multi_validator.py

# 3. Check cluster logs
docker-compose -f docker-compose.multi-validator.yml logs -f
```

---

## 🔒 Production Security Hardening Checklist

1. **Disable Public RPC on Validator Signers:** Keep RPC ports (`8545`/`8546`) bound to local Docker networks or private VPC interfaces (`127.0.0.1` or internal CIDR).
2. **Sentry Node Isolation:** Public RPC queries and P2P discovery should route exclusively through non-validating sentry nodes.
3. **Firewall Port Matrix:**

| Port | Protocol | Source | Purpose |
| :--- | :--- | :--- | :--- |
| `8545` | TCP | RPC Load Balancer / Internal | JSON-RPC HTTP |
| `8546` | TCP | RPC Load Balancer / Internal | JSON-RPC WebSocket |
| `30303` | TCP/UDP | Public Internet / Sentries | P2P Peer Communication |
| `80 / 443` | TCP | Public Internet | Reverse Proxy Gateway |

---

## 📊 Monitoring & Telemetry (Prometheus + Grafana)

To collect real-time node performance and consensus health:

1. Enable Geth metrics flag in node `config.toml` or launch flags:
   `--metrics --metrics.addr=0.0.0.0 --metrics.port=6060`
2. Configure Prometheus target:
```yaml
scrape_configs:
  - job_name: 'piso_validators'
    static_configs:
      - targets: ['validator1:6060', 'validator2:6060', 'validator3:6060']
```
3. Key Metrics to Alert On:
   - `chain_head_block`: Ensure block height increases every 3s.
   - `p2p_peers`: Alert if active peer count falls below 2.
   - `consensus_missed_proposals`: Alert immediately if any node misses block signing slots.
