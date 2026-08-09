import PowMiningStudio from '../components/ui/PowMiningStudio'
import KpiCard from '../components/ui/KpiCard'

export default function PowPage() {
  return (
    <div className="space-y-5 slide-in-up">
      <div>
        <h2 className="text-2xl font-black text-white">⛏️ PoW Mining Studio</h2>
        <p className="text-slate-400 text-sm mt-1">Browser CPU mining — Keccak-256 nonce solving with on-chain proof submission</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="Reward Pool" value="100 PISO" icon="💰" highlightColor="#f59e0b" />
        <KpiCard title="Block Reward" value="5,000 PISO" icon="⛏️" highlightColor="#ffd700" />
        <KpiCard title="Treasury" value="60B PISO" icon="🏛️" highlightColor="#8b5cf6" />
        <KpiCard title="Halving Cycle" value="5M Blocks" icon="📅" highlightColor="#10b981" />
      </div>

      <PowMiningStudio />
    </div>
  )
}
