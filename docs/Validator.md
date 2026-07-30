# PISO Chain Validator Key & Domain Separation Guide

## Key Role Isolation (Phase 8)
Validator private keys must never be reused for user wallets. PISO Chain enforces cryptographic domain tag separation (`piso-validator-key-v1`).

```python
from wallet.validator import ValidatorKey, KeyRole

# Generate isolated validator key
vkey = ValidatorKey(raw_seed=b"random_entropy...", role=KeyRole.VALIDATOR)

# Sign block proposal (enforces role check)
sig = vkey.sign_block_proposal(block_hash=b"...")
```

## CLI Management
```bash
# Generate isolated validator key
piso validator:create

# Rotate validator key
piso validator:rotate

# Export encrypted keystore
piso validator:export --password "SecretPass123!"
```
