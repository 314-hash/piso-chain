# PISO Chain Changelog

All notable changes to the PISO Chain Protocol are documented in this file.

## [1.1.0] - Whitepaper Compliance & Modular Wallet Release

### Added
- **Core Wallet Package (`/core/wallet`)**: Submodules for `mnemonic`, `seed`, `masterkey`, `hdwallet`, `derivation`, `recovery`, `validator`, `multisig`, and `encryption`.
- **Configurable Coin Type (`config/coin_type.yaml`)**: SLIP-44 registry configuration for PISO mainnet (`2026'`) and devnet (`3140'`).
- **SLIP-39 Shamir Secret Sharing**: 2-of-3, 3-of-5, 5-of-8, N-of-M seed splitting and recovery.
- **Quantum Migration Framework**: Extended `Signer` interface with `algorithm()` for hybrid quantum migration.
- **JSON-RPC Methods**: Added `eth_getLogs`, `eth_feeHistory`, and `eth_getTransactionReceipt`.
- **Multi-Language SDK Extensions**: Staking, delegation, and AI Agent wallet support in Python, TypeScript, Go, and Rust.
- **REST API Endpoints**: `/api/wallet/split`, `/api/staking`, `/api/validator`, `/api/bridge`, `/api/ai-agent`.
- **Automated Security Audit Suite (`scripts/run_security_audit.py`)**: Memory zeroization, constant-time comparison, secret scanning, and smart contract access control checks.

### Changed
- Preserved 100% backward compatibility with BSC Parlia PoSA Consensus, EIP-4337, AI Agent OS, and NIST PQC smart contracts.
