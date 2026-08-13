import { useEffect, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWallet } from '../services/web3'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  TequilAPI, formatBytes, formatMyst, formatMystInPiso, formatDuration, MYST_TO_PISO_RATE,
  type NodeHealthcheck, type Identity, type Service, type Session, type NatStatus,
} from '../services/tequilapi'
import BentoCard from '../components/ui/BentoCard'
import KpiCard from '../components/ui/KpiCard'

// ── Mock earnings history for the chart ──────────────────────────────────────
function generateEarningsHistory() {
  let acc = 0
  return Array.from({ length: 24 }, (_, i) => {
    acc += Math.random() * 0.0005
    return { hour: `${i}:00`, myst: parseFloat(acc.toFixed(6)) }
  })
}

const DOCKER_SNIPPET = `# Add to your docker-compose.yml:
services:
  mysterium-node:
    image: mysteriumnetwork/myst:latest
    ports:
      - "4050:4050"   # TequilAPI
      - "1194:1194/udp"
    volumes:
      - myst-data:/var/lib/mysterium-node
    command: >
      service
      --agreed-terms-and-conditions
    cap_add:
      - NET_ADMIN
    restart: unless-stopped

volumes:
  myst-data:`

type NodeSummary = {
  health: NodeHealthcheck | null
  identity: Identity | null
  services: Service[]
  sessions: Session[]
  nat: NatStatus | null
  online: boolean
}

export default function MysteriumPage() {
  const { wallet } = useWallet()
  const [data, setData] = useState<NodeSummary | null>(null)
  const [serviceLoading, setServiceLoading] = useState(false)
  const [earningsHistory] = useState(generateEarningsHistory)
  const [copyDone, setCopyDone] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [simulatedMode, setSimulatedMode] = useState(false)

  const { data: queryData, isLoading: loading, refetch } = useQuery({
    queryKey: ['mysteriumSummary', wallet?.address],
    queryFn: async () => {
      try {
        const summary = await TequilAPI.summary()
        return { ...summary, simulatedMode: false }
      } catch {
        return {
          health: {
            version: '1.5.0-devnet',
            uptime: '1h 14m 20s',
            buildInfo: { commit: 'piso-d6a5f78b' }
          } as any,
          identity: {
            id: wallet?.address || '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            registrationStatus: 'Registered',
            balance: Number(245000000000000000000n),
            earningsTotal: Number(1242000000000000000000n)
          } as any,
          services: [{
            id: 'wireguard-sim',
            type: 'wireguard',
            status: 'Running' as const,
            providerId: wallet?.address || '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            proposal: {} as any,
            options: {} as any
          }],
          sessions: [
            {
              id: 'sess-1',
              direction: 'Provided' as const,
              consumerCountry: 'US',
              consumerID: '0x1111111111111111111111111111111111111111',
              providerID: wallet?.address || '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
              serviceType: 'wireguard',
              status: 'EstablishedProvider' as const,
              startedAt: '2026-08-13T00:00:00Z',
              duration: 3600,
              bytesReceived: 1024 * 1024 * 1420,
              bytesSent: 1024 * 1024 * 3820,
              tokens: Number(2500000000000000000n)
            },
            {
              id: 'sess-2',
              direction: 'Provided' as const,
              consumerCountry: 'PH',
              consumerID: '0x2222222222222222222222222222222222222222',
              providerID: wallet?.address || '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
              serviceType: 'wireguard',
              status: 'EstablishedProvider' as const,
              startedAt: '2026-08-13T00:30:00Z',
              duration: 1800,
              bytesReceived: 1024 * 1024 * 850,
              bytesSent: 1024 * 1024 * 1940,
              tokens: Number(1200000000000000000n)
            }
          ],
          nat: { status: 'successful' },
          online: true,
          simulatedMode: true
        }
      }
    },
    refetchInterval: 15000
  })

  const refresh = () => { refetch() }

  useEffect(() => {
    if (queryData) {
      setData((prev) => {
        if (simulatedMode && prev) {
          return {
            ...queryData,
            services: prev.services
          }
        }
        setSimulatedMode(queryData.simulatedMode)
        return queryData
      })
      setLastRefresh(new Date())
    }
  }, [queryData, simulatedMode])

  const toggleService = async () => {
    if (!data?.identity) return
    setServiceLoading(true)
    try {
      if (simulatedMode) {
        await new Promise((r) => setTimeout(r, 600))
        setData((prev) => {
          if (!prev) return null
          const isRunning = prev.services.some((s) => s.status === 'Running')
          return {
            ...prev,
            services: isRunning
              ? []
              : [{
                  id: 'wireguard-sim',
                  type: 'wireguard',
                  status: 'Running' as const,
                  providerId: wallet?.address || '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
                  proposal: {} as any,
                  options: {} as any
                }]
          }
        })
      } else {
        const running = data.services.find((s) => s.status === 'Running')
        if (running) {
          await TequilAPI.stopService(running.id)
        } else {
          await TequilAPI.startService(data.identity.id)
        }
        await refresh()
      }
    } catch (e: any) {
      alert('Service error: ' + e.message)
    } finally {
      setServiceLoading(false)
    }
  }

  const copyDockerSnippet = () => {
    navigator.clipboard.writeText(DOCKER_SNIPPET)
    setCopyDone(true)
    setTimeout(() => setCopyDone(false), 2000)
  }

  const isOnline = data?.online ?? false
  const runningService = data?.services.find((s) => s.status === 'Running')
  const totalBytesIn = data?.sessions.reduce((a, s) => a + s.bytesReceived, 0) ?? 0
  const totalBytesOut = data?.sessions.reduce((a, s) => a + s.bytesSent, 0) ?? 0
  const totalEarningsWei = data?.sessions.reduce((a, s) => a + s.tokens, 0) ?? 0

  // ── Offline / not installed state ──────────────────────────────────────────
  if (!loading && !isOnline) {
    return (
      <div className="space-y-5 slide-in-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              🌐 Mysterium dVPN Node
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Decentralized VPN — earn MYST tokens by sharing bandwidth via WireGuard
            </p>
          </div>
          <button onClick={refresh} className="btn btn-ghost text-sm">🔄 Retry</button>
        </div>

        {/* Offline banner */}
        <div
          className="glass-card p-6 text-center"
          style={{ borderColor: '#ef444433', background: 'rgba(239,68,68,0.05)' }}
        >
          <div className="text-5xl mb-3">📡</div>
          <h3 className="text-xl font-bold text-white mb-2">Mysterium Node Not Detected</h3>
          <p className="text-slate-400 text-sm mb-5 max-w-lg mx-auto">
            TequilAPI is not reachable at <code>localhost:4050</code>. Start your Mysterium node
            using Docker or the native installer, then refresh this page.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <a
              href="https://github.com/mysteriumnetwork/node/releases/latest"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary-blue text-sm"
            >
              📦 Download Mysterium Node
            </a>
            <button onClick={refresh} className="btn btn-ghost text-sm">🔄 Retry Connection</button>
          </div>

          {/* Docker snippet */}
          <div className="text-left max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-300">🐳 Quick Start with Docker</h4>
              <button
                onClick={copyDockerSnippet}
                className="btn btn-ghost text-xs px-3 py-1.5 rounded-lg"
              >
                {copyDone ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
            <pre className="output-box text-xs leading-relaxed" style={{ color: '#34d399' }}>
              {DOCKER_SNIPPET}
            </pre>
          </div>
        </div>

        {/* What is Mysterium */}
        <WhatIsMysterium />
      </div>
    )
  }

  // ── Online state ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 slide-in-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            🌐 Mysterium dVPN Node
            {isOnline && (
              <span className="badge badge-green text-xs font-mono ml-1">● ONLINE</span>
            )}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Node v{data?.health?.version ?? '—'} • Uptime: {data?.health?.uptime ?? '—'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </span>
          <button onClick={refresh} disabled={loading} className="btn btn-ghost text-sm">
            {loading ? '⏳' : '🔄'} Refresh
          </button>
        </div>
      </div>

      {simulatedMode && (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-between text-xs text-cyan-300 font-semibold gap-3">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
            ⚠️ Mysterium daemon is offline. Running in Simulated Web3 Node Mode linked to PISO Wallet.
          </span>
          <button
            onClick={() => { setSimulatedMode(false); refresh(); }}
            className="px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-700/50 transition-all text-[11px]"
          >
            Retry Local Daemon
          </button>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          title="Active Sessions"
          value={String(data?.sessions.filter((s) => s.status === 'EstablishedProvider').length ?? 0)}
          icon="📡"
          highlightColor="#06b6d4"
          subtext="WireGuard tunnels"
        />
        <KpiCard
          title="Data Served"
          value={formatBytes(totalBytesOut)}
          icon="📤"
          highlightColor="#10b981"
          subtext={`↓ ${formatBytes(totalBytesIn)} received`}
        />
        <KpiCard
          title="MYST Earned"
          value={formatMystInPiso(totalEarningsWei).pisoStr}
          icon="💎"
          highlightColor="#8b5cf6"
          subtext={`≈ ${formatMyst(totalEarningsWei)} (Oracle: 1 MYST = ${MYST_TO_PISO_RATE} PISO)`}
        />
        <KpiCard
          title="NAT Status"
          value={data?.nat?.status ?? 'Unknown'}
          icon="🛡️"
          highlightColor={data?.nat?.status === 'successful' ? '#10b981' : '#f59e0b'}
          subtext="Traversal health"
        />
      </div>

      {/* Identity + Service control */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Identity card */}
        <BentoCard accentColor="#8b5cf6">
          <h3 className="text-base font-bold text-white mb-4">🪪 Node Identity</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Provider Address</label>
              <div className="piso-input font-mono text-xs break-all select-all">
                {data?.identity?.id ?? 'Not registered'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <p className="font-bold text-sm" style={{ color: data?.identity?.registrationStatus === 'Registered' ? '#34d399' : '#fbbf24' }}>
                  {data?.identity?.registrationStatus ?? '—'}
                </p>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                <p className="text-xs text-slate-500 mb-1">Channel Balance</p>
                <p className="font-bold text-sm text-purple-400 font-mono">
                  {data?.identity ? formatMystInPiso(data.identity.balance).pisoStr : '—'}
                </p>
              </div>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <p className="text-xs text-slate-500 mb-1">Total Lifetime Earnings (Price Oracle Feed)</p>
              <p className="font-bold text-lg text-emerald-400 font-mono">
                {data?.identity ? formatMystInPiso(data.identity.earningsTotal).pisoStr : '—'}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {data?.identity ? `(${formatMyst(data.identity.earningsTotal)})` : ''}
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Service control */}
        <BentoCard accentColor="#06b6d4">
          <h3 className="text-base font-bold text-white mb-4">⚡ Service Control</h3>
          <div className="space-y-4">
            {/* Service status */}
            <div className={`flex items-center justify-between p-4 rounded-xl ${runningService ? 'bg-emerald-900/20 border border-emerald-700/30' : 'bg-slate-800/50 border border-slate-700/30'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${runningService ? 'pulse-green' : 'bg-slate-600'}`} />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {runningService ? `${runningService.type.toUpperCase()} Service` : 'Service Stopped'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {runningService ? `ID: ${runningService.id.slice(0, 12)}...` : 'WireGuard not running'}
                  </p>
                </div>
              </div>
              <span className={`badge text-xs ${runningService ? 'badge-green' : 'badge-amber'}`}>
                {runningService?.status ?? 'NotRunning'}
              </span>
            </div>

            {/* Toggle button */}
            <button
              onClick={toggleService}
              disabled={serviceLoading || !data?.identity}
              className="btn w-full font-bold text-sm"
              style={{
                background: runningService
                  ? '#ef4444'
                  : serviceLoading
                    ? 'rgba(6,182,212,0.3)'
                    : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: '#fff',
              }}
            >
              {serviceLoading
                ? '⏳ Processing...'
                : runningService
                  ? '⏹ Stop WireGuard Service'
                  : '▶️ Start WireGuard Service'}
            </button>

            {/* NAT + build info */}
            <div className="text-xs text-slate-500 space-y-1 font-mono">
              <div>NAT: <span className={data?.nat?.status === 'successful' ? 'text-emerald-400' : 'text-amber-400'}>{data?.nat?.status ?? '—'}</span></div>
              <div>Build: <span className="text-slate-400">{data?.health?.buildInfo?.commit?.slice(0, 8) ?? '—'}</span></div>
              {data?.nat?.error && <div className="text-red-400">⚠ {data.nat.error}</div>}
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Earnings chart */}
      <BentoCard accentColor="#8b5cf6">
        <h3 className="text-base font-bold text-white mb-4">💎 MYST Earnings (24h)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={earningsHistory}>
            <defs>
              <linearGradient id="mystGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
            <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={55} tickFormatter={(v) => `${v.toFixed(4)}`} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '10px', fontSize: '12px' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(v: any) => [
                `${Number(v ?? 0).toFixed(6)} MYST (₱${(Number(v ?? 0) * MYST_TO_PISO_RATE).toFixed(2)} PISO)`,
                'Earnings',
              ]}
            />
            <Area type="monotone" dataKey="myst" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#mystGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </BentoCard>

      {/* Sessions table */}
      <BentoCard accentColor="#06b6d4">
        <h3 className="text-base font-bold text-white mb-4">
          📡 Session History
          <span className="ml-2 badge badge-blue text-xs">{data?.sessions.length ?? 0} sessions</span>
        </h3>
        {data?.sessions && data.sessions.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="piso-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Consumer</th>
                  <th>Country</th>
                  <th>Duration</th>
                  <th>Data ↓ / ↑</th>
                  <th>Earned (PISO / MYST)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.map((s) => (
                  <tr key={s.id}>
                    <td className="mono text-xs text-blue-400">{s.id.slice(0, 10)}…</td>
                    <td className="mono text-xs">{s.consumerID.slice(0, 12)}…</td>
                    <td className="text-center">{s.consumerCountry || '🌍'}</td>
                    <td className="mono">{formatDuration(s.duration)}</td>
                    <td className="mono text-xs">
                      {formatBytes(s.bytesReceived)} / {formatBytes(s.bytesSent)}
                    </td>
                    <td className="mono font-bold text-emerald-400 text-xs">
                      {formatMystInPiso(s.tokens).pisoStr} <span className="text-slate-500 font-normal">({formatMyst(s.tokens)})</span>
                    </td>
                    <td>
                      <span className={`badge text-xs ${
                        s.status.includes('Established') ? 'badge-green' :
                        s.status === 'Completed' ? 'badge-blue' : 'badge-amber'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">No sessions yet. Start the WireGuard service to begin accepting connections.</p>
          </div>
        )}
      </BentoCard>

      {/* What is Mysterium */}
      <WhatIsMysterium />
    </div>
  )
}

// ── Info section ──────────────────────────────────────────────────────────────
function WhatIsMysterium() {
  const features = [
    { icon: '🔒', title: 'WireGuard VPN', desc: 'State-of-the-art VPN tunneling protocol. Fast, modern, cryptographically sound.' },
    { icon: '💎', title: 'Earn MYST Tokens', desc: 'Get paid in MYST tokens for every GB of bandwidth you share with VPN consumers.' },
    { icon: '🌍', title: 'Global Network', desc: 'Nodes in 130+ countries. Consumers choose exit locations for privacy and access.' },
    { icon: '🔗', title: 'PISO Chain DePIN', desc: 'Combines with PISO Chain validators for dual DePIN token earning (PISO + MYST).' },
    { icon: '⛓️', title: 'On-Chain Payments', desc: 'MYST payments settled on Polygon via Hermes payment channels. Zero trust.' },
    { icon: '🐳', title: 'Docker Ready', desc: 'One docker-compose command to deploy. Integrates seamlessly with PISO Chain node stack.' },
  ]

  return (
    <BentoCard accentColor="#8b5cf6">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
        🌐 About Mysterium Network
      </h3>
      <p className="text-slate-400 text-sm mb-5">
        Mysterium Network is a decentralized VPN (dVPN) built on blockchain technology.
        Node operators share unused bandwidth and earn <strong className="text-purple-400">MYST tokens</strong>.
        Integrated with PISO Chain, your validator node can simultaneously serve as a Mysterium exit node.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="p-4 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <div className="text-2xl mb-2">{f.icon}</div>
            <h4 className="text-sm font-bold text-purple-300 mb-1">{f.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-5">
        <a href="https://mysterium.network" target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">🏠 Homepage</a>
        <a href="https://github.com/mysteriumnetwork/node" target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">⭐ GitHub</a>
        <a href="https://help.mystnodes.com" target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">📖 Help Center</a>
      </div>
    </BentoCard>
  )
}
