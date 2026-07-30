# BIP-39 Mnemonic & Seed Specification

PISO Chain implements full BIP-39 mnemonic phrase generation, entropy verification, and seed derivation.

## Word Count & Entropy Mapping
- **12 Words**: 128-bit entropy + 4-bit SHA256 checksum
- **18 Words**: 192-bit entropy + 6-bit SHA256 checksum
- **24 Words**: 256-bit entropy + 8-bit SHA256 checksum

## Key Derivation
Seed derivation uses PBKDF2 HMAC-SHA512 with 2048 iterations and salt string `"mnemonic" + passphrase`.
