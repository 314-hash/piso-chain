// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOSwapFactory
 * @notice Creates and manages PISOSwap liquidity pair contracts (Uniswap V2 architecture)
 * @dev Deployed on PISO Chain at genesis block
 */

interface IPISOSwapPair {
    function initialize(address tokenA, address tokenB) external;
}

contract PISOSwapFactory {
    // ─── Events ──────────────────────────────────────────────────────────────
    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256 pairIndex
    );

    // ─── State ────────────────────────────────────────────────────────────────
    address public feeTo;
    address public feeToSetter;
    bytes32 public constant INIT_CODE_PAIR_HASH = keccak256(type(PISOSwapPairLite).creationCode);

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    // ─── Views ────────────────────────────────────────────────────────────────
    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }

    // ─── Pair Creation ────────────────────────────────────────────────────────
    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "PISOSwap: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "PISOSwap: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "PISOSwap: PAIR_EXISTS");

        bytes memory bytecode = type(PISOSwapPairLite).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        PISOSwapPairLite(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);

        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    // ─── Fee Management ───────────────────────────────────────────────────────
    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "PISOSwap: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "PISOSwap: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
}

// ─── Minimal Pair Stub (full pair in PISOSwapPair.sol) ───────────────────────
contract PISOSwapPairLite {
    address public token0;
    address public token1;
    address public factory;
    bool private _initialized;

    uint256 private reserve0;
    uint256 private reserve1;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    event Initialized(address token0, address token1);
    event Sync(uint256 reserve0, uint256 reserve1);

    modifier onlyFactory() {
        require(msg.sender == factory || factory == address(0), "PISOSwap: NOT_FACTORY");
        _;
    }

    function initialize(address _token0, address _token1) external {
        require(!_initialized, "PISOSwap: ALREADY_INITIALIZED");
        factory = msg.sender;
        token0 = _token0;
        token1 = _token1;
        _initialized = true;
        emit Initialized(_token0, _token1);
    }

    function getReserves() external view returns (uint256 _reserve0, uint256 _reserve1, uint256 _blockTimestamp) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestamp = block.timestamp;
    }

    function sync() external {
        emit Sync(reserve0, reserve1);
    }
}
