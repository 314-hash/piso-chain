# PISO Chain Multi-Validator Cluster & Peer Discovery Guide

This guide explains how to set up, launch, and manage the **PISO Chain 3-Validator PoSA Network** locally using **Docker Compose** or in production using **Kubernetes StatefulSets**.

---

## 🏛️ Cluster Topology Overview

```
                      +-----------------------------+
                      |   Caddy / Nginx Gateway     |
                      |   (Port 80 / 443 / 8545)    |
                      +--------------+--------------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
         v                           v                           v
+------------------+       +------------------+       +------------------+
| Validator Node 1 | <---> | Validator Node 2 | <---> | Validator Node 3 |
| (Leader Signer)  |  P2P  | (Peer Signer 2)  |  P2P  | (Peer Signer 3)  |
| Port: 30303      |       | Port: 30304      |       | Port: 30305      |
+--------+---------+       +------------------+       +------------------+
         |
         v
+------------------+       +------------------+
| Blockscout DB    | <---> | Blockscout UI    |
| (PostgreSQL)     |       | (Port 8080)      |
+------------------+       +------------------+
```

---

## 🚀 Option 1: Docker Compose Local Cluster Setup

### Step 1: Provision Keystores & Multi-Validator Genesis
Run the cluster provisioner to generate keypairs and keystores for 3 consensus validators:

```bash
.venv\Scripts\python.exe scripts/setup_multi_validator_cluster.py
```

*Output artifacts:*
- Keystores: `docker/data/validator_1/`, `docker/data/validator_2/`, `docker/data/validator_3/`
- Multi-Validator Genesis: `genesis/genesis_multi_validator.json`
- Cluster Metadata: `genesis/cluster_nodes.json`

### Step 2: Spin Up Containers
Launch the full network including 3 validator nodes, PostgreSQL, Redis, Blockscout Explorer, and Caddy Gateway:

```bash
docker compose -f docker-compose.multi-validator.yml up -d
```

### Step 3: Verify Peer Discovery & Node Status
Check that all 3 nodes are connected and discovering peers:

```bash
# Query Validator 1 Peer Count
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}'
```

---

## ☸️ Option 2: Kubernetes StatefulSet Deployment (Minikube / EKS / GKE)

### Step 1: Create Namespace & Genesis ConfigMap
```bash
kubectl create namespace piso-chain

kubectl create configmap piso-genesis-config \
  --from-file=genesis.json=genesis/genesis_multi_validator.json \
  -n piso-chain
```

### Step 2: Apply Validator StatefulSet & RPC Service
```bash
kubectl apply -f k8s/validator-statefulset.yaml -n piso-chain
kubectl apply -f k8s/rpc-service.yaml -n piso-chain
```

### Step 3: Inspect Pod Logs & Consensus Block Production
```bash
kubectl get pods -n piso-chain
kubectl logs -f piso-validator-0 -n piso-chain
```

---

## 🌐 Public Network Peer Discovery Configuration

To enable public node operators to connect to your cluster:

1. **Extract Enode URIs:**
   ```bash
   curl -X POST http://localhost:8545 \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"admin_nodeInfo","params":[],"id":1}'
   ```
2. **Update Bootnodes:** Add the `enode://` string to `bootnodes.txt` for external node discovery.
