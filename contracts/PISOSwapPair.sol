// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PISOSwapPair
 * @notice Liquidity pool AMM pair contract — constant product formula (x * y = k)
 * @dev ERC-20 LP tokens represent proportional share of pool liquidity
 *      0.3% swap fee distributed to liquidity providers
 */

interface IERC20Minimal {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract PISOSwapPair {
    // ─── ERC-20 LP Token ──────────────────────────────────────────────────────
    string public constant name = "PISOSwap LP Token";
    string public constant symbol = "PISO-LP";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // ─── Events ──────────────────────────────────────────────────────────────
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );
    event Sync(uint256 reserve0, uint256 reserve1);

    // ─── State ────────────────────────────────────────────────────────────────
    uint256 public constant MINIMUM_LIQUIDITY = 1000;
    uint256 private constant FEE_NUMERATOR = 997;    // 0.3% fee = 1 - 997/1000
    uint256 private constant FEE_DENOMINATOR = 1000;

    address public factory;
    address public token0;
    address public token1;

    uint256 private reserve0;
    uint256 private reserve1;
    uint256 private _unlocked = 1;

    bool private _initialized;

    // ─── Modifiers ───────────────────────────────────────────────────────────
    modifier lock() {
        require(_unlocked == 1, "PISOSwap: LOCKED");
        _unlocked = 0;
        _;
        _unlocked = 1;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor() {
        factory = msg.sender;
    }

    function initialize(address _token0, address _token1) external {
        require(!_initialized, "PISOSwap: ALREADY_INITIALIZED");
        require(msg.sender == factory, "PISOSwap: NOT_FACTORY");
        token0 = _token0;
        token1 = _token1;
        _initialized = true;
    }

    // ─── ERC-20 LP Functions ──────────────────────────────────────────────────
    function _mint(address to, uint256 value) internal {
        totalSupply += value;
        balanceOf[to] += value;
        emit Transfer(address(0), to, value);
    }

    function _burn(address from, uint256 value) internal {
        balanceOf[from] -= value;
        totalSupply -= value;
        emit Transfer(from, address(0), value);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        if (allowance[from][msg.sender] != type(uint256).max) {
            allowance[from][msg.sender] -= value;
        }
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }

    // ─── Reserves ─────────────────────────────────────────────────────────────
    function getReserves() public view returns (uint256 _reserve0, uint256 _reserve1, uint256 _blockTimestamp) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestamp = block.timestamp;
    }

    function _update(uint256 balance0, uint256 balance1) private {
        reserve0 = balance0;
        reserve1 = balance1;
        emit Sync(reserve0, reserve1);
    }

    // ─── Add Liquidity ────────────────────────────────────────────────────────
    function mint(address to) external lock returns (uint256 liquidity) {
        (uint256 _reserve0, uint256 _reserve1,) = getReserves();
        uint256 balance0 = IERC20Minimal(token0).balanceOf(address(this));
        uint256 balance1 = IERC20Minimal(token1).balanceOf(address(this));
        uint256 amount0 = balance0 - _reserve0;
        uint256 amount1 = balance1 - _reserve1;

        uint256 _totalSupply = totalSupply;
        if (_totalSupply == 0) {
            liquidity = _sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
            _mint(address(0xdead), MINIMUM_LIQUIDITY); // burn minimum liquidity
        } else {
            liquidity = _min(
                (amount0 * _totalSupply) / _reserve0,
                (amount1 * _totalSupply) / _reserve1
            );
        }
        require(liquidity > 0, "PISOSwap: INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(to, liquidity);
        _update(balance0, balance1);
        emit Mint(msg.sender, amount0, amount1);
    }

    // ─── Remove Liquidity ─────────────────────────────────────────────────────
    function burn(address to) external lock returns (uint256 amount0, uint256 amount1) {
        uint256 balance0 = IERC20Minimal(token0).balanceOf(address(this));
        uint256 balance1 = IERC20Minimal(token1).balanceOf(address(this));
        uint256 liquidity = balanceOf[address(this)];
        uint256 _totalSupply = totalSupply;

        amount0 = (liquidity * balance0) / _totalSupply;
        amount1 = (liquidity * balance1) / _totalSupply;
        require(amount0 > 0 && amount1 > 0, "PISOSwap: INSUFFICIENT_LIQUIDITY_BURNED");

        _burn(address(this), liquidity);
        IERC20Minimal(token0).transfer(to, amount0);
        IERC20Minimal(token1).transfer(to, amount1);
        balance0 = IERC20Minimal(token0).balanceOf(address(this));
        balance1 = IERC20Minimal(token1).balanceOf(address(this));
        _update(balance0, balance1);
        emit Burn(msg.sender, amount0, amount1, to);
    }

    // ─── Swap ──────────────────────────────────────────────────────────────────
    function swap(uint256 amount0Out, uint256 amount1Out, address to) external lock {
        require(amount0Out > 0 || amount1Out > 0, "PISOSwap: INSUFFICIENT_OUTPUT_AMOUNT");
        (uint256 _reserve0, uint256 _reserve1,) = getReserves();
        require(amount0Out < _reserve0 && amount1Out < _reserve1, "PISOSwap: INSUFFICIENT_LIQUIDITY");

        if (amount0Out > 0) IERC20Minimal(token0).transfer(to, amount0Out);
        if (amount1Out > 0) IERC20Minimal(token1).transfer(to, amount1Out);

        uint256 balance0 = IERC20Minimal(token0).balanceOf(address(this));
        uint256 balance1 = IERC20Minimal(token1).balanceOf(address(this));
        uint256 amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, "PISOSwap: INSUFFICIENT_INPUT_AMOUNT");

        // Verify k invariant with 0.3% fee
        uint256 balance0Adjusted = (balance0 * FEE_DENOMINATOR) - (amount0In * 3);
        uint256 balance1Adjusted = (balance1 * FEE_DENOMINATOR) - (amount1In * 3);
        require(
            balance0Adjusted * balance1Adjusted >= _reserve0 * _reserve1 * (FEE_DENOMINATOR ** 2),
            "PISOSwap: K_INVARIANT_VIOLATED"
        );

        _update(balance0, balance1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    function _sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint256 x, uint256 y) internal pure returns (uint256) {
        return x < y ? x : y;
    }
}
