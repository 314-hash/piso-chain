# 🗺️ GeoLibre GIS & DePIN Spatial Oracle Integration Guide

This document outlines the architecture for integrating **GeoLibre** (open-source lightweight cloud-native GIS platform by `opengeos`: [https://github.com/opengeos/GeoLibre](https://github.com/opengeos/GeoLibre)) into **PISO Chain** for DePIN spatial verification, validator geolocation mapping, and satellite land registry smart contracts.

---

## 🏛️ Architecture Overview

GeoLibre provides browser-native WebAssembly geoprocessing (1,000+ tools), MapLibre GL JS vector rendering, and DuckDB-WASM spatial querying. PISO Chain connects GeoLibre spatial feeds directly to EVM system smart contracts:

```text
┌─────────────────────────────────────────────────────────────┐
│                 GeoLibre GIS Web & MapLibre GL JS           │
│    (Interactive 3D Tiles, Node Latency, Vector Boundaries)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Web3.js / Viem.js RPC)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             PISOValidatorGeoLocation.sol Contract           │
│        (Precompiled Spatial Oracle & DePIN Proof Vault)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                PISO Chain EVM Consensus (3.0s PoSA)         │
│     (Validator Physical Location & Proof of Location)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📜 System Smart Contract: `PISOValidatorGeoLocation.sol`

- **Contract File**: [`contracts/PISOValidatorGeoLocation.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOValidatorGeoLocation.sol)
- **Functions**:
  - `registerGeoNode(int32 lat, int32 lng, string country, string city)`: Registers fixed-point 6 decimal spatial coordinates on-chain.
  - `getValidatorGeo(address validator)`: Returns latitude, longitude, ISO country code, city, and active status.
  - `getAllValidatorsCount()`: Returns total registered DePIN nodes.

---

## 🌐 Web Dashboard GIS Integration

1. **MapLibre GL JS Interactive Globe**:
   - Live interactive vector globe (`#geolibre-map-canvas`) embedded on [`http://localhost:8085`](http://localhost:8085#geolibre).
2. **Active Validator Markers**:
   - Manila, Philippines (`14.5995° N, 120.9842° E`)
   - Singapore (`1.3521° N, 103.8198° E`)
   - Tokyo, Japan (`35.6762° N, 139.6503° E`)
   - London, UK (`51.5074° N, -0.1278° E`)
   - San Francisco, US (`37.7749° N, -122.4194° W`)
3. **DePIN Proof Submission Tool**:
   - Allows validator operators to submit on-chain physical location proofs and fly directly to the newly registered coordinates on the global map.

---

## 🚀 How to Run

1. Open [`http://localhost:8085`](http://localhost:8085) in your web browser.
2. Click **`🗺️ GeoLibre GIS Map`** on the left navigation menu.
3. Explore active validator nodes on the MapLibre map or submit custom coordinates to register a new DePIN node!
