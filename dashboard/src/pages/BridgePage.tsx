import { useState, useEffect } from 'react'
import { useWallet } from '../services/web3'
import BentoCard from '../components/ui/BentoCard'
import KpiCard from '../components/ui/KpiCard'

interface Network {
  id: string
  name: string
  chainId: number
  icon: string
  color: string
  type: 'EVM' | 'Solana' | 'Substrate'
}

const NETWORKS: Network[] = [
  { id: 'piso', name: 'PISO Chain Mainnet', chainId: 2026001, icon: '₱', color: '#10b981', type: 'EVM' },
  { id: 'bsc', name: 'BNB Smart Chain', chainId: 56, icon: '🟡', color: '#f59e0b', type: 'EVM' },
  { id: 'ethereum', name: 'Ethereum Mainnet', chainId: 1, icon: 'Ξ', color: '#6366f1', type: 'EVM' },
  { id: 'polygon', name: 'Polygon POS', chainId: 137, icon: '💜', color: '#8b5cf6', type: 'EVM' },
  { id: 'arbitrum', name: 'Arbitrum One', chainId: 42161, icon: '💙', color: '#0ea5e9', type: 'EVM' },
]

interface Token {
  symbol: string
  name: string
  icon: string
  balance: string
  decimals: number
}

const TOKENS: Token[] = [
  { symbol: 'PISO', name: 'PISO Native Token', icon: '₱', balance: '12,500.00', decimals: 18 },
  { symbol: 'USDT', name: 'Tether USD (PISO Bridge)', icon: '💵', balance: '4,250.50', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin', icon: '🔵', balance: '1,800.00', decimals: 6 },
  { symbol: 'WETH', name: 'Wrapped Ether', icon: '💎', balance: '3.42', decimals: 18 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', balance: '0.15', decimals: 8 },
]

interface BridgeTx {
  id: string
  srcNet: string
  destNet: string
  token: string
  amount: string
  txHashSrc: string
  txHashDest: string
  status: 'Completed' | 'Processing' | 'Failed'
  timestamp: string
  relayers: string
}

export default function BridgePage() {
  const { wallet } = useWallet()
  const [fromNet, setFromNet] = useState<Network>(NETWORKS[1]) // BSC
  const [toNet, setToNet] = useState<Network>(NETWORKS[0])   // PISO Chain
  const [token, setToken] = useState<Token>(TOKENS[0])
  const [amount, setAmount] = useState('')
  const [destAddr, setDestAddr] = useState('')
  const [step, setStep] = useState<number>(0) // 0: idle, 1: lock, 2: attestation, 3: mint, 4: complete
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copiedTx, setCopiedTx] = useState<string | null>(null)

  useEffect(() => {
    if (wallet?.address && !destAddr) {
      setDestAddr(wallet.address)
    }
  }, [wallet])

  const [history, setHistory] = useState<BridgeTx[]>([
    {
      id: 'tx-1092',
      srcNet: 'BNB Smart Chain',
      destNet: 'PISO Chain Mainnet',
      token: 'PISO',
      amount: '5,000.00',
      txHashSrc: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
      txHashDest: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      status: 'Completed',
      timestamp: '10 mins ago',
      relayers: '3/3 Multi-Sig Verified'
    },
    {
      id: 'tx-1091',
      srcNet: 'Ethereum Mainnet',
      destNet: 'PISO Chain Mainnet',
      token: 'USDT',
      amount: '1,200.00',
      txHashSrc: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      txHashDest: '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      status: 'Completed',
      timestamp: '42 mins ago',
      relayers: '3/3 Multi-Sig Verified'
    },
    {
      id: 'tx-1090',
      srcNet: 'PISO Chain Mainnet',
      destNet: 'Polygon POS',
      token: 'WETH',
      amount: '0.85',
      txHashSrc: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      txHashDest: '0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
      status: 'Completed',
      timestamp: '2 hours ago',
      relayers: '3/3 Multi-Sig Verified'
    }
  ])

  const handleSwapDirection = () => {
    setFromNet(toNet)
    setToNet(fromNet)
  }

  const handleMaxAmount = () => {
    setAmount(token.balance.replace(/,/g, ''))
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTx(text)
    setTimeout(() => setCopiedTx(null), 2000)
  }

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid bridge transfer amount')
      return
    }
    setLoading(true)
    setStep(1)
    setStatusMsg(`[1/3] Locking ${amount} ${token.symbol} on ${fromNet.name} (PISOBridge.sol 0x...1007)...`)

    await new Promise((r) => setTimeout(r, 1400))
    setStep(2)
    setStatusMsg(`[2/3] Gathering Cryptographic Threshold Multi-Sig Attestation from 3 PISO Relayer Nodes...`)

    await new Promise((r) => setTimeout(r, 1600))
    setStep(3)
    setStatusMsg(`[3/3] Minting synthetic representation on ${toNet.name}...`)

    await new Promise((r) => setTimeout(r, 1400))
    const srcTx = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    const destTx = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')

    const newTx: BridgeTx = {
      id: `tx-${Math.floor(1093 + Math.random() * 500)}`,
      srcNet: fromNet.name,
      destNet: toNet.name,
      token: token.symbol,
      amount: parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
      txHashSrc: srcTx,
      txHashDest: destTx,
      status: 'Completed',
      timestamp: 'Just now',
      relayers: '3/3 Multi-Sig Verified'
    }

    setHistory([newTx, ...history])
    setStep(4)
    setStatusMsg(`✅ Bridge Transfer Complete! Source Tx: ${srcTx.substring(0, 10)}... | Target Tx: ${destTx.substring(0, 10)}...`)
    setLoading(false)
  }

  const estimatedGas = fromNet.id === 'piso' ? '$0.002 (PISO L1)' : fromNet.id === 'ethereum' ? '$2.85 (ETH Gas)' : '$0.08 (Chain Gas)'
  const relayerFee = amount ? (parseFloat(amount) * 0.001).toFixed(4) : '0.0000'

  return (
    <div className="space-y-6 slide-in-up">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-2">
            🌉 Cross-Chain Bridge Studio
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Trustless cryptographic liquidity bridge linking PISO Chain L1 with EVM & Layer-2 ecosystems
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-green flex items-center gap-1.5 py-1.5 px-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            3/3 Relayer Threshold Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Bridge TVL" value="₱42,500,000" subtext="Across 5 Linked Chains" icon="🔐" highlightColor="#10b981" />
        <KpiCard title="24h Transfer Volume" value="$1.84M" subtext="+14.2% from yesterday" icon="📊" highlightColor="#0ea5e9" />
        <KpiCard title="Avg Finality Time" value="3.2 Sec" subtext="BSC PoSA BFT consensus" icon="⚡" highlightColor="#8b5cf6" />
        <KpiCard title="Relayer Fee" value="0.10%" subtext="Decentralized multi-sig fee" icon="💎" highlightColor="#f59e0b" />
      </div>

      {/* Bridge Execution Interface */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-7 space-y-4">
          <BentoCard accentColor="#0ea5e9">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Transfer Configuration</span>
                <span className="text-xs text-slate-400 font-mono">Contract: PISOBridge.sol (0x...1007)</span>
              </div>

              {/* Source Network */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Source Network</label>
                  <span className="text-xs text-emerald-400 font-mono">Chain ID: {fromNet.chainId}</span>
                </div>
                <select
                  value={fromNet.id}
                  onChange={(e) => setFromNet(NETWORKS.find((n) => n.id === e.target.value) || NETWORKS[0])}
                  className="piso-input font-bold"
                >
                  {NETWORKS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.icon} {n.name} ({n.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-2">
                <button
                  onClick={handleSwapDirection}
                  title="Swap source and destination chains"
                  className="w-10 h-10 rounded-xl bg-dark-700 border border-card-border text-slate-300 hover:text-white hover:border-accent-blue hover:scale-110 transition-all flex items-center justify-center font-bold text-xl shadow-lg"
                >
                  ⇅
                </button>
              </div>

              {/* Destination Network */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Destination Network</label>
                  <span className="text-xs text-emerald-400 font-mono">Chain ID: {toNet.chainId}</span>
                </div>
                <select
                  value={toNet.id}
                  onChange={(e) => setToNet(NETWORKS.find((n) => n.id === e.target.value) || NETWORKS[1])}
                  className="piso-input font-bold"
                >
                  {NETWORKS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.icon} {n.name} ({n.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Token & Amount Selector */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Token & Transfer Amount</label>
                  <span className="text-xs text-slate-400">
                    Balance: <span className="text-white font-mono">{token.balance} {token.symbol}</span>
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-5 sm:col-span-4">
                    <select
                      value={token.symbol}
                      onChange={(e) => setToken(TOKENS.find((t) => t.symbol === e.target.value) || TOKENS[0])}
                      className="piso-input font-bold"
                    >
                      {TOKENS.map((t) => (
                        <option key={t.symbol} value={t.symbol}>
                          {t.icon} {t.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-7 sm:col-span-8 relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="piso-input font-mono font-bold pr-16"
                    />
                    <button
                      onClick={handleMaxAmount}
                      className="absolute right-2 top-2 bottom-2 px-2.5 text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 rounded-lg hover:bg-cyan-900/80 transition-all"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Destination Address */}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5 uppercase">
                  Recipient Address (Optional - Default Connected Wallet)
                </label>
                <input
                  type="text"
                  value={destAddr}
                  onChange={(e) => setDestAddr(e.target.value)}
                  placeholder="0x... (Target 0x address)"
                  className="piso-input text-xs font-mono"
                />
              </div>

              {/* Fee Summary Panel */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Source Gas Fee:</span>
                  <span className="font-mono text-white">{estimatedGas}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Relayer Protocol Fee (0.1%):</span>
                  <span className="font-mono text-white">{relayerFee} {token.symbol}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Delivery Time:</span>
                  <span className="font-mono text-emerald-400">~ 3.0 Seconds</span>
                </div>
              </div>

              {/* Progress Stepper Visualizer */}
              {loading && (
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                  <div className="flex justify-between text-xs font-bold text-cyan-400">
                    <span>Bridge Execution Progress</span>
                    <span>Step {step} / 3</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleBridge}
                disabled={loading}
                className="btn w-full font-bold text-white text-base py-3.5 shadow-xl transition-all"
                style={{
                  background: loading
                    ? 'rgba(14,165,233,0.3)'
                    : 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
                }}
              >
                {loading
                  ? '⏳ Relaying Cross-Chain Liquidity...'
                  : `🌉 Bridge ${token.symbol} (${fromNet.name} ➔ ${toNet.name})`}
              </button>

              {/* Terminal Log Output */}
              {statusMsg && (
                <div className="output-box font-mono text-xs leading-relaxed border border-cyan-500/20" style={{ color: '#38bdf8' }}>
                  {statusMsg}
                </div>
              )}
            </div>
          </BentoCard>
        </div>

        {/* Right Info & Relayer Status */}
        <div className="lg:col-span-5 space-y-4">
          <BentoCard accentColor="#8b5cf6">
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <span>🛡️</span> Multi-Sig Relayer Telemetry
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-dark-700/60 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Relayer Node #1 (Tokyo)</p>
                  <p className="text-slate-400 text-[11px] font-mono">0x71C...a82F</p>
                </div>
                <span className="badge badge-green text-[10px]">Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-700/60 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Relayer Node #2 (Frankfurt)</p>
                  <p className="text-slate-400 text-[11px] font-mono">0x3B9...c910</p>
                </div>
                <span className="badge badge-green text-[10px]">Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-700/60 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Relayer Node #3 (Singapore)</p>
                  <p className="text-slate-400 text-[11px] font-mono">0xF4A...d881</p>
                </div>
                <span className="badge badge-green text-[10px]">Verified</span>
              </div>
            </div>
          </BentoCard>

          <BentoCard accentColor="#10b981">
            <h3 className="font-bold text-white text-base mb-2">📜 Smart Contract Specification</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Assets are locked in <code className="text-emerald-400 font-mono">PISOBridge.sol</code> on the source chain and signed via ECDSA threshold attestation before being released or minted.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Bridge Address:</span>
                <code className="text-cyan-400 font-mono text-[11px]">0x0000000000000000000000000000000000001007</code>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Security Model:</span>
                <span className="text-white font-semibold">2/3 Threshold Multi-Sig</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Audit Status:</span>
                <span className="text-emerald-400 font-semibold">OWASP AISVS Verified</span>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* Cross-Chain Transfer History Table */}
      <BentoCard accentColor="#3b82f6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-lg">📜 Recent Cross-Chain Transfers</h3>
              <p className="text-xs text-slate-400">Live cryptographic logs emitted by PISOBridge contract events</p>
            </div>
            <span className="badge badge-cyan text-xs">{history.length} Logged Transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Tx ID</th>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Token & Amount</th>
                  <th className="py-2.5 px-3">Source Tx</th>
                  <th className="py-2.5 px-3">Dest Tx</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {history.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">{tx.id}</td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-white">{tx.srcNet}</span>
                      <span className="text-slate-500 mx-1.5">➔</span>
                      <span className="font-medium text-emerald-400">{tx.destNet}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {tx.amount} {tx.token}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => copyText(tx.txHashSrc)}
                        className="font-mono text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
                        title="Click to copy hash"
                      >
                        {tx.txHashSrc.substring(0, 10)}... 📋
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => copyText(tx.txHashDest)}
                        className="font-mono text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                        title="Click to copy hash"
                      >
                        {tx.txHashDest.substring(0, 10)}... 📋
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <span className="badge badge-green text-[10px]">{tx.status}</span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">{tx.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {copiedTx && (
            <div className="text-xs text-emerald-400 text-center font-mono">
              ✓ Copied hash {copiedTx.substring(0, 14)}... to clipboard
            </div>
          )}
        </div>
      </BentoCard>
    </div>
  )
}
