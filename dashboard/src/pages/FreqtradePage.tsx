import { useState } from 'react'
import BentoCard from '../components/ui/BentoCard'
import KpiCard from '../components/ui/KpiCard'

export default function FreqtradePage() {
  const [botStatus, setBotStatus] = useState<'Running' | 'Stopped'>('Running')
  const [log, setLog] = useState('📈 Freqtrade Algorithmic Trading Bot initialized.\nStrategy: PISOStrategy (EVM On-Chain Oracle Feed)\nMode: Dry-Run (Virtual Escrow)\nListening to RPC socket for trade triggers...')

  const toggleBot = () => {
    if (botStatus === 'Running') {
      setBotStatus('Stopped')
      setLog((l) => l + '\n⏸️ Bot execution paused by operator.')
    } else {
      setBotStatus('Running')
      setLog((l) => l + '\n▶️ Bot execution resumed. Scanning order books...')
    }
  }

  const triggerTrade = () => {
    setLog((l) => l + `\n\n⚡ Signal Detected: BUY PISO/USDT\n  • Entry Price: $0.0825\n  • Stop-Loss: $0.0790 (-4.2%)\n  • Take-Profit: $0.0950 (+15.1%)\n  • Cryptographic Proof: PISOFreqtradeOracle.sol (0x...100A)`)
  }

  return (
    <div className="space-y-5 slide-in-up">
      <div>
        <h2 className="text-2xl font-black text-white">📈 Freqtrade Algorithmic Trading Bot</h2>
        <p className="text-slate-400 text-sm mt-1">
          Automated Web3 trading engine executing strategy signals on-chain via PISOFreqtradeOracle.sol
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="Bot Status" value={botStatus} icon="🤖" highlightColor={botStatus === 'Running' ? '#10b981' : '#ef4444'} />
        <KpiCard title="Strategy" value="PISOStrategy" icon="🧠" highlightColor="#3b82f6" />
        <KpiCard title="Win Rate (24h)" value="78.4%" icon="🎯" highlightColor="#ffd700" />
        <KpiCard title="Profit / Loss" value="+14.8%" icon="💰" highlightColor="#10b981" />
      </div>

      <BentoCard accentColor="#10b981">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-base">Bot Control & Console</h3>
              <p className="text-xs text-slate-400">Target Exchange: PISOSwap DEX & Binance API</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleBot}
                className={`btn text-xs font-bold text-white px-4 ${botStatus === 'Running' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              >
                {botStatus === 'Running' ? '⏹ Stop Bot' : '▶️ Start Bot'}
              </button>
              <button onClick={triggerTrade} className="btn btn-primary-blue text-xs px-4">
                ⚡ Execute Trade Test
              </button>
            </div>
          </div>

          <div className="output-box font-mono text-xs leading-relaxed" style={{ color: '#34d399' }}>
            {log}
          </div>
        </div>
      </BentoCard>
    </div>
  )
}
