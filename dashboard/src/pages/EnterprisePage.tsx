import BentoCard from '../components/ui/BentoCard'

export default function EnterprisePage() {
  const repos = [
    { name: 'OSINT Intelligence', desc: 'Threat detection & darknet monitoring engine' },
    { name: 'PraisonAI Multi-Agent', desc: 'Autonomous AI agent workflow orchestrator' },
    { name: 'JobSync Enterprise', desc: 'Distributed task queuing & synchronization' },
    { name: 'AISVS Security Audit', desc: 'Smart contract vulnerability scanner' },
    { name: 'IRONSIGHT Telemetry', desc: 'Real-time validator node monitoring' },
    { name: 'L0p4Map Scanner', desc: 'P2P network discovery & port scanner' },
    { name: 'MinerU PDF Engine', desc: 'Document parsing & ML data extraction' },
  ]

  return (
    <div className="space-y-5 slide-in-up">
      <div>
        <h2 className="text-2xl font-black text-white">🚀 Enterprise 7-Repo Suite</h2>
        <p className="text-slate-400 text-sm mt-1">Open-source enterprise engines integrated into PISO Chain L1</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {repos.map((r, i) => (
          <BentoCard key={i} accentColor="#8b5cf6">
            <h3 className="font-bold text-white text-base mb-1">{r.name}</h3>
            <p className="text-xs text-slate-400">{r.desc}</p>
            <span className="badge badge-purple text-xs mt-3 inline-block">Enterprise Integrated</span>
          </BentoCard>
        ))}
      </div>
    </div>
  )
}
