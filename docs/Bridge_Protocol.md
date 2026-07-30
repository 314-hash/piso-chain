# Cross-Chain Asset Bridge Protocol

PISO Chain features native cross-chain asset bridging (`contracts/PISOBridge.sol` & `bridge/relayer.py`).

## Architecture
- **PISOBridge Contract**: Lock/Mint and Burn/Unlock smart contract interface.
- **Bridge Relayer Daemon**: Listens to cross-chain deposit events and submits multi-sig relayer confirmations.
- **Relayer Committee**: 3-of-5 threshold multisig verification.
