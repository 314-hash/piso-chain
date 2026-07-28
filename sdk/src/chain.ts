/**
 * Viem & Ethers Network Definition & Wallet Helpers
 */

import {
  PISO_CHAIN_ID,
  PISO_CHAIN_HEX_ID,
  PISO_CHAIN_NAME,
  PISO_SYMBOL,
  PISO_DECIMALS,
  DEFAULT_RPC_HTTP_DEV,
  DEFAULT_EXPLORER_URL,
} from './constants.js';
import type { MetaMaskEthereumProvider } from './types.js';

/**
 * Viem Chain Definition Object
 */
export const pisoChainViem = {
  id: PISO_CHAIN_ID,
  name: PISO_CHAIN_NAME,
  network: 'piso-chain',
  nativeCurrency: {
    name: 'PISO',
    symbol: PISO_SYMBOL,
    decimals: PISO_DECIMALS,
  },
  rpcUrls: {
    default: { http: [DEFAULT_RPC_HTTP_DEV] },
    public: { http: [DEFAULT_RPC_HTTP_DEV] },
  },
  blockExplorers: {
    default: { name: 'PISO Explorer', url: DEFAULT_EXPLORER_URL },
  },
} as const;

/**
 * MetaMask wallet_addEthereumChain Parameters
 */
export const PISO_METAMASK_PARAMS = {
  chainId: PISO_CHAIN_HEX_ID,
  chainName: PISO_CHAIN_NAME,
  nativeCurrency: {
    name: 'PISO',
    symbol: PISO_SYMBOL,
    decimals: PISO_DECIMALS,
  },
  rpcUrls: [DEFAULT_RPC_HTTP_DEV],
  blockExplorerUrls: [DEFAULT_EXPLORER_URL],
};

/**
 * Programmatically prompt browser wallet to add or switch to PISO Chain
 */
export async function addPisoChainToMetaMask(
  provider?: MetaMaskEthereumProvider
): Promise<boolean> {
  const ethereum = provider || (typeof window !== 'undefined' ? (window as unknown as { ethereum?: MetaMaskEthereumProvider }).ethereum : undefined);

  if (!ethereum) {
    throw new Error('No Ethereum wallet extension (e.g. MetaMask) detected in environment.');
  }

  try {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [PISO_METAMASK_PARAMS],
    });
    return true;
  } catch (err) {
    console.error('Failed to add PISO Chain to wallet:', err);
    return false;
  }
}
