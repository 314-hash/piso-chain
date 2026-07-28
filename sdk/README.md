# ⚡ `@piso-chain/sdk`

> Official TypeScript & JavaScript SDK for **PISO Chain** (Layer 1 Blockchain).

`@piso-chain/sdk` provides a unified, typed interface for dApp developers to connect to PISO Chain, interact with system contracts (`PISOValidatorSet`, `PISOSlashIndicator`, `PISOQuantumSecurity`), manage native EIP-4337 gasless Paymasters, and verify NIST FIPS 204 Post-Quantum signatures.

---

## 📦 Installation

```bash
npm install @piso-chain/sdk ethers viem
```

---

## 🚀 Quick Start

### 1. Initialize PISO Client

```typescript
import { PISOClient } from '@piso-chain/sdk';

// Initialize with default or custom RPC URL
const client = new PISOClient('https://piso-rpc-dev.loca.lt');

// Read balance
const balance = await client.getBalance('0x1821F246a27287a2187E1D634B8883030fA14731');
console.log(`Balance: ${balance} PISO`);

// Read Active Validator Set
const validators = await client.getActiveValidators();
console.log('Active Validators:', validators);
```

---

### 2. Programmatically Add PISO Chain to MetaMask

```typescript
import { addPisoChainToMetaMask } from '@piso-chain/sdk';

const success = await addPisoChainToMetaMask();
if (success) {
  console.log('PISO Chain added to wallet!');
}
```

---

### 3. Request 1.0 PISO Testnet Coins from Faucet

```typescript
import { PISOClient } from '@piso-chain/sdk';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const client = new PISOClient();
const receipt = await client.requestFaucet(signer);
console.log('Faucet drip successful! Tx Hash:', receipt?.hash);
```

---

### 4. Verify NIST FIPS 204 Post-Quantum Signatures

```typescript
import { PISOClient } from '@piso-chain/sdk';

const client = new PISOClient();

const isValid = await client.verifyPostQuantumSignature({
  algorithm: 'ML-DSA-NIST-FIPS-204',
  messageHash: '0x...',
  publicKey: '0x...',
  signature: '0x...',
});

console.log('Is Signature Valid:', isValid);
```

---

## 📚 API Reference

### System Contract Addresses (`SYSTEM_CONTRACT_ADDRESSES`)
- `PISOValidatorSet`: `0x0000000000000000000000000000000000001000`
- `PISOSlashIndicator`: `0x0000000000000000000000000000000000001001`
- `PISOQuantumSecurity`: `0x0000000000000000000000000000000000001002`

---

## 📄 License

MIT © [314-hash](https://github.com/314-hash/piso-chain)
