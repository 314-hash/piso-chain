/**
 * PISO Chain — PISOSwap DEX Frontend Integration
 * Connects to PISOSwapRouter for 1-click token swaps
 */

// ─── Contract Addresses (PISO Chain local / Vercel) ──────────────────────────
const PISOSWAP_ADDRESSES = {
    factory:  '0x0000000000000000000000000000000000002001',
    router:   '0x0000000000000000000000000000000000002002',
    mockUSDT: '0x0000000000000000000000000000000000002003',
    pisoToken:'0x0000000000000000000000000000000000001000', // Native PISO ERC-20 wrapper
};

// ─── ABIs ─────────────────────────────────────────────────────────────────────
const ROUTER_ABI = [
    "function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) pure returns (uint256)",
    "function getReserves(address tokenA, address tokenB) view returns (uint256, uint256)",
    "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address tokenIn, address tokenOut, address to, uint256 deadline) returns (uint256)",
    "function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256, uint256, uint256)",
    "function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256, uint256)"
];

const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)"
];

// ─── Token Registry ──────────────────────────────────────────────────────────
const SWAP_TOKENS = {
    PISO: { address: PISOSWAP_ADDRESSES.pisoToken, symbol: 'PISO', decimals: 18, icon: '🪙' },
    USDT: { address: PISOSWAP_ADDRESSES.mockUSDT,  symbol: 'USDT', decimals: 6,  icon: '💵' },
};

// ─── State ────────────────────────────────────────────────────────────────────
let swapState = {
    tokenIn: 'PISO',
    tokenOut: 'USDT',
    amountIn: '',
    amountOut: '',
    slippage: 0.5, // 0.5%
    provider: null,
    signer: null,
    routerContract: null,
};

// ─── Init ─────────────────────────────────────────────────────────────────────
async function initSwap() {
    if (typeof window.ethers === 'undefined') {
        console.warn('[PISOSwap] ethers.js not loaded');
        return;
    }
    if (window.ethereum) {
        swapState.provider = new ethers.BrowserProvider(window.ethereum);
        try {
            swapState.signer = await swapState.provider.getSigner();
            swapState.routerContract = new ethers.Contract(
                PISOSWAP_ADDRESSES.router,
                ROUTER_ABI,
                swapState.signer
            );
        } catch (e) {
            console.warn('[PISOSwap] Wallet not connected:', e.message);
        }
    }
}

// ─── Price Quote ──────────────────────────────────────────────────────────────
async function getSwapQuote(amountIn, tokenIn, tokenOut) {
    if (!swapState.provider || !amountIn || amountIn <= 0) return '0';
    try {
        const tokenInInfo = SWAP_TOKENS[tokenIn];
        const tokenOutInfo = SWAP_TOKENS[tokenOut];
        const router = new ethers.Contract(PISOSWAP_ADDRESSES.router, ROUTER_ABI, swapState.provider);
        const [reserveIn, reserveOut] = await router.getReserves(tokenInInfo.address, tokenOutInfo.address);
        const amountInWei = ethers.parseUnits(amountIn.toString(), tokenInInfo.decimals);
        const amountOutWei = await router.getAmountOut(amountInWei, reserveIn, reserveOut);
        return ethers.formatUnits(amountOutWei, tokenOutInfo.decimals);
    } catch (e) {
        console.warn('[PISOSwap] Quote failed:', e.message);
        // Fallback mock price (1 PISO = 0.05 USDT)
        const mockRate = tokenIn === 'PISO' ? 0.05 : 20;
        return (parseFloat(amountIn) * mockRate).toFixed(6);
    }
}

// ─── Execute Swap ─────────────────────────────────────────────────────────────
async function executeSwap() {
    const amountIn = parseFloat(document.getElementById('swap-amount-in')?.value || '0');
    if (!amountIn || amountIn <= 0) {
        showSwapStatus('⚠️ Please enter an amount', 'warning');
        return;
    }
    if (!swapState.signer) {
        showSwapStatus('🦊 Please connect your wallet first!', 'warning');
        return;
    }

    showSwapStatus('⏳ Preparing swap...', 'loading');
    try {
        const tokenInInfo = SWAP_TOKENS[swapState.tokenIn];
        const tokenOutInfo = SWAP_TOKENS[swapState.tokenOut];
        const amountInWei = ethers.parseUnits(amountIn.toString(), tokenInInfo.decimals);
        const quote = await getSwapQuote(amountIn, swapState.tokenIn, swapState.tokenOut);
        const amountOutMin = ethers.parseUnits(
            (parseFloat(quote) * (1 - swapState.slippage / 100)).toFixed(tokenOutInfo.decimals),
            tokenOutInfo.decimals
        );
        const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 min

        // Approve router to spend tokenIn
        const tokenContract = new ethers.Contract(tokenInInfo.address, ERC20_ABI, swapState.signer);
        showSwapStatus('🔐 Approving token spend...', 'loading');
        const approveTx = await tokenContract.approve(PISOSWAP_ADDRESSES.router, amountInWei);
        await approveTx.wait();

        // Execute swap
        showSwapStatus('🔄 Executing swap on PISO Chain...', 'loading');
        const swapTx = await swapState.routerContract.swapExactTokensForTokens(
            amountInWei, amountOutMin, tokenInInfo.address, tokenOutInfo.address,
            await swapState.signer.getAddress(), deadline
        );
        const receipt = await swapTx.wait();
        showSwapStatus(`✅ Swap complete! Tx: ${receipt.hash.slice(0, 10)}...`, 'success');
        updateSwapQuoteDisplay();
    } catch (e) {
        console.error('[PISOSwap] Swap failed:', e);
        showSwapStatus(`❌ Swap failed: ${e.message?.slice(0, 60)}`, 'error');
    }
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function showSwapStatus(msg, type) {
    const el = document.getElementById('swap-status');
    if (!el) return;
    const colors = { loading: '#a855f7', success: '#10b981', error: '#ef4444', warning: '#f59e0b' };
    el.style.color = colors[type] || '#fff';
    el.textContent = msg;
}

async function updateSwapQuoteDisplay() {
    const amountIn = parseFloat(document.getElementById('swap-amount-in')?.value || '0');
    const quoteEl = document.getElementById('swap-amount-out');
    if (!quoteEl || !amountIn) return;
    quoteEl.value = 'Calculating...';
    const quote = await getSwapQuote(amountIn, swapState.tokenIn, swapState.tokenOut);
    quoteEl.value = parseFloat(quote).toFixed(6);
}

function flipSwapTokens() {
    [swapState.tokenIn, swapState.tokenOut] = [swapState.tokenOut, swapState.tokenIn];
    document.getElementById('swap-token-in-label').textContent =
        `${SWAP_TOKENS[swapState.tokenIn].icon} ${swapState.tokenIn}`;
    document.getElementById('swap-token-out-label').textContent =
        `${SWAP_TOKENS[swapState.tokenOut].icon} ${swapState.tokenOut}`;
    updateSwapQuoteDisplay();
}

function setSlippage(val) {
    swapState.slippage = val;
    document.querySelectorAll('.slip-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`slip-${val}`)?.classList.add('active');
}

// ─── Auto-Init ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initSwap();
    document.getElementById('swap-amount-in')?.addEventListener('input', () => {
        clearTimeout(window._swapDebounce);
        window._swapDebounce = setTimeout(updateSwapQuoteDisplay, 400);
    });
});
