import { useState } from 'react'
import BentoCard from '../components/ui/BentoCard'
import KpiCard from '../components/ui/KpiCard'

const mockBlocks = [
  { number: 1248, hash: '0x8f4e2c...a3b1', txns: 12, validator: '0xB5A7...D8', time: '3s ago', gas: '0.0021 Gwei' },
  { number: 1247, hash: '0x7d3f1b...c4a2', txns: 8, validator: '0xB5A7...D8', time: '6s ago', gas: '0.0018 Gwei' },
  { number: 1246, hash: '0x6c2e0a...b3d1', txns: 15, validator: '0xB5A7...D8', time: '9s ago', gas: '0.0024 Gwei' },
  { number: 1245, hash: '0x5b1d9e...a2c0', txns: 6, validator: '0xB5A7...D8', time: '12s ago', gas: '0.0019 Gwei' },
  { number: 1244, hash: '0x4a0c8d...91bf', txns: 20, validator: '0xB5A7...D8', time: '15s ago', gas: '0.0031 Gwei' },
]

const mockTxns = [
  { hash: '0x1f2e3d...a4b5', from: '0x90F7...b906', to: '0x1111...1000', value: '100 PISO', status: 'Success' },
  { hash: '0x2a3b4c...b5c6', from: '0xB5A7...82D8', to: '0x90F7...b906', value: '50 PISO', status: 'Success' },
  { hash: '0x3b4c5d...c6d7', from: '0x90F7...b906', to: '0x2222...1001', value: '0 PISO', status: 'Success' },
]

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-5 slide-in-up">
      <div>
        <h2 className="text-2xl font-black text-white">🔍 PISO Chain Explorer</h2>
        <p className="text-slate-400 text-sm mt-1">Inspect blocks, transactions, addresses, and smart contracts on PISO Chain Mainnet</p>
      </div>

      {/* Search */}
      <BentoCard accentColor="#06b6d4">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="piso-input flex-1"
            placeholder="Search block number, Tx hash, or wallet address..."
          />
          <button className="btn btn-primary-blue text-sm px-5">🔍 Search</button>
        </div>
      </BentoCard>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="Latest Block" value="#1,248" icon="📦" highlightColor="#3b82f6" />
        <KpiCard title="Total Txns" value="14,832" icon="🔄" highlightColor="#10b981" />
        <KpiCard title="Validators" value="1 / 21" icon="✅" highlightColor="#8b5cf6" />
        <KpiCard title="Avg Gas Price" value="0.0021 Gwei" icon="⛽" highlightColor="#f59e0b" />
      </div>

      {/* Latest Blocks */}
      <BentoCard accentColor="#3b82f6">
        <h3 className="text-base font-bold text-white mb-4">📦 Latest Blocks</h3>
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="piso-table">
            <thead>
              <tr>
                <th>Block</th>
                <th>Hash</th>
                <th>Txns</th>
                <th>Validator</th>
                <th>Time</th>
                <th>Gas Used</th>
              </tr>
            </thead>
            <tbody>
              {mockBlocks.map((b) => (
                <tr key={b.number}>
                  <td className="mono font-bold text-blue-400">#{b.number}</td>
                  <td className="mono text-xs text-slate-400">{b.hash}</td>
                  <td>{b.txns}</td>
                  <td className="mono text-xs">{b.validator}</td>
                  <td className="text-slate-500 text-xs">{b.time}</td>
                  <td className="mono text-xs text-slate-400">{b.gas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>

      {/* Latest Transactions */}
      <BentoCard accentColor="#10b981">
        <h3 className="text-base font-bold text-white mb-4">🔄 Latest Transactions</h3>
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="piso-table">
            <thead>
              <tr>
                <th>Tx Hash</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockTxns.map((t, i) => (
                <tr key={i}>
                  <td className="mono text-xs text-blue-400">{t.hash}</td>
                  <td className="mono text-xs">{t.from}</td>
                  <td className="mono text-xs">{t.to}</td>
                  <td className="font-mono">{t.value}</td>
                  <td><span className="badge badge-green text-xs">✓ {t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>

      <div className="text-center">
        <a href="../explorer.html" className="btn btn-primary-blue text-sm">
          🔗 Open Full Explorer (explorer.html)
        </a>
      </div>
    </div>
  )
}
