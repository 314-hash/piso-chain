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
| **Cloud Infrastructure** | 3 Geographically Dispersed Bootnodes | ⏳ Pending Deployment | 90% (Action Required) |
| **Security Audit** | Formal Third-Party Audit (CertiK / OpenZeppelin)| ⏳ Recommended | Pre-Launch Task |

---

## 📝 5-Step Production Launch Sequence

### Step 1: Provision Mainnet Genesis Block
Run the production genesis generator to lock in initial consensus signers and token allocations:

```bash
.venv\Scripts\python.exe scripts/create_mainnet_genesis.py
```
*Generated output:* [`genesis/genesis_mainnet.json`](file:///c:/Users/janla/extropianjanus/piso-chain/genesis/genesis_mainnet.json)

### Step 2: Deploy Public Bootnodes & Sentry Shielding
Deploy 3 dedicated bootnode instances across separate cloud providers:
- **Bootnode 1:** AWS US-East (N. Virginia)
- **Bootnode 2:** Hetzner EU (Falkenstein, Germany)
- **Bootnode 3:** AWS AP-East (Tokyo, Japan)

Update [`bootnodes.txt`](file:///c:/Users/janla/extropianjanus/piso-chain/bootnodes.txt) with public enode URLs.

### Step 3: Hardware Key Isolation
Migrate validator consensus keys from local keystores to Hardware Security Modules (AWS KMS, GCP Secret Manager, or YubiHSM 2).

### Step 4: Launch Mainnet Kubernetes Cluster
Deploy the Kubernetes StatefulSet stack to production GKE/EKS cluster:

```bash
kubectl apply -f k8s/validator-statefulset.yaml
kubectl apply -f k8s/rpc-service.yaml
```

### Step 5: Enable Real-Time Telemetry & Alerting
Connect Prometheus & Grafana with [`monitoring/prometheus-alerts.yaml`](file:///c:/Users/janla/extropianjanus/piso-chain/monitoring/prometheus-alerts.yaml) to trigger PagerDuty alerts on missed block proposals or peer drops.
