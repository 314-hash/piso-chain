# Satoshilabs SLIP-44 PR Submission Template for PISO Chain

To register PISO Chain in the official [satoshilabs/slips](https://github.com/satoshilabs/slips) repository (`slip-0044.md`), append the following row right after Coin Type 2027 (`UNC`):

```markdown
| 2028       | PISO    | PISO Chain                        |
```

## Pull Request Summary

## Summary

Register a new SLIP-0044 coin type for PISO Chain.

### Project
- Name: PISO Chain
- Symbol: PISO
- Coin Type (Decimal): 2028
- Coin Type (Hex): `0x000007EC`
- Derivation Path: `m/44'/2028'/0'/0/0`
- Chain Type: Layer 1 Blockchain
- Repository: https://github.com/314-hash/piso-chain

### Notes
- Verified that coin type 2026 was assigned to ASTRON Token; selected next available unassigned coin type **2028**.
- Table formatting follows repository conventions.
- No existing entries were modified.
