// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOSwapRouter
 * @notice User-facing router for PISOSwap DEX
 * @dev Handles token swaps, liquidity management, and slippage protection
 *      Compatible with Uniswap V2 Router02 interface
 */

interface IPISOSwapFactory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IPISOSwapPair {
    function getReserves() external view returns (uint256 reserve0, uint256 reserve1, uint256 blockTimestamp);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function mint(address to) external returns (uint256 liquidity);
    function burn(address to) external returns (uint256 amount0, uint256 amount1);
    function swap(uint256 amount0Out, uint256 amount1Out, address to) external;
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract PISOSwapRouter {
    // ─── Events ──────────────────────────────────────────────────────────────
    event SwapExecuted(
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    event LiquidityAdded(address indexed user, address pair, uint256 liquidity);
    event LiquidityRemoved(address indexed user, address pair, uint256 amount0, uint256 amount1);

    // ─── State ────────────────────────────────────────────────────────────────
    address public immutable factory;

    constructor(address _factory) {
        factory = _factory;
    }

    // ─── Price Calculation ────────────────────────────────────────────────────

    /// @notice Get output amount given input (includes 0.3% fee)
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
        public pure returns (uint256 amountOut)
    {
        require(amountIn > 0, "PISOSwap: INSUFFICIENT_INPUT_AMOUNT");
        require(reserveIn > 0 && reserveOut > 0, "PISOSwap: INSUFFICIENT_LIQUIDITY");
        uint256 amountInWithFee = amountIn * 997;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    /// @notice Get input amount required for a given output amount
    function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut)
        public pure returns (uint256 amountIn)
    {
        require(amountOut > 0, "PISOSwap: INSUFFICIENT_OUTPUT_AMOUNT");
        require(reserveIn > 0 && reserveOut > 0, "PISOSwap: INSUFFICIENT_LIQUIDITY");
        uint256 numerator = reserveIn * amountOut * 1000;
        uint256 denominator = (reserveOut - amountOut) * 997;
        amountIn = (numerator / denominator) + 1;
    }

    /// @notice Get reserves for a token pair
    function getReserves(address tokenA, address tokenB)
        public view returns (uint256 reserveA, uint256 reserveB)
    {
        address pair = IPISOSwapFactory(factory).getPair(tokenA, tokenB);
        require(pair != address(0), "PISOSwap: PAIR_NOT_FOUND");
        (uint256 reserve0, uint256 reserve1,) = IPISOSwapPair(pair).getReserves();
        address token0 = IPISOSwapPair(pair).token0();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }

    /// @notice Quote how many tokenB you get for amountA of tokenA
    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB)
        public pure returns (uint256 amountB)
    {
        require(amountA > 0, "PISOSwap: INSUFFICIENT_AMOUNT");
        require(reserveA > 0 && reserveB > 0, "PISOSwap: INSUFFICIENT_LIQUIDITY");
        amountB = (amountA * reserveB) / reserveA;
    }

    // ─── Swap ─────────────────────────────────────────────────────────────────

    /// @notice Swap exact tokenIn for as many tokenOut as possible
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenIn,
        address tokenOut,
        address to,
        uint256 deadline
    ) external returns (uint256 amountOut) {
        require(block.timestamp <= deadline, "PISOSwap: EXPIRED");

        address pair = IPISOSwapFactory(factory).getPair(tokenIn, tokenOut);
        require(pair != address(0), "PISOSwap: PAIR_NOT_FOUND");

        (uint256 reserveIn, uint256 reserveOut) = getReserves(tokenIn, tokenOut);
        amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        require(amountOut >= amountOutMin, "PISOSwap: INSUFFICIENT_OUTPUT_AMOUNT");

        IERC20(tokenIn).transferFrom(msg.sender, pair, amountIn);

        address token0 = IPISOSwapPair(pair).token0();
        (uint256 amount0Out, uint256 amount1Out) = tokenIn == token0
            ? (uint256(0), amountOut)
            : (amountOut, uint256(0));

        IPISOSwapPair(pair).swap(amount0Out, amount1Out, to);
        emit SwapExecuted(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    // ─── Liquidity Management ─────────────────────────────────────────────────

    /// @notice Add liquidity to a token pair pool
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        require(block.timestamp <= deadline, "PISOSwap: EXPIRED");

        address pair = IPISOSwapFactory(factory).getPair(tokenA, tokenB);
        if (pair == address(0)) {
            pair = IPISOSwapFactory(factory).createPair(tokenA, tokenB);
        }

        (uint256 reserveA, uint256 reserveB) = _getReservesOrZero(tokenA, tokenB);

        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint256 amountBOptimal = quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, "PISOSwap: INSUFFICIENT_B_AMOUNT");
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint256 amountAOptimal = quote(amountBDesired, reserveB, reserveA);
                require(amountAOptimal >= amountAMin, "PISOSwap: INSUFFICIENT_A_AMOUNT");
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }

        IERC20(tokenA).transferFrom(msg.sender, pair, amountA);
        IERC20(tokenB).transferFrom(msg.sender, pair, amountB);
        liquidity = IPISOSwapPair(pair).mint(to);
        emit LiquidityAdded(msg.sender, pair, liquidity);
    }

    /// @notice Remove liquidity from a pair pool
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB) {
        require(block.timestamp <= deadline, "PISOSwap: EXPIRED");
        address pair = IPISOSwapFactory(factory).getPair(tokenA, tokenB);
        require(pair != address(0), "PISOSwap: PAIR_NOT_FOUND");

        IPISOSwapPair(pair).transferFrom(msg.sender, pair, liquidity);
        (uint256 amount0, uint256 amount1) = IPISOSwapPair(pair).burn(to);

        address token0 = IPISOSwapPair(pair).token0();
        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
        require(amountA >= amountAMin, "PISOSwap: INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "PISOSwap: INSUFFICIENT_B_AMOUNT");
        emit LiquidityRemoved(msg.sender, pair, amountA, amountB);
    }

    // ─── Internal Helpers ─────────────────────────────────────────────────────
    function _getReservesOrZero(address tokenA, address tokenB)
        internal view returns (uint256 reserveA, uint256 reserveB)
    {
        address pair = IPISOSwapFactory(factory).getPair(tokenA, tokenB);
        if (pair == address(0)) return (0, 0);
        (uint256 reserve0, uint256 reserve1,) = IPISOSwapPair(pair).getReserves();
        address token0 = IPISOSwapPair(pair).token0();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }
}
