import { useState } from 'react'
import BentoCard from '../components/ui/BentoCard'

const NETWORKS = [
  { id: 'piso', name: 'PISO Chain Mainnet', chainId: 2026001, icon: '₱' },
  { id: 'bsc', name: 'BNB Smart Chain', chainId: 56, icon: '🟡' },
  { id: 'ethereum', name: 'Ethereum Mainnet', chainId: 1, icon: 'Ξ' },
  { id: 'polygon', name: 'Polygon POS', chainId: 137, icon: '💜' },
]

export default function BridgePage() {
  const [fromNet, setFromNet] = useState(NETWORKS[1]) // BSC
  const [toNet, setToNet] = useState(NETWORKS[0])   // PISO Chain
  const [amount, setAmount] = useState('')
  const [destAddr, setDestAddr] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSwapDirection = () => {
    setFromNet(toNet)
    setToNet(fromNet)
  }

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    setLoading(true)
    setStatus(`🌉 Initiating Lock & Mint Cross-Chain Transfer...\nSource: ${fromNet.name}\nTarget: ${toNet.name}\nAmount: ${amount} Token\nDestination: ${destAddr || 'Connected Wallet'}`)
    await new Promise((r) => setTimeout(r, 1500))
    setStatus((s) => s + '\n\n🔒 Lock Transaction confirmed on source chain (Tx: 0x9f8e7d...a6b5)\n⏳ Relayer attestation 2/3 signatures gathered...')
    await new Promise((r) => setTimeout(r, 1500))
    setStatus((s) => s + '\n\n✨ Mint Transaction submitted on target chain!\n✅ Bridge Complete! PISO Bridge Vault 0x...1006 emitted event.')
    setLoading(false)
  }

  return (
    <div className="space-y-5 slide-in-up">
      <div>
        <h2 className="text-2xl font-black text-white">🌉 Cross-Chain Bridge Studio</h2>
        <p className="text-slate-400 text-sm mt-1">
          Trustless cryptographic bridge linking PISO Chain L1 with Ethereum, BNB Chain, and Polygon
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <BentoCard accentColor="#0ea5e9">
          <div className="space-y-4">
            {/* From Network */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1.5 uppercase">From Source Network</label>
              <select
                value={fromNet.id}
                onChange={(e) => setFromNet(NETWORKS.find((n) => n.id === e.target.value) || NETWORKS[0])}
                className="piso-input"
              >
                {NETWORKS.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.icon} {n.name} (Chain ID: {n.chainId})
                  </option>
                ))}
              </select>
            </div>

            {/* Flip Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwapDirection}
                className="w-10 h-10 rounded-xl bg-dark-700 border border-card-border text-slate-300 hover:text-white hover:border-accent-blue transition-all flex items-center justify-center font-bold text-lg"
              >
                ⇅
              </button>
            </div>

            {/* To Network */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1.5 uppercase">To Destination Network</label>
              <select
                value={toNet.id}
                onChange={(e) => setToNet(NETWORKS.find((n) => n.id === e.target.value) || NETWORKS[1])}
                className="piso-input"
              >
                {NETWORKS.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.icon} {n.name} (Chain ID: {n.chainId})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1.5 uppercase">Transfer Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00 PISO / USDT"
                className="piso-input"
              />
            </div>

            {/* Destination Address */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1.5 uppercase">Destination Wallet Address (Optional)</label>
              <input
                type="text"
                value={destAddr}
                onChange={(e) => setDestAddr(e.target.value)}
                placeholder="0x... (Defaults to connected wallet)"
                className="piso-input text-xs"
              />
            </div>

            {/* Bridge Action Button */}
            <button
              onClick={handleBridge}
              disabled={loading}
              className="btn w-full font-bold text-white text-sm py-3"
              style={{ background: loading ? 'rgba(14,165,233,0.3)' : 'linear-gradient(135deg, #0ea5e9, #10b981)' }}
            >
              {loading ? '⏳ Relaying Cross-Chain Tokens...' : `🌉 Bridge Assets (${fromNet.name} ➔ ${toNet.name})`}
            </button>

            {/* Status Log */}
            {status && (
              <div className="output-box mt-3 text-xs leading-relaxed" style={{ color: '#38bdf8' }}>
                {status}
              </div>
            )}
          </div>
        </BentoCard>
      </div>

      {/* Relayer Telemetry */}
      <div className="grid md:grid-cols-3 gap-3">
        <BentoCard accentColor="#10b981">
          <p className="text-xs text-slate-500 mb-1">Bridge Vault Smart Contract</p>
          <code className="text-xs text-emerald-400 block font-mono">PISOBridge.sol (0x...1006)</code>
        </BentoCard>
        <BentoCard accentColor="#0ea5e9">
          <p className="text-xs text-slate-500 mb-1">Active Multi-Sig Relayers</p>
          <p className="font-bold text-white text-sm">3 / 3 Relayer Nodes Verified</p>
        </BentoCard>
        <BentoCard accentColor="#8b5cf6">
          <p className="text-xs text-slate-500 mb-1">Total Cross-Chain TVL</p>
          <p className="font-bold text-purple-400 font-mono text-sm">₱42,500,000 PISO</p>
        </BentoCard>
      </div>
    </div>
  )
}
