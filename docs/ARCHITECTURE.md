# PISO Chain Architecture Specification

## Overview
PISO Chain is an enterprise Layer 1 EVM-compatible blockchain powered by BSC Parlia Proof-of-Staked-Authority (PoSA) consensus, AI Agent OS Infrastructure, Quantum-Ready Cryptography, and the Enterprise 7-Repo Open-Source Security Suite.

```text
+---------------------------------------------------------------------------------------+
|                                    PISO Chain Core                                    |
+---------------------------------------------------------------------------------------+
|  [Wallet Layer]       [RPC / REST API]       [System Contracts]                       |
|  - BIP-39 / BIP-32    - JSON-RPC 2.0         - PISOValidatorSet  - PISOLegendaryOSINT |
|  - SLIP-10 / SLIP-39  - Swagger REST API     - PISOQuantumSecurity - PISOAISVSSecurity|
|  - SLIP-44 (2026')   - Enterprise v1 Endpoints PISOProofOfWork                        |
+---------------------------------------------------------------------------------------+
|  [Consensus Layer]                           [AI, DePIN & Security Enterprise Suite]  |
|  - Parlia PoSA Engine                        - Legendary_OSINT Forensic Engine        |
|  - 3s Block Time                             - PraisonAI Multi-Agent Team Orchestration|
|  - PoW Mining Solver                         - JobSync Worker Scheduler               |
|                                              - OWASP AISVS Security Verifier          |
|                                              - IRONSIGHT Situational Command Center   |
|                                              - L0p4Map P2P Topology & Vulners Scanner |
|                                              - MinerU PDF Whitepaper & LaTeX Parser   |
+---------------------------------------------------------------------------------------+
```

## Modular Layers
1. **Wallet Infrastructure (`wallet/`)**: Hierarchical Deterministic wallet, SLIP-39 Shamir recovery, SLIP-0044 registered coin type (`2026'`), Keystore V3 encryption.
2. **Execution & System Contracts (`contracts/`)**: 25 EVM System contracts for PoSA Staking, Proof of Work rewards (`PISOProofOfWork.sol`), Decentralized Mining Treasury (`PISOMiningTreasury.sol` @ `0x...1004`), RefRef Referral & Affiliate Engine (`PISORefRefReferral.sol` @ `0x...100D`), Legendary OSINT (`PISOLegendaryOSINT.sol`), OWASP AISVS Security (`PISOAISVSSecurity.sol`), GeoLibre DePIN spatial oracle (`PISOValidatorGeoLocation.sol`), Turbo-Fieldfare AI (`PISOTurboFieldfareAI.sol`), Agent-Reach Web Oracle (`PISOAgentReachOracle.sol`), OpenPlanter Knowledge Graph (`PISOOpenPlanter.sol`), CopilotKit AG-UI (`PISOCopilotKit.sol`), Bullshit-Detector (`PISOBullshitDetector.sol`), Public APIs Directory (`PISOPublicApisOracle.sol`), Governance, Bridge, and Paymaster.
3. **Multi-Client Execution Layer (Geth + Nethermind C#)**: Enterprise client diversity supporting Nethermind (`NethermindEth/nethermind`) C#/.NET 8 execution client via custom chainspec (`config/nethermind_piso_chainspec.json`), C# Treasury Mining plugin (`consensus/Nethermind.PisoChain/PisoTreasuryMiningPlugin.cs`), and high-speed EVM tracing.
3. **RefRef Referral & Affiliate Engine (`core/refref_referral_engine.py`, `contracts/PISORefRefReferral.sol`)**: On-chain referral attribution, unique referral link generator (`PISO-REF-xxx`), campaign reward logic, and automated $PISO reward payouts.
3. **Treasury-Based Native Coin Mining System (`core/treasury_mining.py`, `contracts/PISOMiningTreasury.sol`, `docs/TREASURY_MINING_SPECIFICATION.md`)**: Pre-minted non-inflationary 60 Billion PISO native treasury payout engine with 5M-block halving schedule (~6 months @ 3s block finality).
4. **Proof of Work & 1-Click Mining (`core/pow.py`, `scripts/pow_miner.py`)**: Keccak-256 target difficulty solver, real-time hashrate benchmarking, and 24-hour yield accumulator.
4. **DePIN & Spatial Oracle (`contracts/PISOValidatorGeoLocation.sol`)**: MapLibre GL JS vector canvas rendering active validator node positions (Manila, Singapore, Tokyo, London, San Francisco).
5. **Ultra-Low-RAM AI Engine (`jcode/turbo_fieldfare.py`)**: Gemma 4 26B-A4B inference running in ~2 GB RAM footprint with on-chain verification proofs.
6. **Legendary OSINT Engine (`core/legendary_osint.py`, `contracts/PISOLegendaryOSINT.sol`)**: Cryptographic wallet forensic tracing, IP/domain infrastructure recon, dark web breach hash correlation, and on-chain intelligence attestation.
7. **PraisonAI Multi-Agent Framework (`core/praison_agent_engine.py`)**: Declarative low-code multi-agent team builder (Researcher, Auditor, Trader, Security Guard), self-reflection audit loops, and code interpreter sandbox.
8. **JobSync Task Scheduler (`core/jobsync_engine.py`)**: Asynchronous background AI worker queue, activity timers, and node capacity matchmaking.
9. **OWASP AISVS Verifier (`core/aisvs_security_verifier.py`, `contracts/PISOAISVSSecurity.sol`)**: OWASP AI Security Verification Standard (14-Chapter L1-L3 Controls), prompt injection shield, execution budget enforcement, and approval gateways.
10. **IRONSIGHT Command Center (`core/ironsight_command_center.py`)**: Real-time threat intelligence and validator node situational awareness command center telemetry stream.
11. **L0p4Map Scanner (`core/l0p4map_scanner.py`)**: Graphical and analytical P2P validator port scanner, topology matrix builder, and Vulners CVE correlation.
12. **MinerU Document Parser (`core/mineru_parser.py`)**: High-precision whitepaper/PDF layout analysis, table extraction, LaTeX formula parsing, and RAG markdown pipeline.
13. **Agent-Reach Web Oracle (`jcode/agent_reach.py`)**: 1-click real-time web scraping, YouTube subtitles, RSS feeds, and GitHub issue streams.
14. **OpenPlanter Entity Graph (`jcode/open_planter.py`)**: Recursive entity resolution across EVM transactions and contracts, rendering Cytoscape.js force-directed knowledge maps.
15. **CopilotKit AG-UI Assistant (`jcode/copilot_kit.py`)**: Generative UI component rendering, shared state streaming, and Human-in-the-Loop signature approvals.
16. **Bullshit-Detector Fact-Checker (`jcode/bullshit_detector.py`)**: Claim-by-claim content verification engine, independent web source checking, and 0-10 BS score logging.
17. **Public APIs Directory Oracle (`jcode/public_apis_oracle.py`)**: Discovery catalog & oracle engine enabling AI Agents to query 1,000+ public APIs with on-chain data proofs.
18. **Freqtrade Algorithmic Trading Bot & Proof Oracle (`contracts/PISOFreqtradeOracle.sol`, `bridge/freqtrade_bridge.py`, `core/freqtrade_agent.py`)**: Automated trading worker daemon polling Freqtrade REST API sessions, verifying SHA-256 trade work proofs, and dispensing native $PISO token rewards for profitable trades.
19. **RPC & REST API (`rpc/`, `api/`)**: JSON-RPC 2.0 and OpenAPI 3.0 interfaces.
20. **Quantum Readiness (`wallet/crypto/`)**: Pluggable `Signer` interface supporting classical ECDSA and NIST PQC algorithms (ML-DSA / Dilithium).
