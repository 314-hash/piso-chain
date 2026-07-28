/**
 * PISO Chain Constant Definitions & Credentials
 */

export const PISO_CHAIN_ID = 2026001; // 0x1EE349
export const PISO_CHAIN_HEX_ID = '0x1EE349';
export const PISO_CHAIN_NAME = 'PISO Chain Devnet';
export const PISO_SYMBOL = 'PISO';
export const PISO_DECIMALS = 18;

export const DEFAULT_RPC_HTTP_DEV = 'https://piso-rpc-dev.loca.lt';
export const DEFAULT_RPC_HTTP_LOCAL = 'http://localhost:8545';
export const DEFAULT_RPC_WS_DEV = 'wss://piso-ws-dev.loca.lt';
export const DEFAULT_RPC_WS_LOCAL = 'ws://localhost:8546';
export const DEFAULT_EXPLORER_URL = 'https://piso-blockchain.vercel.app/';

/**
 * System Smart Contract Precompiled & Fixed Addresses
 */
export const SYSTEM_CONTRACT_ADDRESSES = {
  PISOValidatorSet: '0x0000000000000000000000000000000000001000',
  PISOSlashIndicator: '0x0000000000000000000000000000000000001001',
  PISOQuantumSecurity: '0x0000000000000000000000000000000000001002',
  PISOFaucet: '0x0000000000000000000000000000000000001003',
  PISOStaking: '0x0000000000000000000000000000000000001004',
  PISOGovernor: '0x0000000000000000000000000000000000001005',
  PISOPaymaster: '0x0000000000000000000000000000000000001006',
  PISOBridge: '0x0000000000000000000000000000000000001007',
  PISOZKRecovery: '0x0000000000000000000000000000000000001008',
  PISOAIOracle: '0x0000000000000000000000000000000000001009',
} as const;

/**
 * Network Parameters
 */
export const NETWORK_CONFIG = {
  blockTimeSeconds: 3.0,
  minStakingAmountPISO: '100000.0', // 100k PISO
  faucetDripPISO: '1.0', // 1 PISO / 24 hours
  faucetCooldownHours: 24,
  maxValidators: 21,
  minValidators: 3,
} as const;
