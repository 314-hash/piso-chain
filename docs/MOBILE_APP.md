# PISO Chain Mobile App — WebToApp Build Guide

This document describes how to package and build the **PISO Chain Mainnet Web Dashboard, System Contracts Hub, and Post-Quantum Wallet Studio** into a native Android Application (`org.pisochain.app`) using [WebToApp](https://github.com/shiaho777/web-to-app.git).

---

## Features of PISO Chain Android App

* **Native WebView Performance**: Hardware acceleration, DOM storage, WebGL, and custom status bar styling matching `#0b0e14`.
* **CORS & Web3 RPC Compatibility**: Enabled CORS bypass for JSON-RPC queries to `https://rpc.piso-chain.org` and custom devnet endpoints.
* **GeckoView ECH & Anti-Censorship**: Supports Encrypted Client Hello (ECH) and DNS-over-HTTPS (DoH) via GeckoView kernel for secure network communication.
* **Cold Offline Fallback**: PWA caching and static HTML fallback for cold storage paper wallet generation.
* **Target SDK**: Configured for Android 14 (`targetSdk 34`, `minSdk 24`).

---

## 1-Click Import Instructions (WTA1 Code)

1. Run the WebToApp generator script in the repository:
   ```bash
   python scripts/build_web_to_app.py
   ```
2. Copy the generated `WTA1:` code from `config/piso_chain_wta1_export.txt`.
3. Open the **WebToApp** application on your Android phone or emulator.
4. Tap **Import App** → **Paste WTA1 Code**.
5. Tap **Build APK** / **Export AAB** to generate `PISO Chain Mainnet.apk`!

---

## App Configuration Details

| Parameter | Value |
| :--- | :--- |
| **App Name** | `PISO Chain Mainnet` |
| **Package Name** | `org.pisochain.app` |
| **Target URL** | `https://piso-blockchain.vercel.app` |
| **Version** | `1.1.0` (Code `101`) |
| **Status Bar Color** | `#0b0e14` |
| **Navigation Bar Color** | `#141923` |

---

## Configuration Files

- `config/piso_chain_app_config.json`: Master JSON configuration spec.
- `config/piso_chain_wta1_export.txt`: Base64 gzip import token.
- `scripts/build_web_to_app.py`: Automated token generator.
