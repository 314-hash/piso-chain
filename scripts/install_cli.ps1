# PISO Chain CLI Tooling Installer for Windows PowerShell
$ErrorActionPreference = "Stop"

Write-Host "[*] Installing PISO Chain CLI Tooling Engine..." -ForegroundColor Cyan

$InstallDir = "$env:USERPROFILE\.piso"
if (!(Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir | Out-Null
}

.venv\Scripts\python.exe -m pip install --upgrade pip eth-keys eth-utils pycryptodome pyyaml requests | Out-Null

Copy-Item -Path "piso" -Destination "$InstallDir\piso.py" -Force

# Create piso.cmd wrapper
$CmdContent = "@echo off`r`npython `"$InstallDir\piso.py`" %*"
Set-Content -Path "$InstallDir\piso.cmd" -Value $CmdContent

Write-Host "[+] PISO CLI installed successfully to $InstallDir\piso.cmd" -ForegroundColor Green
Write-Host "    Run '.venv\Scripts\python.exe piso wallet:create' or 'piso wallet:create' to get started." -ForegroundColor Yellow
