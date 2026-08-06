# PISO Chain Architecture Specification

## Overview
PISO Chain is an enterprise Layer 1 EVM-compatible blockchain powered by BSC Parlia Proof-of-Staked-Authority (PoSA) consensus, AI Agent OS Infrastructure, and Quantum-Ready Cryptography.

```text
+-----------------------------------------------------------------------+
|                            PISO Chain Core                            |
+-----------------------------------------------------------------------+
|  [Wallet Layer]       [RPC / REST API]       [System Contracts]       |
|  - BIP-39 / BIP-32    - JSON-RPC 2.0         - PISOValidatorSet       |
|  - SLIP-10 / SLIP-39  - Swagger REST API     - PISOQuantumSecurity    |
|  - SLIP-44 (2026')   - WebSocket Subscriptions PISOProofOfWork         |
+-----------------------------------------------------------------------+
|  [Consensus Layer]                           [AI & DePIN Oracles]     |
|  - Parlia PoSA Engine                        - GeoLibre GIS Map       |
|  - 3s Block Time                             - Turbo-Fieldfare (~2GB) |
|  - PoW Mining Solver                         - Agent-Reach & Copilot  |
+-----------------------------------------------------------------------+
```

## Modular Layers
1. **Wallet Infrastructure (`wallet/`)**: Hierarchical Deterministic wallet, SLIP-39 Shamir recovery, SLIP-0044 registered coin type (`2026'`), Keystore V3 encryption.
2. **Execution & System Contracts (`contracts/`)**: 18 EVM System contracts for PoSA Staking, Proof of Work rewards (`PISOProofOfWork.sol`), GeoLibre DePIN spatial oracle (`PISOValidatorGeoLocation.sol`), Turbo-Fieldfare AI (`PISOTurboFieldfareAI.sol`), Agent-Reach Web Oracle (`PISOAgentReachOracle.sol`), OpenPlanter Knowledge Graph (`PISOOpenPlanter.sol`), CopilotKit AG-UI (`PISOCopilotKit.sol`), Bullshit-Detector (`PISOBullshitDetector.sol`), Public APIs Directory (`PISOPublicApisOracle.sol`), Governance, Bridge, and Paymaster.
3. **Proof of Work & 1-Click Mining (`core/pow.py`, `scripts/pow_miner.py`)**: Keccak-256 target difficulty solver, real-time hashrate benchmarking, and 24-hour yield accumulator.
4. **DePIN & Spatial Oracle (`contracts/PISOValidatorGeoLocation.sol`)**: MapLibre GL JS vector canvas rendering active validator node positions (Manila, Singapore, Tokyo, London, San Francisco).
5. **Ultra-Low-RAM AI Engine (`jcode/turbo_fieldfare.py`)**: Gemma 4 26B-A4B inference running in ~2 GB RAM footprint with on-chain verification proofs.
6. **Agent-Reach Web Oracle (`jcode/agent_reach.py`)**: 1-click real-time web scraping, YouTube subtitles, RSS feeds, and GitHub issue streams.
7. **OpenPlanter Entity Graph (`jcode/open_planter.py`)**: Recursive entity resolution across EVM transactions and contracts, rendering Cytoscape.js force-directed knowledge maps.
8. **CopilotKit AG-UI Assistant (`jcode/copilot_kit.py`)**: Generative UI component rendering, shared state streaming, and Human-in-the-Loop signature approvals.
9. **Bullshit-Detector Fact-Checker (`jcode/bullshit_detector.py`)**: Claim-by-claim content verification engine, independent web source checking, and 0-10 BS score logging.
10. **Public APIs Directory Oracle (`jcode/public_apis_oracle.py`)**: Discovery catalog & oracle engine enabling AI Agents to query 1,000+ public APIs (Crypto, Forex, Stocks, Weather) with on-chain data proofs.
11. **Freqtrade Algorithmic Trading Bot & Proof Oracle (`contracts/PISOFreqtradeOracle.sol`, `bridge/freqtrade_bridge.py`, `core/freqtrade_agent.py`)**: Automated trading worker daemon polling Freqtrade REST API sessions, verifying SHA-256 trade work proofs, and dispensing native $PISO token rewards for profitable trades.
12. **RPC & REST API (`rpc/`, `api/`)**: JSON-RPC 2.0 and OpenAPI 3.0 interfaces.
13. **Quantum Readiness (`wallet/crypto/`)**: Pluggable `Signer` interface supporting classical ECDSA and NIST PQC algorithms (ML-DSA / Dilithium).
