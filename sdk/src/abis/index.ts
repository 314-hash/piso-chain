/**
 * Smart Contract ABIs for PISO Chain System Infrastructure
 */

export const PISOValidatorSetABI = [
  'function getValidators() external view returns (address[])',
  'function isValidator(address account) external view returns (bool)',
  'function registerValidator(address feeAddress) external payable',
  'function withdrawStake() external',
  'event ValidatorRegistered(address indexed validator, uint256 stakedAmount)',
  'event ValidatorSlashed(address indexed validator, uint256 slashAmount)',
] as const;

export const PISOSlashIndicatorABI = [
  'function slash(address validator) external',
  'function misdemeanorCount(address validator) external view returns (uint256)',
  'function felonyCount(address validator) external view returns (uint256)',
  'function isJailed(address validator) external view returns (bool)',
  'event MisdemeanorReported(address indexed validator, uint256 currentCount)',
  'event FelonyReported(address indexed validator, uint256 currentCount)',
] as const;

export const PISOFaucetABI = [
  'function requestTokens() external',
  'function lastAccessTime(address user) external view returns (uint256)',
  'function faucetBalance() external view returns (uint256)',
  'event TokensDispensed(address indexed recipient, uint256 amount)',
] as const;

export const PISOQuantumSecurityABI = [
  'function verifyMLDSASignature(bytes32 msgHash, bytes calldata signature, bytes calldata pubKey) external pure returns (bool)',
  'function verifyWinternitzOTS(bytes32 msgHash, bytes calldata signature, bytes calldata pubKey) external pure returns (bool)',
  'function registerQuantumKey(bytes calldata pubKey) external',
  'event QuantumKeyRegistered(address indexed owner, bytes pubKey)',
] as const;

export const PISOPaymasterABI = [
  'function validatePaymasterUserOp(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature) userOp, bytes32 userOpHash, uint256 maxCost) external returns (bytes memory context, uint256 validationData)',
  'function deposit() external payable',
  'function getDeposit() external view returns (uint256)',
] as const;

export const PISOAIOracleABI = [
  'function getThreatScore(address account) external view returns (uint8)',
  'function getDynamicGasFloor() external view returns (uint256)',
  'function reportAnomalousActivity(address target, uint8 threatLevel) external',
  'event ThreatLevelUpdated(address indexed account, uint8 threatLevel)',
] as const;
