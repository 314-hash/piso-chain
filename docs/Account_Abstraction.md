# EIP-4337 Native Account Abstraction

PISO Chain includes native Account Abstraction via `PISOPaymaster.sol` and Bundler infrastructure.

## Paymaster Services
- **Gasless Transactions**: Sponsored gas fees for onboarded dApps.
- **ERC-20 Gas Payment**: Pay gas fees using PISO-wrapped tokens or stablecoins.
- **Bundler Interface**: Relays UserOperations directly into block proposals.
