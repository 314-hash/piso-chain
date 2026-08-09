import { useState } from 'react'
import BentoCard from '../components/ui/BentoCard'

const tokens = [
  { symbol: 'PISO', name: 'PISO Chain', balance: '1,000.00', logo: '₱' },
  { symbol: 'USDT', name: 'Tether USD', balance: '500.00', logo: '₮' },
  { symbol: 'WBTC', name: 'Wrapped BTC', balance: '0.025', logo: '₿' },
  { symbol: 'ETH', name: 'Wrapped ETH', balance: '0.5', logo: 'Ξ' },
]

export default function SwapPage() {
  const [fromToken, setFromToken] = useState('PISO')
  const [toToken, setToToken] = useState('USDT')
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState('0.5')

  return (
    <div className="space-y-5 slide-in-up">
      <div>
        <h2 className="text-2xl font-black text-white">🔀 PISOSwap DEX</h2>
        <p className="text-slate-400 text-sm mt-1">Decentralized token swaps on PISO Chain L1 with zero gas fees</p>
      </div>

      <div className="max-w-md mx-auto">
        <BentoCard accentColor="#3b82f6">
          <div className="space-y-4">
            {/* From */}
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">From</label>
              <div className="flex gap-2">
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="piso-input flex-shrink-0 w-28"
                >
                  {tokens.map((t) => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
                </select>
                <input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="piso-input flex-1"
                />
              </div>
            </div>

            {/* Flip button */}
            <div className="flex justify-center">
              <button
                className="w-10 h-10 rounded-xl bg-dark-700 border border-card-border text-xl hover:rotate-180 transition-transform duration-300 flex items-center justify-center"
                onClick={() => { setFromToken(toToken); setToToken(fromToken) }}
              >
                ⇅
              </button>
            </div>

            {/* To */}
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">To</label>
              <div className="flex gap-2">
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="piso-input flex-shrink-0 w-28"
                >
                  {tokens.map((t) => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
                </select>
                <div className="piso-input flex-1 text-slate-500">
                  {amount ? (parseFloat(amount) * 0.9823).toFixed(4) : '0.0'}
                </div>
              </div>
            </div>

            {/* Slippage */}
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Slippage Tolerance</label>
              <div className="flex gap-2">
                {['0.1', '0.5', '1.0'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlippage(s)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${slippage === s ? 'bg-accent-blue/30 border border-accent-blue text-blue-300' : 'bg-dark-700 border border-card-border text-slate-500 hover:text-white'}`}
                  >
                    {s}%
                  </button>
                ))}
              </div>
            </div>

            {/* Swap button */}
            <button
              className="btn w-full text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              onClick={() => alert('Please connect wallet to swap.')}
            >
              🔀 Swap {fromToken} → {toToken}
            </button>

            {/* Info */}
            <div className="text-xs text-slate-600 text-center">
              Price impact: &lt;0.01% • Fee: 0.25% • Route: Direct
            </div>
          </div>
        </BentoCard>
      </div>

      <div className="text-center">
        <a href="../swap.html" className="btn btn-primary-blue text-sm">
          🔗 Open Full PISOSwap DEX (swap.html)
        </a>
      </div>
    </div>
  )
}
