# ⚡ PISO Chain Viem Web3 Developer Examples

> **Source**: [dappuniversity/viem-examples](https://github.com/dappuniversity/viem-examples)
> **Adapted for**: PISO Chain — Chain ID `2026001`
> **Library**: [Viem v2](https://viem.sh/) — TypeScript-first EVM interface

---

## Overview

PISO Chain integrates the full **DappUniversity viem-examples** library, providing 6 canonical patterns for every on-chain interaction a developer needs. The examples are adapted to run against the PISO Chain RPC (`https://rpc.piso-chain.org` / `http://localhost:8545`) and are also interactive in the **PISO Chain Dashboard** (`http://localhost:8085` → ⚡ Viem Web3 SDK tab).

---

## Technology Stack

| Tool | Purpose |
|:---|:---|
| **Viem v2** | TypeScript-first EVM library (replaces ethers.js) |
| **Node.js** | Script runtime environment |
| **PISO Chain RPC** | Live target chain (`chainId: 2026001`) |
| **Dashboard Playground** | Interactive in-browser demo panel |

---

## PISO Chain Viem Config

`	ypescript
import { defineChain } from 'viem'

export const pisoChain = defineChain({
    id: 2026001,
    name: 'PISO Chain',
    nativeCurrency: { name: 'PISO', symbol: 'PISO', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc.piso-chain.org'] },
        local:   { http: ['http://localhost:8545'] }
    },
    blockExplorers: {
        default: { name: 'PISO Explorer', url: 'https://piso-blockchain.vercel.app' }
    }
})
`

---

## Example 1 — Public Client (`1_public_client.js`)

Reads live chain state — block number, gas price, and native PISO balance.

`javascript
import { createPublicClient, http, formatEther, formatGwei } from 'viem'
import { pisoChain } from './chains.js'

const publicClient = createPublicClient({
    chain: pisoChain,
    transport: http('https://rpc.piso-chain.org')
})

const blockNumber = await publicClient.getBlockNumber()
console.log(`Latest Block: #`.concat(blockNumber.toString()))

const gasPrice = await publicClient.getGasPrice()
console.log(`Gas Price: `.concat(formatGwei(gasPrice), ' Gwei'))

const balance = await publicClient.getBalance({
    address: '0xE3aFaeC0677A6C34CC190B1f8f68f1d712D45614'
})
console.log(`Balance: `.concat(formatEther(balance), ' PISO'))
`

---

## Example 2 — Wallet Client (`2_wallet_client.js`)

Creates a signing-capable wallet client from a private key.

`javascript
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { pisoChain } from './chains.js'

const account = privateKeyToAccount(process.env.PRIVATE_KEY)

const walletClient = createWalletClient({
    account,
    chain: pisoChain,
    transport: http('https://rpc.piso-chain.org')
})

console.log(`Wallet Address: `.concat(walletClient.account.address))
`

---

## Example 3 — Send Signed Transaction (`3_send_signed_transaction.js`)

Signs and broadcasts a native PISO coin transfer.

`javascript
import { parseEther } from 'viem'

const txHash = await walletClient.sendTransaction({
    to: '0xRecipientAddress...',
    value: parseEther('0.001'),
    chain: pisoChain
})
const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
console.log(`Confirmed in block: #`.concat(receipt.blockNumber.toString()))
`

---

## Example 4 — Read Smart Contract (`4_read_smart_contract.js`)

Reads on-chain state from PISO system contracts using `readContract`.

`javascript
const totalStaked = await publicClient.readContract({
    address: '0x0000000000000000000000000000000000001005',
    abi: PISOStakingABI,
    functionName: 'getTotalStaked',
})
console.log(`Total Staked: `.concat(formatEther(totalStaked), ' PISO'))
`

---

## Example 5 — Write Smart Contract (`5_write_smart_contract.js`)

Simulates and broadcasts a contract write — staking PISO via `PISOStaking.delegate()`.

`javascript
import { parseEther } from 'viem'

const { request } = await publicClient.simulateContract({
    address: '0x0000000000000000000000000000000000001005',
    abi: PISOStakingABI,
    functionName: 'delegate',
    args: ['0xE3aFaeC0677A6C34CC190B1f8f68f1d712D45614', parseEther('100000')],
    account: walletClient.account,
})
const txHash = await walletClient.writeContract(request)
console.log(`Staking TX: `.concat(txHash))
`

---

## Example 6 — Contract Events (`6_contract_events.js`)

Queries on-chain event logs using `getLogs` with ABI parsing.

`javascript
import { parseAbiItem } from 'viem'

const logs = await publicClient.getLogs({
    address: '0x0000000000000000000000000000000000001005',
    event: parseAbiItem('event Staked(address indexed delegator, uint256 amount)'),
    fromBlock: BigInt(0),
    toBlock: 'latest'
})

logs.forEach(log => {
    console.log(`Delegator: `.concat(log.args.delegator))
    console.log(`Amount: `.concat(formatEther(log.args.amount), ' PISO'))
    console.log(`Block: #`.concat(log.blockNumber.toString()))
})
`

---

## Dashboard Integration

All 6 examples are accessible in the interactive playground at:
`http://localhost:8085` → ⚡ Viem Web3 SDK (sidebar)

Each panel shows:
- **Left card**: Interactive form + Run button (real RPC calls when node is live, or realistic simulation)
- **Right card**: Exact Viem code snippet for copy-paste into your project

---

## PISO Chain System Contract Addresses (for viem readContract/writeContract)

| Contract | Address |
|:---|:---|
| `PISOValidatorSet` | `0x0000000000000000000000000000000000001000` |
| `PISOStaking` | `0x0000000000000000000000000000000000001005` |
| `PISOGovernor` | `0x0000000000000000000000000000000000001006` |
| `PISOPaymaster` | `0x0000000000000000000000000000000000001007` |
| `PISOBridge` | `0x0000000000000000000000000000000000001008` |

---

*PISO Chain Viem Integration — Adapted from [dappuniversity/viem-examples](https://github.com/dappuniversity/viem-examples)*
