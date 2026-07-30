.PHONY: help install test lint sdk build run-rpc run-rest docker-up docker-down clean

PYTHON = .venv/Scripts/python.exe

help:
	@echo "PISO Chain Build & Orchestration Makefile"
	@echo "----------------------------------------"
	@echo "make test     - Run python unit, integration, and performance test suite"
	@echo "make sdk      - Build TypeScript SDK"
	@echo "make run-rpc  - Start JSON-RPC 2.0 Server"
	@echo "make run-rest - Start REST API HTTP Server"
	@echo "make cli      - Test PISO CLI"

test:
	$(PYTHON) -m unittest discover -s tests -p "test_*.py"

sdk:
	npm --prefix sdk run build

run-rpc:
	$(PYTHON) -c "from rpc.jsonrpc_server import run_rpc_server; server = run_rpc_server(); print('[*] JSON-RPC listening on http://127.0.0.1:8545'); server.serve_forever()"

run-rest:
	$(PYTHON) -c "from api.rest_server import run_rest_server; server = run_rest_server(); print('[*] REST API listening on http://127.0.0.1:8081'); server.serve_forever()"

cli:
	$(PYTHON) piso wallet:create --words 12

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down
