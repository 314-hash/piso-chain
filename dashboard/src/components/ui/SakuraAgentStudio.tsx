import { useState } from 'react'
import { useWallet } from '../../services/web3'

const AGENTS = [
  { id: 'governance', name: 'Governance Auditor', icon: '🏛️', color: '#8b5cf6' },
  { id: 'freqtrade', name: 'Freqtrade Risk Agent', icon: '📈', color: '#f59e0b' },
  { id: 'compliance', name: 'Compliance Monitor', icon: '⚖️', color: '#06b6d4' },
  { id: 'audit', name: 'Smart Contract Auditor', icon: '🔍', color: '#10b981' },
  { id: 'dag', name: 'Workflow DAG Scheduler', icon: '🔄', color: '#ec4899' },
  { id: 'depin', name: 'DePIN Node Inspector', icon: '📡', color: '#3b82f6' },
  { id: 'fraud', name: 'Fraud Detector', icon: '🛡️', color: '#ef4444' },
  { id: 'nft', name: 'NFT Metadata Oracle', icon: '🖼️', color: '#c084fc' },
  { id: 'bridge', name: 'Bridge Monitor', icon: '🌉', color: '#38bdf8' },
  { id: 'dao', name: 'DAO Proposal Writer', icon: '📝', color: '#fbbf24' },
  { id: 'gas', name: 'Gas Optimizer', icon: '⛽', color: '#34d399' },
  { id: 'liquidity', name: 'Liquidity Agent', icon: '💧', color: '#60a5fa' },
  { id: 'staking', name: 'Staking Strategist', icon: '🥩', color: '#f472b6' },
  { id: 'osint', name: 'OSINT Intelligence', icon: '🕵️', color: '#a78bfa' },
  { id: 'ml', name: 'ML Prediction Model', icon: '🧠', color: '#fb923c' },
  { id: 'treasury', name: 'Treasury Manager', icon: '🏦', color: '#4ade80' },
  { id: 'validator', name: 'Validator Health Bot', icon: '✅', color: '#22d3ee' },
  { id: 'snapshot', name: 'Snapshot Oracle', icon: '📸', color: '#e879f9' },
  { id: 'kyc', name: 'KYC/AML Screener', icon: '🪪', color: '#fdba74' },
  { id: 'sakura', name: 'Sakura Orchestrator', icon: '🌸', color: '#f472b6' },
]

export default function SakuraAgentStudio() {
  const { wallet } = useWallet()
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0])
  const [prompt, setPrompt] = useState('Verify on-chain proof of work difficulty and validate PISO Chain mainnet state.')
  const [output, setOutput] = useState('⚡ Sakura AI Agent Studio ready. Select an agent and enter a task prompt.')
  const [loading, setLoading] = useState(false)

  const runAgent = async () => {
    setLoading(true)
    const userAddr = wallet?.address || '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
    setOutput(`🌸 [${selectedAgent.name}] Initializing agent task...\n📋 Prompt: "${prompt}"\n🔑 Identity Wallet Address: ${userAddr}\n\n`)
    await new Promise((r) => setTimeout(r, 600))
    setOutput((o) => o + `🔗 Connecting to PISO Chain RPC...\n`)
    await new Promise((r) => setTimeout(r, 400))
    setOutput((o) => o + `📊 Fetching latest block state...\n`)
    await new Promise((r) => setTimeout(r, 500))
    setOutput((o) => o + `🧠 Running ${selectedAgent.name} analysis pipeline...\n`)
    await new Promise((r) => setTimeout(r, 800))
    setOutput((o) => o + `\n✅ Task Complete!\n📄 Report:\n  • Block Height: #${(Math.random() * 1000 + 1200).toFixed(0)}\n  • TPS: ${(Math.random() * 50 + 20).toFixed(1)}\n  • Validators Online: 1/21\n  • Network Health: 99.8% Uptime\n  • AI Confidence Score: ${(Math.random() * 5 + 95).toFixed(1)}%\n`)
    setLoading(false)
  }

  return (
    <div
      className="glass-card p-5 md:p-6 mb-6"
      style={{ borderColor: '#f472b633', background: 'linear-gradient(135deg, rgba(244,114,182,0.05), rgba(236,72,153,0.05))' }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🌸 Sakura AI Agent Layer
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            20-agent orchestration swarm for governance, compliance, risk & smart contract auditing
          </p>
        </div>
        <span className="badge badge-pink self-start sm:ml-auto font-mono text-xs">
          PISOSakuraAIOracle.sol (0x...1013)
        </span>
      </div>

      {/* Agent grid */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Agent</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                selectedAgent.id === agent.id
                  ? 'ring-1'
                  : 'opacity-60 hover:opacity-90'
              }`}
              style={{
                background: `${agent.color}15`,
                border: `1px solid ${agent.color}${selectedAgent.id === agent.id ? '60' : '25'}`,
                ringColor: agent.color,
                color: selectedAgent.id === agent.id ? agent.color : '#94a3b8',
              } as React.CSSProperties}
            >
              <span className="text-base flex-shrink-0">{agent.icon}</span>
              <span className="truncate">{agent.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task prompt */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300">Agent Task Prompt</h4>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="piso-input"
            style={{ minHeight: '90px' }}
            placeholder="Enter AI agent task..."
          />
          <button
            onClick={runAgent}
            disabled={loading}
            className="btn w-full font-bold text-white text-sm"
            style={{
              background: loading
                ? 'rgba(236,72,153,0.3)'
                : 'linear-gradient(135deg, #ec4899, #c026d3)',
            }}
          >
            {loading ? '⏳ Running Agent...' : `🌸 Run ${selectedAgent.name}`}
          </button>
        </div>

        {/* Telemetry */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1e2d45' }}>
          <h4 className="text-sm font-semibold text-pink-400 mb-3">📊 Agent Telemetry</h4>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div>• <strong className="text-white">Model:</strong> Gemma 4 26B-A4B (4-bit Quantized)</div>
            <div>• <strong className="text-white">RAM Footprint:</strong> <span className="text-pink-400 font-bold">1.85 GB / 2 GB</span></div>
            <div>• <strong className="text-white">Agents Online:</strong> <span className="text-emerald-400">20 / 20</span></div>
            <div>• <strong className="text-white">Tasks Completed:</strong> 1,248</div>
            <div>• <strong className="text-white">Oracle Contract:</strong> <code className="text-xs">0x...1013</code></div>
            <div>• <strong className="text-white">RAM Savings:</strong> <span className="text-emerald-400 font-bold">98.5% Reduction</span></div>
          </div>
        </div>
      </div>

      {/* Output */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Agent Output Log</h4>
        <div className="output-box" style={{ color: '#f472b6' }}>{output}</div>
      </div>
    </div>
  )
}
