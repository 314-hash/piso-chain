# PISO Chain Wallet Infrastructure Guide

## Standards Overview
PISO Chain Wallet Infrastructure supports:
- **BIP-39**: 12, 18, and 24-word seed generation with PBKDF2 HMAC-SHA512.
- **BIP-32 & SLIP-10**: Hierarchical key derivation for secp256k1 and Ed25519.
- **BIP-44**: Standard paths (`m/44'/2026'/0'/0/0`).
- **SLIP-39**: Shamir Secret Sharing for 2-of-3, 3-of-5, N-of-M recovery.
- **Keystore V3**: AES-256-GCM password-protected encryption.

## Python API Example
```python
from wallet.mnemonic import BIP39Mnemonic
from wallet.recovery import WalletRecovery

# Create new 24-word wallet
mnemonic = BIP39Mnemonic.generate(24)
wallet = WalletRecovery.recover_from_mnemonic(mnemonic, coin_type=2026)

print("Address:", wallet.address)
```

## CLI Operations
```bash
# Create new wallet
piso wallet:create --words 24

# Recover wallet
piso wallet:recover --mnemonic "your 24 words phrase..."
```
