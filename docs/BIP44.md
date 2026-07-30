# BIP-44 Derivation Path Specification

PISO Chain follows BIP-44 multi-account hierarchy for deterministic key derivation.

## Path Structure
`m / 44' / coin_type' / account' / change / address_index`

## Components
- **`44'`**: Purpose constant (BIP-44).
- **`coin_type'`**: PISO mainnet coin type `2026'` (configurable via `config/coin_type.yaml`).
- **`account'`**: Account index (`0'` default).
- **`change`**: `0` for external addresses, `1` for internal change addresses.
- **`address_index`**: Sequential address index starting at `0`.

## Example
`m/44'/2026'/0'/0/0`
