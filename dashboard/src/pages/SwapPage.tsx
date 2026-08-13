import { useState, useEffect } from 'react'
import { useWallet, callJsonRpc } from '../services/web3'
import BentoCard from '../components/ui/BentoCard'

const TOKENS = [
  { symbol: 'PISO', name: 'PISO Native Token', logo: '₱', balance: '1,000.00', decimals: 18 },
  { symbol: 'USDT', name: 'Tether USD', logo: '₮', balance: '500.00', decimals: 6 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', logo: '₿', balance: '0.025', decimals: 8 },
  { symbol: 'ETH', name: 'Wrapped Ether', logo: 'Ξ', balance: '0.50', decimals: 18 },
]

const RATES: Record<string, number> = {
  'PISO_USDT': 0.05,
  'USDT_PISO': 20.0,
  'PISO_WBTC': 0.0000008,
  'WBTC_PISO': 1250000,
  'PISO_ETH': 0.000015,
  'ETH_PISO': 66666,
  'USDT_WBTC': 0.000016,
  'WBTC_USDT': 62500,
  'USDT_ETH': 0.0003,
  'ETH_USDT': 3333,
  'WBTC_ETH': 18.5,
  'ETH_WBTC': 0.054,
}

export default function SwapPage() {
  const { wallet, balance: pisoBalance, refreshBalance } = useWallet()

  const [fromToken, setFromToken] = useState('PISO')
  const [toToken, setToToken] = useState('USDT')
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('0.0')
  const [slippage, setSlippage] = useState('0.5')
  
  const [swapConsole, setSwapConsole] = useState('')
  const [loading, setLoading] = useState(false)

  // Calculate dynamic quote output
  useEffect(() => {
    const val = parseFloat(amountIn)
    if (!val || val <= 0 || fromToken === toToken) {
      setAmountOut('0.0')
      return
    }

    const pairKey = `${fromToken}_${toToken}`
    const rate = RATES[pairKey] || 1.0
    const estimated = val * rate
    setAmountOut(estimated.toFixed(fromToken === 'WBTC' || toToken === 'WBTC' ? 8 : 4))
  }, [amountIn, fromToken, toToken])

  const handleFlip = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setAmountIn('')
    setAmountOut('0.0')
  }

  const handleExecuteSwap = async () => {
    if (!wallet) {
      alert('⚠️ Please generate or import a wallet in Wallet Studio first!')
      return
    }

    const val = parseFloat(amountIn)
    if (!val || val <= 0) {
      alert('Please enter a valid swap amount.')
      return
    }

    setLoading(true)
    setSwapConsole('⏳ [PISOSwapRouter] Initializing token routing calculations...')
    
    try {
      // Mock execution timing & console progression
      await new Promise(r => setTimeout(r, 800))
      setSwapConsole((c) => c + `\n🔐 [ERC-20] Checking spender allowance for PISOSwapRouter.sol (0x...2002)...`)
      
      await new Promise(r => setTimeout(r, 800))
      setSwapConsole((c) => c + `\n🔐 [ERC-20] Sending transaction to approve spending of ${amountIn} ${fromToken}...`)
      
      await new Promise(r => setTimeout(r, 1000))
      const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      setSwapConsole((c) => c + `\n✓ Spender approved! Tx Hash: ${txHash.slice(0, 18)}...`)
      
      await new Promise(r => setTimeout(r, 600))
      setSwapConsole((c) => c + `\n🔄 [PISOSwapRouter] Swapping ${amountIn} ${fromToken} for ~${amountOut} ${toToken}...`)
      
      await new Promise(r => setTimeout(r, 1200))
      const swapTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      setSwapConsole(
        (c) =>
          c +
          `\n\n✅ SWAP TRANSACTION CONFIRMED ON PISO CHAIN!\n\n` +
          `Tx Hash:       ${swapTxHash}\n` +
          `From Wallet:   ${wallet.address}\n` +
          `Token In:      -${val} ${fromToken}\n` +
          `Token Out:     +${amountOut} ${toToken}\n` +
          `Gas Limit:     120,000 (Sponsored by Paymaster)\n` +
          `Status:        Success in Block #${1250 + Math.floor(Math.random() * 20)}`
      )

      refreshBalance()
    } catch (err: any) {
      setSwapConsole((c) => c + `\n❌ Swap execution failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Get active balances for display
  const getDisplayBalance = (tokenSymbol: string) => {
    if (tokenSymbol === 'PISO') {
      return wallet ? pisoBalance.split(' ')[0] : '0.00'
    }
    const token = TOKENS.find(t => t.symbol === tokenSymbol)
    return token ? token.balance : '0.00'
  }

  const currentPairKey = `${fromToken}_${toToken}`
  const currentRate = RATES[currentPairKey] || 1.0
  const minReceived = (parseFloat(amountOut) * (1 - parseFloat(slippage) / 100)).toFixed(
    fromToken === 'WBTC' || toToken === 'WBTC' ? 8 : 4
  )

  return (
    <div className="space-y-5 slide-in-up">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-black text-white">🔀 PISOSwap DEX Studio</h2>
        <p className="text-slate-400 text-sm mt-1">
          Automated Market Maker (AMM) token swap router for native and wrapped PISO assets
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 items-start">
        {/* Left: Swap Card */}
        <div className="lg:col-span-6 max-w-lg mx-auto w-full">
          <BentoCard accentColor="#3b82f6">
            <div className="space-y-4">
              {/* FROM Input */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="font-semibold">Swap From</span>
                  <span className="font-mono">Balance: {getDisplayBalance(fromToken)}</span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={fromToken}
                    onChange={(e) => {
                      setFromToken(e.target.value)
                      if (e.target.value === toToken) {
                        setToToken(fromToken)
                      }
                    }}
                    className="piso-input flex-shrink-0 w-28 text-white font-bold"
                  >
                    {TOKENS.map((t) => (
                      <option key={t.symbol} value={t.symbol}>
                        {t.logo} {t.symbol}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                    className="piso-input flex-1 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Flip Divider */}
              <div className="flex justify-center -my-1">
                <button
                  onClick={handleFlip}
                  className="w-10 h-10 rounded-xl bg-dark-700 border border-card-border hover:bg-dark-600 text-slate-300 text-lg hover:rotate-180 transition-transform duration-300 flex items-center justify-center font-bold"
                >
                  ⇅
                </button>
              </div>

              {/* TO Input */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="font-semibold">Swap To</span>
                  <span className="font-mono">Balance: {getDisplayBalance(toToken)}</span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={toToken}
                    onChange={(e) => {
                      setToToken(e.target.value)
                      if (e.target.value === fromToken) {
                        setFromToken(toToken)
                      }
                    }}
                    className="piso-input flex-shrink-0 w-28 text-white font-bold"
                  >
                    {TOKENS.map((t) => (
                      <option key={t.symbol} value={t.symbol}>
                        {t.logo} {t.symbol}
                      </option>
                    ))}
                  </select>
                  <div className="piso-input flex-1 font-mono text-slate-400 font-bold bg-dark-900 border border-card-border flex items-center">
                    {amountOut}
                  </div>
                </div>
              </div>

              {/* Slippage Chip Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs text-slate-400 font-semibold block">Slippage Tolerance</label>
                <div className="flex gap-2">
                  {['0.1', '0.5', '1.0'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlippage(s)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        slippage === s
                          ? 'bg-blue-500/20 border border-blue-500 text-blue-300'
                          : 'bg-dark-700 border border-card-border text-slate-500 hover:text-white'
                      }`}
                    >
                      {s}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleExecuteSwap}
                disabled={loading}
                className="btn w-full text-sm font-bold text-white py-3.5"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                {loading ? '⏳ Swap in Progress...' : `🔀 Execute Swap`}
              </button>

              {/* Info Details */}
              <div className="text-[11px] text-slate-500 p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Routing Rate:</span>
                  <span className="text-white font-bold">1 {fromToken} ≈ {currentRate} {toToken}</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Received:</span>
                  <span className="text-white font-bold">{amountIn ? minReceived : '0.0'} {toToken}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paymaster Sponsored:</span>
                  <span className="text-emerald-400 font-bold">100% Free Gas (EIP-4337)</span>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Right: Console Output */}
        <div className="lg:col-span-6 w-full space-y-4">
          <BentoCard accentColor="#8b5cf6">
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base">💻 Liquidity Router Logs</h3>
              <div
                className="output-box font-mono text-xs leading-relaxed border border-purple-500/20 min-h-[220px]"
                style={{ color: '#38bdf8' }}
              >
                {swapConsole ||
                  `📈 [PISOSwapRouter Connected]
Router:   PISOSwapRouter.sol (0x0000000000000000000000000000000000002002)
Factory:  PISOSwapFactory.sol (0x0000000000000000000000000000000000002001)
Pool:     Active PISO/USDT constant product pool (k = x * y)
Status:   Connected. Enter amounts to simulate a swap transaction.`}
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  )
}
