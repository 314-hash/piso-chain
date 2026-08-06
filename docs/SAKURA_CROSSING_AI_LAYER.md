# 🌸 Sakura Crossing AI Agent Layer — Architectural & Integration Specification

> **Protocol**: PISO Chain Layer 1 (`Chain ID: 2026001`)  
> **Module**: Sakura Crossing Off-Chain AI Subsystem & On-Chain Oracle Bridge  
> **Oracle Contract**: [`contracts/PISOSakuraAIOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOSakuraAIOracle.sol) (`0x0000000000000000000000000000000000001013`)  
> **API Server**: `http://localhost:8200`  
> **Status**: Production Deployed & Verified

---

## 📌 Executive Overview

**Sakura Crossing** (`https://github.com/Kenton-GMI/sakura-crossing.git`) is integrated into **PISO Chain** as an off-chain, modular AI Agent Layer & Orchestrator. 

AI inference, multi-agent reasoning, vector RAG search, and workflow DAG automation execute **off-chain** to maintain strict blockchain determinism and 3.0-second block finality. PISO Chain acts as the immutable verification ledger, storing cryptographic SHA-256 report proofs, enforcing RBAC permissions, recording audit trails, and dispensing 15 PISO token rewards per verified report via [`PISOSakuraAIOracle.sol`](file:///c:/Users/janla/piso-chain/piso-chain/contracts/PISOSakuraAIOracle.sol).

---

## 🤖 The 20 Specialized Intelligent Agents Registry

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. GovernanceAgent         - Proposal summaries & duplicate risk scoring    │
│ 2. TreasuryAgent           - Token burn rate & genesis reserve analytics    │
│ 3. ValidatorAgent          - PoSA 3.0s block proposals & jailing alerts     │
│ 4. TradingAgent            - Freqtrade market strategy & trade proof audit │
│ 5. ComplianceAgent         - AML wallet risk scoring & suspicious tx check  │
│ 6. SmartContractAuditor    - Solidity vulnerability scanner & unit test gen │
│ 7. BlockchainAnalyticsAgent- TPS, TVL, liquidity, & RPC latency telemetry   │
│ 8. ExplorerAssistant       - Blockscout query AI assistant                  │
│ 9. WalletAssistant         - EIP-4337 Account Abstraction portfolio helper  │
│ 10. IdentityAgent          - Passkeys & ZK guardian social recovery proofs  │
│ 11. SupplyChainAgent       - DePIN supply chain logistics & QR verification │
│ 12. DePINAgent             - Physical hardware bandwidth & uptime monitor   │
│ 13. GISAgent               - GeoLibre spatial coordinates & MapLibre GL JS  │
│ 14. CustomerSupportAgent   - 24/7 Web3 help desk & documentation Q&A        │
│ 15. BusinessAutomationAgent- CRM, ERP, & payroll recurring automation        │
│ 16. DocumentationAssistant - Whitepaper, API, & SDK code snippet generator │
│ 17. DeveloperCopilot       - Viem TypeScript & Hardhat script generator     │
│ 18. SecurityMonitoringAgent- Mempool exploit & front-running threat scanner │
│ 19. ProposalReviewAgent    - DAO proposal budget impact reviewer            │
│ 20. RiskAssessmentAgent    - Macro protocol risk & DEX slippage engine      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Core Framework Architecture (`core/sakura_framework/`)

1. **`agent_orchestrator.py`**: Dynamic agent routing, parallel swarm coordination, streaming responses, context sharing, and Human-in-the-Loop signature approval enforcement.
2. **`workflow_engine.py`**: Business process DAG engine supporting CRM, ERP, Payroll, Accounting, Invoicing, Supply Chain, and Procurement automation.
3. **`ai_memory_store.py`**: RAG vector store retriever querying PISO Chain whitepaper, docs, contracts, and APIs.
4. **`agent_oracle_bridge.py`**: Cryptographic SHA-256 work proof generator interfacing with `PISOSakuraAIOracle.sol`.
5. **`freqtrade_ai_connector.py`**: Connects Freqtrade algorithmic strategy data to the AI agent swarm (requires user authorization before live trade execution).

---

## 📜 System Smart Contract #20 (`PISOSakuraAIOracle.sol`)

- **Address**: `0x0000000000000000000000000000000000001013`
- **Key Methods**:
  - `submitAgentReport(bytes32 agentId, bytes32 reportHash, uint256 riskScore, uint256 timestamp)`: Records verified AI report proof on-chain.
  - `claimReward(bytes32 reportHash)`: Dispenses 15 PISO token rewards to verified AI workers.
  - `authorizeAgent(address agentWallet, bytes32 role)`: Grants RBAC permissions to authorized AI agent wallets.

---

## 🌐 API Gateway REST Endpoints (`scripts/sakura_agent_server.py` @ Port `8200`)

- `GET /api/v1/sakura/health`: Server status and oracle contract verification.
- `GET /api/v1/sakura/agents`: Returns JSON catalog of all 20 specialized agents.
- `POST /api/v1/sakura/agent/execute`: Execute task prompt on selected agent with cryptographic work proof generation.
- `POST /api/v1/sakura/workflow/run`: Trigger enterprise DAG workflow execution.
- `POST /api/v1/sakura/audit/contract`: Run automated Solidity smart contract vulnerability audit.
