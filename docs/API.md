# PISO Chain REST API Documentation

PISO Chain exposes a high-performance REST API with OpenAPI 3.0 Swagger specifications.

## Base URL
`http://localhost:8081`

## Endpoints
| HTTP Method | Path | Summary |
|---|---|---|
| `POST` | `/api/wallet/create` | Create new BIP-39 wallet |
| `POST` | `/api/wallet/recover` | Recover wallet from mnemonic |
| `GET` | `/api/wallet/balance` | Query native account balance |
| `POST` | `/api/wallet/send` | Broadcast raw signed transaction |
| `POST` | `/api/validator/create` | Generate isolated validator keypair |
| `GET` | `/api/node/status` | Node status and sync health |
| `GET` | `/api/network/info` | Network specifications |
| `GET` | `/docs/swagger.json` | OpenAPI 3.0 JSON Specification |
