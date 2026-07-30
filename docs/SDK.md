# PISO Chain Developer SDK Suite

PISO Chain provides official SDKs in **Python**, **TypeScript**, **Go**, and **Rust**.

## Available SDK Packages
- **Python**: `piso-sdk` (`sdk/python`)
- **TypeScript**: `@piso-chain/sdk` (`sdk/typescript` / `sdk`)
- **Go**: `github.com/314-hash/piso-chain/sdk/go`
- **Rust**: `piso-sdk` (`sdk/rust`)

## Quick Examples

### Python SDK
```python
from piso_sdk import SDKWallet, PISOClient

wallet = SDKWallet.generate_wallet(words=24)
client = PISOClient(rpc_url="http://localhost:8545")
balance = client.get_balance(wallet["address"])
```

### TypeScript SDK
```typescript
import { PISOWallet, PISOClient } from "@piso-chain/sdk";

const wallet = PISOWallet.generateWallet(2026);
console.log(wallet.address);
```
