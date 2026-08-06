# PISO Chain Changelog

All notable changes to the PISO Chain Protocol are documented in this file.

## [1.5.0] - Freqtrade Algorithmic Bot, Vercel Live Deployment & Responsive UX

### Added
- **Freqtrade Algorithmic Trading Bot & Proof Oracle (`contracts/PISOFreqtradeOracle.sol`)**: Submodule integration of Freqtrade (`piso-chain/freqtrade`), `PISOStrategy.py` (EMA9/21/50 + RSI momentum strategy), `piso_config.json`, and SHA-256 work proof verification smart contract dispensing 10 PISO token rewards for verified profitable trades (>0.10% min profit).
- **PISO ↔ Freqtrade Bridge Daemon (`bridge/freqtrade_bridge.py`)**: 30-second REST API polling daemon connecting Freqtrade dry-run and live trading sessions to `PISOFreqtradeOracle.sol`. Includes Windows Python 3.14 `MockRapidJSON` compatibility layer and offline RPC fallback.
- **PISO Agent OS Worker (`core/freqtrade_agent.py`)**: Standardized `jcode` agent worker harness (`piso-freqtrade-agent-v1`) managing Freqtrade bot subprocess lifecycle.
- **Vercel Live Deployment (`https://piso-blockchain.vercel.app/`)**: Automated static dashboard deployment pipeline on Vercel with clean URLs, headers, and `/wallet` / `/contracts` rewrites.
- **100% Mobile & Desktop Responsive Design**: Upgraded Web Dashboard UI with responsive sidebar drawer, backdrop overlay, touch-scrolling data tables, mobile bottom app bar, and fluid auto-fitting PoW Mining Studio cards (`clamp()` & grid auto-fit).

## [1.3.0] - DappUniversity Viem Examples Interactive Playground


### Added
- **DappUniversity Viem Examples Integration (`docs/VIEM_EXAMPLES.md`)**: Full 6-example interactive playground adapted from [dappuniversity/viem-examples](https://github.com/dappuniversity/viem-examples) for PISO Chain (Chain ID `2026001`): Public Client (`getBlockNumber`, `getGasPrice`, `getBalance`), Wallet Client (`createWalletClient`, `privateKeyToAccount`), Send Signed Transaction (`sendTransaction`, `waitForTransactionReceipt`), Read Contract (`readContract` on `PISOStaking`, `PISOValidatorSet`, `PISOGovernor`), Write Contract (`simulateContract` + `writeContract` for staking), and Contract Events (`getLogs` with `parseAbiItem`).
- **Dashboard Viem Playground Tab**: Upgraded the `⚡ Viem Web3 SDK` dashboard section with 6 interactive panels, each showing a clickable live RPC call (real when node is live, simulated fallback) + side-by-side Viem code pattern snippet. Includes `selectViemTab()` tab switcher.
- **`jcode/viem_examples.py`**: Python bridge harness mirror of all 6 DappUniversity Viem examples adapted to `web3.py` for server-side AI agent use.

## [1.2.0] - PoW, SLIP-0044, GeoLibre GIS & Turbo-Fieldfare AI Release

### Added
- **Proof of Work (PoW) Mechanism (`contracts/PISOProofOfWork.sol`)**: Keccak-256 target difficulty solver (`core/pow.py`), Hardhat test suite, worker miner script (`scripts/pow_miner.py`), and `ReentrancyGuard` nonReentrant defense (`0x...1003`).
- **1-Click 24-Hour Automated Mining Engine**: Web & mobile dashboard mining banner with `localStorage` state persistence, 24h countdown clock, yield accumulator (`+0.000578 PISO/sec`), and daily 50 PISO reward claiming.
- **Satoshilabs SLIP-0044 Registered Coin Type**: Standardized HD wallet derivation on `2026'` (`m/44'/2026'/0'/0/0`).
- **GeoLibre GIS & MapLibre GL JS DePIN Spatial Oracle (`contracts/PISOValidatorGeoLocation.sol`)**: On-chain validator proof-of-physical-location contract and interactive global MapLibre vector canvas rendering node map markers (Manila, Singapore, Tokyo, London, San Francisco).
- **Turbo-Fieldfare Ultra-Low-RAM AI Engine (`jcode/turbo_fieldfare.py` & `contracts/PISOTurboFieldfareAI.sol`)**: Local Gemma 4 26B LLM inference running in ~2 GB RAM footprint with cryptographic on-chain verification proofs.
- **Agent-Reach Web Intelligence & Telemetry Oracle (`jcode/agent_reach.py` & `contracts/PISOAgentReachOracle.sol`)**: Real-time 1-click web scraping, YouTube transcript extraction, RSS parser, and GitHub telemetry oracle with on-chain proof hashes.
- **OpenPlanter Recursive Knowledge Graph Engine (`jcode/open_planter.py` & `contracts/PISOOpenPlanter.sol`)**: Recursive entity resolution across contracts, validator stakes, and transactions, rendering interactive Cytoscape.js force-directed knowledge graphs.
- **CopilotKit AG-UI Protocol & In-App Copilot (`jcode/copilot_kit.py` & `contracts/PISOCopilotKit.sol`)**: AG-UI protocol integration for Generative UI component rendering, shared state streaming, and Human-in-the-Loop signature approvals.
- **Bullshit-Detector Fact-Checker Oracle (`jcode/bullshit_detector.py` & `contracts/PISOBullshitDetector.sol`)**: Claim-by-claim content verification engine, independent web source checking, 0-10 BS score calculation, and on-chain report logging.
- **Public APIs Marketplace & Discovery Oracle (`jcode/public_apis_oracle.py` & `contracts/PISOPublicApisOracle.sol`)**: Discovery catalog & oracle engine enabling AI Agents to query 1,000+ curated public APIs (Crypto, Forex, Geolocation, Stocks, Weather) with on-chain data proofs.
- **First-Time User Manual & Infographics**: `docs/USER_TUTORIAL_MANUAL.md`, 4-step onboarding slide modal, and dashboard visual infographic cards.
- **Mainnet Launch Checklist & 100% Clean Audit Pass**: `docs/MAINNET_LAUNCH_CHECKLIST.md` verified via `scripts/run_security_audit.py`.

## [1.1.0] - Whitepaper Compliance & Modular Wallet Release

### Added
- **Core Wallet Package (`/core/wallet`)**: Submodules for `mnemonic`, `seed`, `masterkey`, `hdwallet`, `derivation`, `recovery`, `validator`, `multisig`, and `encryption`.
- **Configurable Coin Type (`config/coin_type.yaml`)**: SLIP-44 registry configuration for PISO mainnet (`2026'`) and devnet (`3140'`).
- **SLIP-39 Shamir Secret Sharing**: 2-of-3, 3-of-5, 5-of-8, N-of-M seed splitting and recovery.
- **Quantum Migration Framework**: Extended `Signer` interface with `algorithm()` for hybrid quantum migration.
- **JSON-RPC Methods**: Added `eth_getLogs`, `eth_feeHistory`, and `eth_getTransactionReceipt`.
- **Multi-Language SDK Extensions**: Staking, delegation, and AI Agent wallet support in Python, TypeScript, Go, and Rust.
- **REST API Endpoints**: `/api/wallet/split`, `/api/staking`, `/api/validator`, `/api/bridge`, `/api/ai-agent`.
- **Automated Security Audit Suite (`scripts/run_security_audit.py`)**: Memory zeroization, constant-time comparison, secret scanning, and smart contract access control checks.

### Changed
- Preserved 100% backward compatibility with BSC Parlia PoSA Consensus, EIP-4337, AI Agent OS, and NIST PQC smart contracts.
