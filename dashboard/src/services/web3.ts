import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as ethers from 'ethers'

export interface ActiveWallet {
  address: string
  privateKey: string
  mnemonic?: string
  type: 'generated' | 'imported'
}

const STORAGE_KEY = 'piso_active_wallet'
const CHAIN_ID = 2026001
const RPC_ENDPOINT = 'https://piso-rpc-dev.loca.lt'
const RPC_LOCAL_FALLBACK = 'http://127.0.0.1:8545'

// Genesis accounts allocation mapping for fallback balances
export const GENESIS_ALLOCATIONS: Record<string, { balance: string; note: string }> = {
  '0x1821f246a27287a2187e1d634b8883030fa14731': { balance: '99,999,700,000 PISO', note: 'Mainnet Treasury Vault' },
  '0x4c2b0dda95754015b2daf8a3302adbcf2fe248dc': { balance: '100,000 PISO', note: 'Genesis Validator Staking' },
  '0x50d06b3ad935b9502bce53b501b233bdfc87a355': { balance: '100,000 PISO', note: 'Genesis Validator Staking' },
  '0x19b183909fb264a09672e40d65c64f914ff26b41': { balance: '100,000 PISO', note: 'Genesis Validator Staking' },
  '0xb5a772355e12ca975c175c9a7cfbd48bbee482d8': { balance: '100,000 PISO', note: 'Genesis Validator Staking' },
  '0xe3afaec0677a6c34cc190b1f8f68f1d712d45614': { balance: '10,000,000 PISO', note: 'Devnet Faucet' },
}

export function getGenesisAllocation(addr: string) {
  const lower = addr ? addr.toLowerCase() : ''
  return GENESIS_ALLOCATIONS[lower] || { balance: '0.00 PISO', note: 'Standard Account' }
}

// Custom JSON-RPC call helper
export async function callJsonRpc(method: string, params: any[]): Promise<any> {
  const payload = {
    jsonrpc: '2.0',
    method: method,
    params: params,
    id: 1
  }

  // 1. Try proxied local RPC (/rpc is routed to http://localhost:8545 via vite proxy)
  try {
    const res = await fetch('/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.result !== undefined) return data.result
    }
  } catch (e) {
    // Ignore and try direct local rpc
  }

  // 2. Try direct local RPC port 8545
  try {
    const res = await fetch(RPC_LOCAL_FALLBACK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.result !== undefined) return data.result
    }
  } catch (e) {
    // Ignore and try remote localtunnel rpc
  }

  // 3. Try remote Localtunnel dev RPC
  const res = await fetch(RPC_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Bypass-Tunnel-Remainder': 'true'
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    throw new Error(`RPC HTTP ${res.status}`)
  }
  const data = await res.json()
  if (data && data.error) {
    throw new Error(data.error.message || 'RPC execution error')
  }
  return data.result
}

// Local Storage Active Wallet Actions
export function getActiveWallet(): ActiveWallet | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setActiveWallet(wallet: ActiveWallet | null) {
  if (wallet) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
  window.dispatchEvent(new Event('piso-wallet-changed'))
}

// React hook to access and synchronize active wallet state across the application
export function useWallet() {
  const [wallet, setWalletState] = useState<ActiveWallet | null>(getActiveWallet())

  useEffect(() => {
    const handleChanged = () => {
      setWalletState(getActiveWallet())
    }
    window.addEventListener('piso-wallet-changed', handleChanged)
    return () => window.removeEventListener('piso-wallet-changed', handleChanged)
  }, [])

  // 1. RPC Health Check query
  const { data: rpcHealth } = useQuery({
    queryKey: ['rpcHealth'],
    queryFn: async () => {
      try {
        const blockHex = await callJsonRpc('eth_blockNumber', [])
        if (blockHex && blockHex.startsWith('0x')) {
          return { online: true, latestBlock: parseInt(blockHex, 16) }
        }
      } catch (e) {
        // Ignore
      }
      return { online: false, latestBlock: 0 }
    },
    refetchInterval: 15000
  })

  // 2. Active Wallet Balance & Nonce query
  const { data: walletDetails, isLoading: loadingBalance, refetch: refetchWalletBalance } = useQuery({
    queryKey: ['walletDetails', wallet?.address],
    queryFn: async () => {
      if (!wallet) return { balance: '0.00 PISO', nonce: 0, rpcOnline: rpcHealth?.online ?? false }
      try {
        const hexBal = await callJsonRpc('eth_getBalance', [wallet.address, 'latest'])
        const hexNonce = await callJsonRpc('eth_getTransactionCount', [wallet.address, 'latest'])
        const wei = BigInt(hexBal)
        const piso = Number(wei) / 1e18
        return {
          balance: `${piso.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} PISO`,
          nonce: parseInt(hexNonce, 16),
          rpcOnline: true
        }
      } catch (e) {
        const gen = getGenesisAllocation(wallet.address)
        return {
          balance: gen.balance,
          nonce: 0,
          rpcOnline: false
        }
      }
    },
    enabled: !!wallet,
    refetchInterval: 5000
  })

  return {
    wallet,
    balance: walletDetails?.balance || '0.00 PISO',
    nonce: walletDetails?.nonce ?? 0,
    loadingBalance,
    rpcOnline: walletDetails?.rpcOnline ?? rpcHealth?.online ?? false,
    latestBlock: rpcHealth?.latestBlock ?? 0,
    refreshBalance: async () => { await refetchWalletBalance() },
    disconnect: () => setActiveWallet(null)
  }
}

// Post-Quantum signature public key derivation simulation
export function generateMLDSAPostQuantumPublicKey(privKeyHex: string): string {
  try {
    const hash = ethers.keccak256(ethers.toUtf8Bytes(privKeyHex + ':PISO-NIST-FIPS-204-ML-DSA'))
    return '0x' + hash.substring(2, 22) + '...' + hash.substring(54)
  } catch (err) {
    return 'Derivation failed'
  }
}

// SLIP-39 API splitting tool
export async function splitSecretShamir(secret: string, threshold: number, shares: number) {
  let secretHex = secret
  if (!secret.startsWith('0x') && !/^[0-9a-fA-F]+$/.test(secret)) {
    // Convert ASCII text to hex bytes
    secretHex = '0x' + Array.from(new TextEncoder().encode(secret))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  } else if (!secret.startsWith('0x')) {
    secretHex = '0x' + secret
  }

  const res = await fetch('/api/wallet/split', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: secretHex, threshold, shares })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP error ${res.status}`)
  }

  return res.json()
}

// Add PISO Mainnet to MetaMask (Browser Extension Extension Wallet)
export async function addPISOMainnetToMetaMask() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x1EE349', // 2026001 in hex
          chainName: 'PISO Chain Mainnet',
          nativeCurrency: { name: 'PISO', symbol: 'PISO', decimals: 18 },
          rpcUrls: [RPC_LOCAL_FALLBACK, RPC_ENDPOINT],
          blockExplorerUrls: ['http://localhost:4000']
        }]
      })
      return { success: true, message: 'PISO Chain Mainnet successfully added to MetaMask!' }
    } catch (err: any) {
      throw new Error(err.message || 'MetaMask chain addition rejected')
    }
  } else {
    throw new Error('MetaMask extension not detected in this browser.')
  }
}
