#!/usr/bin/env python3
"""
Sakura Crossing AI Agent Layer Server & API Gateway for PISO Chain.
Provides REST API endpoints for agent execution, 20-agent registry, contract auditing,
workflow DAG automation, RAG knowledge query, and on-chain oracle verification.
Listens on http://localhost:8200
"""

import sys
import os
import json
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

# Add parent directory to sys.path for absolute imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import Sakura Crossing Framework
from core.sakura_framework.agent_orchestrator import SakuraOrchestrator

from core.sakura_framework.workflow_engine import WorkflowEngine
from core.sakura_framework.ai_memory_store import AIMemoryStore
from core.sakura_framework.agent_oracle_bridge import AgentOracleBridge
from core.sakura_framework.freqtrade_ai_connector import FreqtradeAIConnector
from core.sakura_agents.agent_registry import SakuraAgentRegistry

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")
logger = logging.getLogger("SakuraAgentServer")

orchestrator = SakuraOrchestrator()
workflow_engine = WorkflowEngine()
memory_store = AIMemoryStore()
oracle_bridge = AgentOracleBridge()
freqtrade_connector = FreqtradeAIConnector()
agent_registry = SakuraAgentRegistry()

class SakuraRequestHandler(BaseHTTPRequestHandler):

    def _send_json(self, status_code: int, data: dict):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        if path in ["/", "/health", "/api/v1/sakura/health"]:
            self._send_json(200, {
                "status": "ONLINE",
                "service": "Sakura Crossing AI Agent Server",
                "protocol": "PISO Chain Layer 1",
                "version": "1.5.0",
                "total_agents": 20,
                "oracle_address": AgentOracleBridge.ORACLE_CONTRACT_ADDRESS
            })
        elif path == "/api/v1/sakura/agents":
            self._send_json(200, {
                "status": "SUCCESS",
                "count": 20,
                "agents": agent_registry.list_all_agents()
            })
        elif path == "/api/v1/sakura/freqtrade/risk":
            risk_data = freqtrade_connector.analyze_market_risk()
            self._send_json(200, risk_data)
        elif path == "/api/v1/sakura/history":
            tasks = orchestrator.list_recent_tasks()
            self._send_json(200, {"status": "SUCCESS", "tasks": tasks})
        else:
            self._send_json(404, {"error": "Endpoint not found"})

    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        content_length = int(self.headers.get("Content-Length", 0))
        post_data_raw = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        
        try:
            payload = json.loads(post_data_raw)
        except Exception:
            payload = {}

        if path == "/api/v1/sakura/agent/execute":
            agent_id = payload.get("agent_id", "SmartContractAuditor")
            prompt = payload.get("prompt", "Analyze PISO Chain smart contract code")
            
            # Execute Agent reasoning
            agent_result = agent_registry.execute_agent_task(agent_id, prompt, payload)
            
            # Route through Orchestrator
            orch_result = orchestrator.route_agent_task(agent_id, prompt, payload)
            
            # Submit cryptographic proof to Oracle Bridge
            proof_result = oracle_bridge.submit_ai_report_proof(agent_id, agent_result)

            combined_response = {
                "status": "SUCCESS",
                "agent_result": agent_result,
                "orchestration": orch_result,
                "oracle_proof": proof_result
            }
            self._send_json(200, combined_response)

        elif path == "/api/v1/sakura/workflow/run":
            workflow_name = payload.get("workflow_name", "CRM_CUSTOMER_ONBOARDING")
            wf_payload = payload.get("payload", {})
            wf_result = workflow_engine.execute_workflow(workflow_name, wf_payload)
            self._send_json(200, wf_result)

        elif path == "/api/v1/sakura/audit/contract":
            contract_code = payload.get("code", "contract SimpleToken { mapping(address => uint256) balances; }")
            audit_result = agent_registry.execute_agent_task("SmartContractAuditor", f"Audit Contract: {contract_code[:100]}...", payload)
            self._send_json(200, audit_result)

        elif path == "/api/v1/sakura/memory/query":
            query = payload.get("query", "Whitepaper")
            memory_results = memory_store.query_memory(query)
            self._send_json(200, {"status": "SUCCESS", "query": query, "results": memory_results})

        else:
            self._send_json(404, {"error": "Invalid POST endpoint"})

def run_server(port: int = 8200):
    server_address = ("0.0.0.0", port)
    httpd = HTTPServer(server_address, SakuraRequestHandler)
    logger.info("========================================================")
    logger.info("🌸 SAKURA CROSSING AI AGENT SERVER ONLINE AT PORT %d", port)
    logger.info("========================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Server shutting down...")
        httpd.server_close()

if __name__ == "__main__":
    port = 8200
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)
