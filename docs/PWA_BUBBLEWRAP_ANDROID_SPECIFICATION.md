# 📱 PISO Chain — PWA & Google Chrome Labs Bubblewrap Android Specification

This document details the Progressive Web App (PWA) architecture and **Google Chrome Labs Bubblewrap** Trusted Web Activity (TWA) setup for generating Android `.apk` packages for **PISO Chain**.

---

## 🏛️ Overview & Technology Stack

PISO Chain uses **Google Chrome Labs Bubblewrap** ([`GoogleChromeLabs/bubblewrap`](https://github.com/GoogleChromeLabs/bubblewrap)) to package the Web Dashboard into a native Android application.

- **Web App Manifest**: [`dashboard/manifest.json`](file:///c:/Users/janla/piso-chain/piso-chain/dashboard/manifest.json)
- **Service Worker**: [`dashboard/sw.js`](file:///c:/Users/janla/piso-chain/piso-chain/dashboard/sw.js)
- **Bubblewrap TWA Manifest**: [`web-to-app/twa-manifest.json`](file:///c:/Users/janla/piso-chain/piso-chain/web-to-app/twa-manifest.json)
- **APK Builder Script**: [`scripts/build_bubblewrap_apk.py`](file:///c:/Users/janla/piso-chain/piso-chain/scripts/build_bubblewrap_apk.py)

---

## ⚡ How to Build the Android APK using Bubblewrap

### Step 1: Execute Pre-Flight Builder Script
Run the Python builder script to verify PWA manifest and TWA configurations:

```bash
.venv\Scripts\python.exe scripts/build_bubblewrap_apk.py
```

### Step 2: Initialize & Build via Bubblewrap CLI
Using `npx @bubblewrap/cli`, initialize and build the Android APK:

```bash
# 1. Initialize Bubblewrap project from live PWA manifest
npx -y @bubblewrap/cli init --manifest=https://piso-blockchain.vercel.app/manifest.json

# 2. Build the Android TWA APK package
npx -y @bubblewrap/cli build
```

---

## 📱 Features Enabled in the Android TWA Package

1. **1-Click 24h Browser Mining Session**: Users can run mining cycles directly from their Android home screens.
2. **Offline Caching (`sw.js`)**: Dashboard UI loads instantly even without active internet connection.
3. **Web3 & MetaMask Deep Linking**: Full support for EIP-1193 MetaMask mobile wallet connections.
4. **Push Notifications**: Receive alerts when 24h mining sessions complete or daily rewards are available for claiming.
