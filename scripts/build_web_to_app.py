#!/usr/bin/env python3
"""
PISO Chain - WebToApp Android App Package Generator
Converts the PISO Chain Web Dashboard & Wallet Studio configuration into a WebToApp export token (WTA1 format)
and packages the static offline bundle into artifacts/PISO_Chain_Mobile_App_Bundle.zip.
"""

import json
import base64
import gzip
import os
import sys
import zipfile

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
CONFIG_PATH = os.path.join(PROJECT_ROOT, "config", "piso_chain_app_config.json")
OUTPUT_WTA1_PATH = os.path.join(PROJECT_ROOT, "config", "piso_chain_wta1_export.txt")
DASHBOARD_DIR = os.path.join(PROJECT_ROOT, "dashboard")
ARTIFACTS_DIR = os.path.join(PROJECT_ROOT, "artifacts")
BUNDLE_ZIP_PATH = os.path.join(ARTIFACTS_DIR, "PISO_Chain_Mobile_App_Bundle.zip")

def generate_wta1_token(config_dict: dict) -> str:
    """Compresses JSON configuration using gzip and Base64 encodes with WTA1 prefix."""
    json_bytes = json.dumps(config_dict, separators=(',', ':')).encode('utf-8')
    compressed_bytes = gzip.compress(json_bytes)
    b64_str = base64.b64encode(compressed_bytes).decode('utf-8')
    return f"WTA1:{b64_str}"

def package_offline_bundle():
    """Zips the dashboard web application for offline mobile deployment."""
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    with zipfile.ZipFile(BUNDLE_ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(DASHBOARD_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, DASHBOARD_DIR)
                zipf.write(file_path, arcname)
    print(f"✓ Created Offline Mobile Bundle Zip: {BUNDLE_ZIP_PATH}")

def main():
    print("=================================================================")
    print("⚡ PISO CHAIN - WEB-TO-APP MOBILE APK PACKAGE GENERATOR")
    print("=================================================================")

    if not os.path.exists(CONFIG_PATH):
        print(f"❌ Error: Config file not found at {CONFIG_PATH}")
        return

    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        config_data = json.load(f)

    print(f"✓ Loaded App Specification for: {config_data.get('name')} ({config_data.get('packageName')})")
    print(f"✓ Target Web App URL: {config_data.get('url')}")

    # Generate WTA1 Export Code
    wta1_token = generate_wta1_token(config_data)

    with open(OUTPUT_WTA1_PATH, 'w', encoding='utf-8') as f:
        f.write(wta1_token + "\n")

    # Package Offline Zip Bundle
    package_offline_bundle()

    print("\n-----------------------------------------------------------------")
    print("📱 WEB-TO-APP IMPORT CODE (WTA1 Format):")
    print("-----------------------------------------------------------------")
    print(wta1_token[:80] + "..." if len(wta1_token) > 80 else wta1_token)
    print("-----------------------------------------------------------------")
    print(f"✓ Saved import token to: {OUTPUT_WTA1_PATH}")
    print(f"✓ Saved offline asset zip to: {BUNDLE_ZIP_PATH}")
    print("\nInstructions:")
    print("1. Open WebToApp on your Android device.")
    print("2. Tap 'Import App' or 'Scan QR / Paste Code'.")
    print("3. Paste the WTA1 token above to instantly load PISO Chain App.")
    print("4. Tap 'Build APK' to export installable PISO Chain Mainnet.apk!")
    print("=================================================================")

if __name__ == "__main__":
    main()
