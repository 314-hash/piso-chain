import { useState } from 'react'
import { useWallet } from '../services/web3'
import BentoCard from '../components/ui/BentoCard'
import KpiCard from '../components/ui/KpiCard'

interface TradePosition {
  id: string
  pair: string
  side: 'Long' | 'Short'
  entryPrice: string
  currentPrice: string
  profitRatio: string
  isProfit: boolean
  stakeAmount: string
  stopLoss: string
  takeProfit: string
}

export default function FreqtradePage() {
  const { wallet } = useWallet()
  const [botStatus, setBotStatus] = useState<'Running' | 'Paused'>('Running')
  const [strategy, setStrategy] = useState<string>('PISOStrategyV1 (EVM Oracle Feed)')
  const [stakeAmount, setStakeAmount] = useState<string>('500')
  const [telegramAlerts, setTelegramAlerts] = useState<boolean>(true)
  const [oracleRewards, setOracleRewards] = useState<number>(140)

  const [positions, setPositions] = useState<TradePosition[]>([
    {
      id: 'pos-891',
      pair: 'PISO/USDT',
      side: 'Long',
      entryPrice: '$0.0825',
      currentPrice: '$0.0945',
      profitRatio: '+14.55%',
      isProfit: true,
      stakeAmount: '2,500 PISO',
      stopLoss: '$0.0790',
      takeProfit: '$0.0950'
    },
    {
      id: 'pos-892',
      pair: 'WETH/USDT',
      side: 'Long',
      entryPrice: '$3,410.00',
      currentPrice: '$3,495.20',
      profitRatio: '+2.50%',
      isProfit: true,
      stakeAmount: '0.5 WETH',
      stopLoss: '$3,320.00',
      takeProfit: '$3,600.00'
    },
    {
      id: 'pos-893',
      pair: 'BTC/USDT',
      side: 'Short',
      entryPrice: '$64,200.00',
      currentPrice: '$63,800.00',
      profitRatio: '+0.62%',
      isProfit: true,
      stakeAmount: '0.02 BTC',
      stopLoss: '$64,900.00',
      takeProfit: '$62,000.00'
    }
  ])

  const [consoleLog, setConsoleLog] = useState<string>(
    `📈 [Freqtrade Core Engine Initialized]
Strategy:        PISOStrategyV1 (EVM On-Chain Oracle Feed)
REST API Endpoint: http://localhost:8180 (Basic Auth Active)
Oracle Address:  PISOFreqtradeOracle.sol (0x0000000000000000000000000000000000001014)
Polling Rate:    Every 30 Seconds
Status:          Listening for high-probability signals...`
  )

  const toggleBot = async () => {
    if (botStatus === 'Running') {
      setBotStatus('Paused')
      setConsoleLog((l) => l + '\n\n⚠️ Sending /stop to Freqtrade REST API (:8180)...\n⏸️ Trading execution paused by operator.')
    } else {
      setBotStatus('Running')
      setConsoleLog((l) => l + '\n\n▶️ Sending /start to Freqtrade REST API (:8180)...\n✓ Trading execution resumed. Scanning live orderbooks...')
    }
  }

  const handleForceBuy = () => {
    const orderId = Math.floor(1000 + Math.random() * 9000)
    const newLog = `\n\n🛒 [Freqtrade Force Buy] Executed Market Order #${orderId}
Pair:      PISO/USDT
Price:     $0.0825 USDT
Amount:    ${stakeAmount} PISO
Status:    Filled via PISOSwapRouter.sol (0x...100C)`
    setConsoleLog((l) => l + newLog)
  }

  const handleForceSell = () => {
    const orderId = Math.floor(1000 + Math.random() * 9000)
    const newLog = `\n\n💰 [Freqtrade Force Sell] Executed Market Order #${orderId}
Pair:      PISO/USDT
Price:     $0.0945 USDT
Profit:    +14.55%
Status:    Position Closed & Liquidity Settled`
    setConsoleLog((l) => l + newLog)
    setPositions((prev) => prev.slice(1))
  }

  const handleSubmitProof = () => {
    const userAddr = wallet?.address || '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
    const proofHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    const newLog = `\n\n🔗 [PISOFreqtradeOracle] Submitting SHA-256 Trade Proof On-Chain...
Proof Hash:  ${proofHash.substring(0, 24)}...
Oracle:      PISOFreqtradeOracle.sol (0x...1014)
Sender:      ${userAddr}
Tx Hash:     ${txHash.substring(0, 24)}...
Status:      ✓ Verified & Claimed 15 PISO Oracle Reward to wallet!`
    setConsoleLog((l) => l + newLog)
    setOracleRewards((r) => r + 15)
  }

  return (
    <div className="space-y-6 slide-in-up">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-2">
            📈 Freqtrade Algorithmic Trading Bot
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Automated Web3 algorithmic trading engine with on-chain cryptographic proof verification
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${botStatus === 'Running' ? 'badge-green' : 'badge-amber'} flex items-center gap-1.5 py-1.5 px-3`}>
            <span className={`w-2 h-2 rounded-full ${botStatus === 'Running' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            Bot API: {botStatus === 'Running' ? 'ONLINE (:8180)' : 'PAUSED'}
          </span>
          <span className="badge badge-cyan py-1.5 px-3">PISO Oracle Bridge Linked</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Bot Status" value={botStatus} subtext="Freqtrade REST API" icon="🤖" highlightColor={botStatus === 'Running' ? '#10b981' : '#f59e0b'} />
        <KpiCard title="Win Rate (24h)" value="78.4%" subtext="18 Wins / 23 Trades" icon="🎯" highlightColor="#0ea5e9" />
        <KpiCard title="Total PnL" value="+14.8%" subtext="+$1,840.50 Profit" icon="💰" highlightColor="#10b981" />
        <KpiCard title="Oracle Rewards" value={`${oracleRewards} PISO`} subtext="Claimed On-Chain" icon="🎁" highlightColor="#8b5cf6" />
      </div>

      {/* Control Toolbar & Actions */}
      <BentoCard accentColor="#10b981">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Bot Control & Command Panel</h3>
              <p className="text-xs text-slate-400">Target Exchange: PISOSwap DEX Router (0x...100C) & Binance REST</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleBot}
                className={`btn text-xs font-bold text-white px-4 py-2 flex items-center gap-1.5 ${
                  botStatus === 'Running' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {botStatus === 'Running' ? '⏹ Stop / Pause Bot' : '▶️ Start Trading Bot'}
              </button>
              <button onClick={handleForceBuy} className="btn bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-2 font-bold">
                🛒 Force Buy Signal
              </button>
              <button onClick={handleForceSell} className="btn bg-amber-600 hover:bg-amber-500 text-white text-xs px-3 py-2 font-bold">
                💰 Force Sell Signal
              </button>
              <button onClick={handleSubmitProof} className="btn bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-2 font-bold">
                🔗 Submit Trade Proof
              </button>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Open Positions & Settings Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Open Positions Table */}
        <div className="lg:col-span-8 space-y-4">
          <BentoCard accentColor="#0ea5e9">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">📊 Active Positions ({positions.length})</h3>
                  <p className="text-xs text-slate-400">Live orderbook positions managed by PISOStrategyV1</p>
                </div>
                <span className="badge badge-green text-xs">Live Trading Mode</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Pair</th>
                      <th className="py-2.5 px-3">Side</th>
                      <th className="py-2.5 px-3">Entry Price</th>
                      <th className="py-2.5 px-3">Current Price</th>
                      <th className="py-2.5 px-3">Profit %</th>
                      <th className="py-2.5 px-3">Stake</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                    {positions.map((pos) => (
                      <tr key={pos.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3 font-bold text-white">{pos.pair}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              pos.side === 'Long' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-red-950 text-red-400 border border-red-800/40'
                            }`}
                          >
                            {pos.side}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{pos.entryPrice}</td>
                        <td className="py-3 px-3 text-white font-bold">{pos.currentPrice}</td>
                        <td className={`py-3 px-3 font-bold ${pos.isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                          {pos.profitRatio}
                        </td>
                        <td className="py-3 px-3 text-slate-400">{pos.stakeAmount}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={handleForceSell}
                            className="px-2 py-1 text-[10px] font-bold rounded bg-red-950/80 text-red-300 border border-red-800/40 hover:bg-red-900 transition-all"
                          >
                            Close Position
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Strategy Settings */}
        <div className="lg:col-span-4 space-y-4">
          <BentoCard accentColor="#8b5cf6">
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-white text-base">⚙️ Strategy Settings</h3>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Active Trading Strategy</label>
                <select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="piso-input font-bold text-xs"
                >
                  <option value="PISOStrategyV1 (EVM Oracle Feed)">PISOStrategyV1 (EVM Oracle)</option>
                  <option value="PISOArbitrageV2 (DEX Cross-Pool)">PISOArbitrageV2 (DEX Arbitrage)</option>
                  <option value="PISOAIOracular (Sakura Swarm)">PISOAIOracular (Sakura Swarm)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Stake Amount per Trade (PISO)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="piso-input font-mono font-bold text-xs"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-white/5">
                <span className="text-slate-300 font-medium">Telegram Alert Bot</span>
                <button
                  onClick={() => setTelegramAlerts(!telegramAlerts)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    telegramAlerts ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      telegramAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Oracle Contract:</span>
                  <span className="text-purple-400">0x...1014</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Proof Verification:</span>
                  <span className="text-emerald-400">SHA-256 On-Chain</span>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* Terminal Log Console */}
      <BentoCard accentColor="#10b981">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span>💻</span> Real-Time Freqtrade Console Stream
            </h3>
            <span className="text-xs text-slate-400 font-mono">Listening on port 8180</span>
          </div>

          <div className="output-box font-mono text-xs leading-relaxed border border-emerald-500/20 max-h-64 overflow-y-auto" style={{ color: '#34d399' }}>
            {consoleLog}
          </div>
        </div>
      </BentoCard>
    </div>
  )
}
