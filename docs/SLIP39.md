# SLIP-39 Shamir Secret Sharing Engine

SLIP-39 allows splitting sensitive seeds into $N$ shares such that any $M$ shares ($M \le N$) can reconstruct the original secret phrase.

## Supported Configurations
- **2-of-3**: Ideal for individual social recovery.
- **3-of-5**: Ideal for Validator Committee & Treasury keys.
- **5-of-8**: Ideal for DAO Governance & Emergency Vaults.

## CLI Usage
```bash
# Split secret into 3 shares with threshold 2
piso wallet:split --secret 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef --threshold 2 --shares 3

# Combine 2 shares to recover secret
piso wallet:combine --shares "01-02-..." "02-02-..."
```
