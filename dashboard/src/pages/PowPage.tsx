import PowMiningStudio from '../components/ui/PowMiningStudio'
import KpiCard from '../components/ui/KpiCard'

export default function PowPage() {
  return (
    <div className="space-y-6 slide-in-up">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-2">
            ⛏️ Proof of Work (PoW) Mining Studio
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Browser CPU & DePIN Proof of Work mining engine with on-chain payout verification
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-amber py-1.5 px-3">Keccak-256 & SHA-256 Engine</span>
          <span className="badge badge-green py-1.5 px-3">Zero Inflation Treasury</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Consensus Block Reward" value="5,000 PISO" subtext="Per Verified Block" icon="⛏️" highlightColor="#f59e0b" />
        <KpiCard title="Treasury Mining Pool" value="60 Billion PISO" subtext="Pre-Minted Reserve" icon="🏛️" highlightColor="#8b5cf6" />
        <KpiCard title="Halving Schedule" value="Every 5,000,000" subtext="Blocks (~173 Days)" icon="📅" highlightColor="#0ea5e9" />
        <KpiCard title="Active Mining Address" value="0x...1003" subtext="PISOProofOfWork.sol" icon="📜" highlightColor="#10b981" />
      </div>

      {/* Interactive Mining Studio */}
      <PowMiningStudio />
    </div>
  )
}
