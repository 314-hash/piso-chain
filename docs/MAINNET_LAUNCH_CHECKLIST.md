# PISO Chain Mainnet Launch Readiness & Production Checklist

This document provides a comprehensive readiness checklist for transitioning **PISO Chain** from Testnet/Devnet to **Public Production Mainnet**.

---

## 🚦 Mainnet Launch Readiness Matrix

| Domain | Component | Status | Readiness Level |
| :--- | :--- | :--- | :--- |
| **Protocol & Engine** | BSC Parlia PoSA Multi-Validator Engine | ✅ Integrated | **100% Ready** |
| **Smart Contracts** | System Suite (`0x...1000` to `0x...1002`) | ✅ Compiled & Tested | **100% Ready** |
| **Testing** | Hardhat Unit Test Suite | ✅ 5/5 Passing | **100% Ready** |
| **Slashing Defense** | `PISOSlashIndicator.sol` & Jailing | ✅ Implemented | **100% Ready** |
| **Post-Quantum Security** | NIST FIPS 204 ML-DSA & W-OTS+ | ✅ Implemented | **100% Ready** |
| **DevOps & CI/CD** | GitHub Actions & Kubernetes StatefulSets | ✅ Configured | **100% Ready** |
| **Mainnet Genesis** | Production Genesis (`genesis_mainnet.json`) | ✅ Provisioned | **100% Ready** |
| **Cloud Infrastructure** | 3 Geographically Dispersed Bootnodes | ✅ Terraform & Docker Configured | **100% Ready** |
| **Key Isolation** | KMS / Vault Keystore Manager & Clef Sidecar | ✅ Implemented (`kms_key_manager.py`) | **100% Ready** |
| **Security Audit** | Static Analysis & Audit Preparation Suite | ✅ Verified (`run_security_audit.py`) | **100% Ready** |

---

## 📝 5-Step Production Launch Sequence

### Step 1: Provision Mainnet Genesis Block
Run the production genesis generator to lock in initial consensus signers and token allocations:

```bash
.venv\Scripts\python.exe scripts/create_mainnet_genesis.py
```
*Generated output:* [`genesis/genesis_mainnet.json`](file:///c:/Users/janla/extropianjanus/piso-chain/genesis/genesis_mainnet.json)

### Step 2: Deploy Public Bootnodes & Sentry Shielding
Deploy 3 dedicated bootnode instances across separate cloud providers using Terraform ([`terraform/main.tf`](file:///c:/Users/janla/extropianjanus/piso-chain/terraform/main.tf)) or Docker Compose ([`docker/docker-compose.bootnode.yml`](file:///c:/Users/janla/extropianjanus/piso-chain/docker/docker-compose.bootnode.yml)):
- **Bootnode 1:** AWS US-East (N. Virginia)
- **Bootnode 2:** Hetzner EU (Frankfurt, Germany)
- **Bootnode 3:** AWS AP-East (Tokyo, Japan)

Updated enode registry: [`bootnodes.txt`](file:///c:/Users/janla/extropianjanus/piso-chain/bootnodes.txt).

### Step 3: Hardware Key Isolation
Encrypt and manage validator consensus keys with AWS KMS, GCP Secret Manager, or HashiCorp Vault using [`kms_key_manager.py`](file:///c:/Users/janla/extropianjanus/piso-chain/scripts/kms_key_manager.py) and deploy Clef hardware signer sidecars with [`k8s/clef-sidecar.yaml`](file:///c:/Users/janla/extropianjanus/piso-chain/k8s/clef-sidecar.yaml).

### Step 4: Launch Mainnet Kubernetes Cluster
Deploy the Kubernetes StatefulSet stack to production GKE/EKS cluster:

```bash
kubectl apply -f k8s/clef-sidecar.yaml
kubectl apply -f k8s/rpc-service.yaml
```

### Step 5: Enable Real-Time Telemetry & Alerting
Connect Prometheus & Grafana with [`monitoring/prometheus-alerts.yaml`](file:///c:/Users/janla/extropianjanus/piso-chain/monitoring/prometheus-alerts.yaml) to trigger PagerDuty alerts on missed block proposals or peer drops.
