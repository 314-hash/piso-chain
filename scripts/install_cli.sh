#!/usr/bin/env bash
# PISO Chain CLI Tooling Installer for Linux / macOS
set -e

echo "[*] Installing PISO Chain CLI Tooling Engine..."

INSTALL_DIR="${HOME}/.piso"
mkdir -p "${INSTALL_DIR}"

python3 -m pip install --upgrade pip eth-keys eth-utils pycryptodome pyyaml requests > /dev/null 2>&1

chmod +x piso
cp piso "${INSTALL_DIR}/piso"

export PATH="${INSTALL_DIR}:${PATH}"

echo "[+] PISO CLI installed successfully to ${INSTALL_DIR}/piso"
echo "    Run 'piso --help' or 'piso wallet:create' to get started."
