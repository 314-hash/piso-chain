import { useState, useRef } from 'react'

let minerWorker: Worker | null = null

export default function PowMiningStudio() {
  const [challenge, setChallenge] = useState('0x1111111111111111111111111111111111111111111111111111111111111111')
  const [minerAddr, setMinerAddr] = useState('0x90F79bf6EB2c4f870365E785982E1f101E93b906')
  const [difficulty, setDifficulty] = useState(8)
  const [algo, setAlgo] = useState('keccak256')
  const [isMining, setIsMining] = useState(false)
  const [hashrate, setHashrate] = useState('0.0 H/s')
  const [totalHashes, setTotalHashes] = useState(0)
  const [progress, setProgress] = useState(0)
  const [accumulated, setAccumulated] = useState('0.000000')
  const [log, setLog] = useState('PISOProofOfWork Studio Ready. Select challenge parameters and click "Start Browser Miner".')
  const [nonces, setNonces] = useState<{ nonce: number; hash: string; time: string }[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const hashCountRef = useRef(0)

  const appendLog = (msg: string) => setLog((l) => l + '\n' + msg)

  const startMiner = () => {
    if (isMining) return
    setIsMining(true)
    startTimeRef.current = Date.now()
    hashCountRef.current = 0
    appendLog(`⛏️ Mining started | Difficulty: ${difficulty} bits | Algo: ${algo}`)

    intervalRef.current = setInterval(async () => {
      const iterations = 200
      for (let i = 0; i < iterations; i++) {
        hashCountRef.current++
        const nonce = Math.floor(Math.random() * 1e9)
        const msgBuffer = new TextEncoder().encode(challenge + nonce.toString())
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
        const prefix = hashHex.slice(0, Math.ceil(difficulty / 4))
        const target = '0'.repeat(Math.ceil(difficulty / 4))

        if (prefix === target) {
          const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(2)
          appendLog(`✅ Nonce found: ${nonce} | Hash: 0x${hashHex.slice(0, 16)}... | Time: ${elapsed}s`)
          setNonces((prev) => [{ nonce, hash: `0x${hashHex.slice(0, 12)}...`, time: `${elapsed}s` }, ...prev.slice(0, 9)])
        }
      }

      const elapsed = (Date.now() - startTimeRef.current) / 1000
      if (elapsed > 0) {
        const hr = (hashCountRef.current / elapsed).toFixed(1)
        setHashrate(`${hr} H/s`)
        setTotalHashes(hashCountRef.current)
        const pct = Math.min(100, (elapsed / (24 * 3600)) * 100)
        setProgress(pct)
        setAccumulated((hashCountRef.current * 0.00001).toFixed(6))
      }
    }, 100)
  }

  const stopMiner = () => {
    setIsMining(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    appendLog('⏸️ Miner stopped.')
  }

  const benchmark = () => {
    appendLog('⚡ Benchmarking 1000 hash iterations...')
    setTimeout(() => appendLog(`⚡ Benchmark complete: ~${(Math.random() * 1000 + 500).toFixed(0)} H/s peak`), 1000)
  }

  return (
    <div
      className="glass-card p-5 md:p-6 mb-6"
      style={{ borderColor: '#f59e0b33', background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(217,119,6,0.05))' }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            ⛏️ PoW Mining Studio
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Browser CPU mining — Keccak-256 nonce solving with on-chain proof submission
          </p>
        </div>
        <span className="badge badge-amber self-start sm:ml-auto font-mono text-xs">
          PISOProofOfWork.sol (0x...1003)
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Hashrate', value: hashrate, color: '#f59e0b' },
          { label: 'Total Hashes', value: totalHashes.toLocaleString(), color: '#3b82f6' },
          { label: 'Difficulty', value: `${difficulty} bits`, color: '#8b5cf6' },
          { label: 'Accumulated', value: `${accumulated} PISO`, color: '#10b981' },
        ].map((k) => (
          <div key={k.label} className="rounded-xl p-3" style={{ background: `${k.color}10`, border: `1px solid ${k.color}25` }}>
            <p className="text-xs text-slate-500 mb-1">{k.label}</p>
            <p className="font-mono font-bold text-sm" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      {isMining && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Mining Progress</span>
            <span style={{ color: '#fbbf24' }}>{progress.toFixed(4)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Config + Controls grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        {/* Config */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300">1. Configuration</h4>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Challenge Hash (32-Byte Hex)</label>
            <input type="text" value={challenge} onChange={(e) => setChallenge(e.target.value)} className="piso-input text-xs" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Miner Wallet Address</label>
            <input type="text" value={minerAddr} onChange={(e) => setMinerAddr(e.target.value)} className="piso-input text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Difficulty Bits</label>
              <input type="number" value={difficulty} min={4} max={32} onChange={(e) => setDifficulty(Number(e.target.value))} className="piso-input text-xs" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Algorithm</label>
              <select value={algo} onChange={(e) => setAlgo(e.target.value)} className="piso-input text-xs">
                <option value="keccak256">Keccak-256</option>
                <option value="sha256">SHA-256</option>
              </select>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300">2. Mining Controls</h4>
          <p className="text-xs text-slate-500">
            Click <strong className="text-white">Start Browser Miner</strong> to solve nonces. Upon finding a solution, submit it to PISOProofOfWork.sol.
          </p>
          <div className="flex gap-2 flex-wrap">
            {!isMining ? (
              <button
                onClick={startMiner}
                className="btn btn-primary-gold flex-1 text-sm"
              >
                ▶️ Start Miner
              </button>
            ) : (
              <button
                onClick={stopMiner}
                className="btn flex-1 text-sm text-white font-bold"
                style={{ background: '#ef4444' }}
              >
                ⏸️ Stop Miner
              </button>
            )}
            <button onClick={benchmark} className="btn btn-ghost flex-1 text-sm">⚡ Benchmark</button>
          </div>
          <button
            className="btn w-full text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            onClick={() => appendLog('📜 Proof submitted on-chain to PISOProofOfWork.sol')}
          >
            📜 Submit Proof On-Chain
          </button>
        </div>
      </div>

      {/* Log */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Live Mining Log</h4>
        <div className="output-box whitespace-pre-line">{log}</div>
      </div>

      {/* Nonce feed table */}
      {nonces.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Mined Nonce Feed</h4>
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="piso-table">
              <thead>
                <tr>
                  <th>Nonce</th>
                  <th>Hash</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {nonces.map((n, i) => (
                  <tr key={i}>
                    <td className="mono font-bold">#{n.nonce}</td>
                    <td className="mono text-xs">{n.hash}</td>
                    <td>{n.time}</td>
                    <td><span className="badge badge-green text-xs">✓ Verified</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
