# PISO Chain JSON-RPC 2.0 API Specification

## Endpoints
- **HTTP**: `http://localhost:8545`
- **WebSocket**: `ws://localhost:8546`
- **Chain ID**: `2026001` (`0x1EE349`)

## Supported Methods
| Method | Description |
|---|---|
| `eth_chainId` | Returns network Chain ID (`0x1ee349`) |
| `eth_accounts` | List available node accounts |
| `eth_blockNumber` | Get latest block height |
| `eth_getBalance` | Get account balance in wei |
| `eth_sendRawTransaction` | Broadcast raw signed transaction hex |
| `eth_getTransactionByHash` | Fetch transaction details |
| `eth_getBlockByNumber` | Fetch block header and txs |
| `eth_call` | Execute read-only contract call |
| `eth_estimateGas` | Estimate execution gas limit |
| `web3_clientVersion` | Returns client version string |
| `net_version` | Returns network ID string |

## Example cURL Request
```bash
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```
