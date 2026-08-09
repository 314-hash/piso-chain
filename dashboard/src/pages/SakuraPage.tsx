import SakuraAgentStudio from '../components/ui/SakuraAgentStudio'
import KpiCard from '../components/ui/KpiCard'

export default function SakuraPage() {
  return (
    <div className="space-y-5 slide-in-up">
      <div>
        <h2 className="text-2xl font-black text-white">🌸 Sakura AI Agent Layer</h2>
        <p className="text-slate-400 text-sm mt-1">
          20-agent orchestration swarm for governance, compliance, risk assessment & smart contract auditing
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="Agents Online" value="20 / 20" icon="🤖" highlightColor="#ec4899" />
        <KpiCard title="Tasks Completed" value="1,248" icon="✅" highlightColor="#10b981" />
        <KpiCard title="RAM Footprint" value="1.85 GB" icon="🧠" highlightColor="#8b5cf6" />
        <KpiCard title="RAM Savings" value="98.5%" icon="⚡" highlightColor="#f59e0b" />
      </div>

      <SakuraAgentStudio />
    </div>
  )
}
