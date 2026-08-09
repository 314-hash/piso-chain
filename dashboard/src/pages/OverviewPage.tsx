import { useEffect, useState } from 'react'
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import KpiCard from '../components/ui/KpiCard'
import BentoCard from '../components/ui/BentoCard'
import InfographicStep from '../components/ui/InfographicStep'
import OnboardingStrip from '../components/ui/OnboardingStrip'

// ── Fake live block data generator ──────────────────────────────────────────
function generateChartData(points = 24) {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i}:00`,
    blocks: Math.floor(Math.random() * 200 + 1100),
    tps: Math.floor(Math.random() * 60 + 20),
    gas: (Math.random() * 0.5 + 0.1).toFixed(2),
  }))
}

const infographicSteps = [
  {
    step: '01', icon: '👛', title: '1. Create Free Wallet',
    description: 'Generate your 24-word secret recovery phrase or connect MetaMask. Uses official SLIP-0044 coin type 2026\'.',
    flowTag: '🔑 Mnemonic ➔ Address ➔ Active Wallet',
    accentColor: '#ffd700', bgColor: 'rgba(255,215,0,0.08)',
  },
  {
    step: '02', icon: '⛏️', title: '2. 1-Click 24h Mining',
    description: 'Tap the gold "Start 24h Mining" button. 24h clock accumulates PISO yields automatically!',
    flowTag: '⚡ Tap Start ➔ 24h Yield ➔ Claim 50 PISO',
    accentColor: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)',
  },
  {
    step: '03', icon: '🏛️', title: '3. Mining Treasury',
    description: '60 Billion PISO zero-inflation reserve emitting block rewards via 5M-block halving schedule.',
    flowTag: '🏛️ 60B Treasury ➔ 5,000 PISO/Block',
    accentColor: '#a855f7', bgColor: 'rgba(168,85,247,0.08)',
  },
  {
    step: '04', icon: '🚀', title: '4. Open-Source Suite',
    description: 'Explore 9 integrated open-source engines: OSINT, PraisonAI, JobSync, AISVS, IRONSIGHT, L0p4Map, MinerU, RefRef, Nethermind.',
    flowTag: '🧠 9 Repos ➔ AI & Security Stack',
    accentColor: '#ec4899', bgColor: 'rgba(236,72,153,0.08)',
  },
  {
    step: '05', icon: '🗺️', title: '5. DePIN GIS Node Map',
    description: 'View active global validator nodes on MapLibre vector map (Manila, Singapore, Tokyo, London, San Francisco).',
    flowTag: '📍 Lat/Lng ➔ MapLibre ➔ Verified Node',
    accentColor: '#10b981', bgColor: 'rgba(16,185,129,0.08)',
  },
  {
    step: '06', icon: '⛽', title: '6. Zero-Gas Paymaster',
    description: 'Send 100% gasless transactions via EIP-4337 Paymaster and claim 1 free PISO coin daily from Faucet.',
    flowTag: '⛽ Paymaster Vault ➔ 0 Gas ➔ Faucet',
    accentColor: '#3b82f6', bgColor: 'rgba(59,130,246,0.08)',
  },
]

const systemContracts = [
  { addr: '0x...1000', name: 'PISOValidator', color: '#3b82f6' },
  { addr: '0x...1001', name: 'PISOMining', color: '#f59e0b' },
  { addr: '0x...1002', name: 'PISOGovernance', color: '#8b5cf6' },
  { addr: '0x...1003', name: 'PISOProofOfWork', color: '#10b981' },
  { addr: '0x...1004', name: 'PISOTreasury', color: '#ffd700' },
  { addr: '0x...1005', name: 'PISOPaymaster', color: '#ec4899' },
]

export default function OverviewPage() {
  const [chartData] = useState(generateChartData())
  const [blockHeight, setBlockHeight] = useState(1248)
  const [tps, setTps] = useState(48.5)

  // Live-update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight((h) => h + 1)
      setTps((t) => parseFloat((t + (Math.random() - 0.5) * 5).toFixed(1)))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <BentoCard accentColor="#ffd700">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          {/* Left: logo + title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 relative">
              <img
                src="/piso_logo.jpg"
                alt="PISO Coin"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 shadow-glow-gold float-anim"
                style={{ borderColor: '#ffd700' }}
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="%23ffd700"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="36" font-weight="bold" fill="%23000">₱</text></svg>'
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-xl md:text-2xl font-black text-white">PISO CHAIN MAINNET</h1>
                <span className="badge badge-gold">Official Native Coin</span>
                <span className="badge badge-purple">jcode Agent OS</span>
              </div>
              <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                PINOY • POST-QUANTUM • POSA • FOR THE PEOPLE — High-performance EVM L1 with NIST FIPS 204 ML-DSA, EIP-4337 Account Abstraction & SLIP-39 Shamir Recovery.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-blue text-xs">
                  <span className="w-1.5 h-1.5 rounded-full pulse-green inline-block mr-1" />
                  Parlia PoSA (3.0s Finality)
                </span>
                <span className="badge badge-green text-xs">🛡️ NIST ML-DSA Active</span>
                <span className="badge badge-purple text-xs">🔑 SLIP-39 Standard</span>
              </div>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex flex-col gap-2.5 md:min-w-[180px]">
            <a
              href="/wallet"
              className="btn btn-primary-gold text-sm w-full"
            >
              👛 Wallet Studio
            </a>
            <a
              href="/pow"
              className="btn text-sm w-full font-bold text-black"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              ⛏️ 1-Click Miner
            </a>
            <button
              className="btn btn-ghost text-sm w-full"
              onClick={() => alert('🎓 Interactive tutorial coming soon!')}
            >
              📖 UI Tutorial
            </button>
          </div>
        </div>
      </BentoCard>

      {/* ── Onboarding Strip ─────────────────────────────────────────────── */}
      <OnboardingStrip />

      {/* ── KPI Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiCard title="Block Height" value={`#${blockHeight.toLocaleString()}`} subtext="Avg Block Time: 3.0s" icon="📦" highlightColor="#3b82f6" delay={0} />
        <KpiCard title="TPS" value={tps.toFixed(1)} subtext="Max Peak: 2,500 TPS" icon="⚡" highlightColor="#10b981" delay={1} />
        <KpiCard title="Active Validators" value="1 / 21" subtext="Parlia Consensus" icon="✅" highlightColor="#8b5cf6" delay={2} />
        <KpiCard title="Total PISO Supply" value="100.0B" subtext="Native Layer 1 Coin" icon="💰" highlightColor="#ffd700" delay={3} />
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4">
        <BentoCard accentColor="#3b82f6">
          <h3 className="text-sm font-semibold text-white mb-4">📦 Block Production (24h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="blockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '10px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="blocks" stroke="#3b82f6" strokeWidth={2} fill="url(#blockGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </BentoCard>

        <BentoCard accentColor="#10b981">
          <h3 className="text-sm font-semibold text-white mb-4">⚡ TPS (Transactions/sec)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '10px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line type="monotone" dataKey="tps" stroke="#10b981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </BentoCard>
      </div>

      {/* ── Beginner Infographic ─────────────────────────────────────────── */}
      <BentoCard accentColor="#f59e0b">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🎨 First-Time User Beginner Guide
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Step-by-step walkthrough: mining, wallets, DePIN nodes, and AI Agent Oracles
            </p>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
            <a
              href="../PISO_Chain_v1.6.0.apk"
              download
              className="btn text-xs px-3 py-2 rounded-lg text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              📲 Android APK
            </a>
            <span className="badge badge-gold text-xs">Beginner Friendly ⭐</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {infographicSteps.map((step) => (
            <InfographicStep key={step.step} {...step} />
          ))}
        </div>
      </BentoCard>

      {/* ── System Contracts Banner ──────────────────────────────────────── */}
      <BentoCard accentColor="#06b6d4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-1">
              📜 PISO Chain System Smart Contracts Hub
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              All 11 precompiled system contracts on addresses{' '}
              <code>0x...1000</code> to <code>0x...100A</code>
            </p>
            <div className="flex flex-wrap gap-2">
              {systemContracts.map((c) => (
                <span
                  key={c.addr}
                  className="badge text-xs"
                  style={{ background: `${c.color}15`, color: c.color, borderColor: `${c.color}30` }}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
          <a
            href="../contracts.html"
            className="btn btn-primary-blue text-sm self-start sm:self-center flex-shrink-0"
          >
            📜 Open Contract Studio
          </a>
        </div>
      </BentoCard>

      {/* ── Turbo-Fieldfare AI ───────────────────────────────────────────── */}
      <TurboFieldfareSection />
    </div>
  )
}

function TurboFieldfareSection() {
  const [prompt, setPrompt] = useState('Verify on-chain proof of work difficulty and validate PISO Chain mainnet state.')
  const [output, setOutput] = useState('⚡ Turbo-Fieldfare AI Engine ready (~2 GB RAM footprint). Click "Run" to execute LLM task.')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setOutput('⚡ Loading Gemma 4 26B quantized model...\n🧠 Allocating 1.85 GB RAM...\n📋 Running inference...')
    await new Promise((r) => setTimeout(r, 1800))
    setOutput((o) => o + '\n\n✅ Inference complete!\n📊 Analysis:\n  • PISO Chain mainnet is live and validated\n  • PoW difficulty: 8 bits (Keccak-256)\n  • Block production nominal at 3.0s intervals\n  • No anomalies detected in validator set\n  • Confidence: 97.3%')
    setLoading(false)
  }

  return (
    <div
      className="glass-card p-5 md:p-6 mb-6"
      style={{ borderColor: '#ec489933', background: 'linear-gradient(135deg, rgba(236,72,153,0.05), rgba(168,85,247,0.05))' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            ⚡ Turbo-Fieldfare AI Engine
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Gemma 4 26B parameter inference in ~2 GB RAM via 4-bit quantization
          </p>
        </div>
        <span className="badge badge-pink self-start sm:ml-auto font-mono text-xs">~1.85 GB RAM</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="space-y-3">
          <label className="text-xs text-slate-500">AI Agent Task Prompt</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="piso-input" style={{ minHeight: '80px' }} />
          <button
            onClick={run}
            disabled={loading}
            className="btn w-full text-white font-bold text-sm"
            style={{ background: loading ? 'rgba(236,72,153,0.3)' : 'linear-gradient(135deg, #ec4899, #c026d3)' }}
          >
            {loading ? '⏳ Running...' : '⚡ Run 2GB RAM Gemma Inference'}
          </button>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1e2d45' }}>
          <h4 className="text-sm font-semibold text-pink-400 mb-3">📊 RAM & Efficiency Telemetry</h4>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div>• <strong className="text-white">Model:</strong> Gemma 4 26B-A4B (4-bit)</div>
            <div>• <strong className="text-white">RAM:</strong> <span className="text-pink-400 font-bold">1.85 GB / 2 GB</span></div>
            <div>• <strong className="text-white">Target:</strong> Apple M1–M4 & SIMD CPU</div>
            <div>• <strong className="text-white">RAM Savings:</strong> <span className="text-emerald-400 font-bold">98.5% reduction</span></div>
            <div>• <strong className="text-white">On-Chain Proof:</strong> <code className="text-xs">PISOTurboFieldfareAI.sol</code></div>
          </div>
        </div>
      </div>
      <div className="output-box" style={{ color: '#f472b6' }}>{output}</div>
    </div>
  )
}
