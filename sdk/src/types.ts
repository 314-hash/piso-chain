/**
 * Type definitions for PISO Chain SDK
 */

export interface NetworkParams {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  explorerUrl?: string;
}

export interface SystemMetrics {
  blockNumber: bigint;
  validatorCount: number;
  isAIOracleActive: boolean;
  threatLevel: string;
}

export interface ValidatorInfo {
  address: string;
  stakedAmount: bigint;
  misdemeanors: bigint;
  isActive: boolean;
}

export interface UserOperation {
  sender: string;
  nonce: bigint;
  initCode: string;
  callData: string;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: string;
  signature: string;
}

export interface QuantumSignature {
  algorithm: 'ML-DSA-NIST-FIPS-204' | 'W-OTS-PLUS';
  publicKey: string;
  signature: string;
  messageHash: string;
}

export interface MetaMaskEthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}
