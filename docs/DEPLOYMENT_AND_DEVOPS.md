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

## ☸️ Kubernetes Cloud Production Manifests

PISO Chain includes complete Kubernetes deployment manifests under [`k8s/`](file:///c:/Users/janla/extropianjanus/piso-chain/k8s):

- [`k8s/validator-statefulset.yaml`](file:///c:/Users/janla/extropianjanus/piso-chain/k8s/validator-statefulset.yaml): Multi-validator StatefulSet with NVMe persistent volumes.
- [`k8s/rpc-service.yaml`](file:///c:/Users/janla/extropianjanus/piso-chain/k8s/rpc-service.yaml): ClusterIP RPC service & NGINX Ingress with Let's Encrypt TLS cert-manager.

Deploying to Kubernetes:

```bash
kubectl apply -f k8s/validator-statefulset.yaml
kubectl apply -f k8s/rpc-service.yaml
```

---

## 📊 Monitoring & Telemetry (Prometheus + Grafana)

Prometheus alerting rules are defined in [`monitoring/prometheus-alerts.yaml`](file:///c:/Users/janla/extropianjanus/piso-chain/monitoring/prometheus-alerts.yaml).

1. Enable Geth metrics flag:
   `--metrics --metrics.addr=0.0.0.0 --metrics.port=6060`
2. Key Alerting Rules ([`monitoring/prometheus-alerts.yaml`](file:///c:/Users/janla/extropianjanus/piso-chain/monitoring/prometheus-alerts.yaml)):
   - `ValidatorNodeDown`: Triggers if validator instance is unreachable for >1m.
   - `HighMissedBlockProposals`: Triggers if validator misses proposals (prevents jailing).
   - `BlockProductionStalled`: Triggers if chain head height stops advancing for 30s.
   - `LowP2PPeerCount`: Triggers if node has less than 2 P2P peers connected.
