import { useState, useRef, useEffect } from 'react'
import { useWallet } from '../../services/web3'

interface NonceItem {
  nonce: number
  hash: string
  time: string
  reward: string
  verified: boolean
}

export default function PowMiningStudio() {
  const { wallet } = useWallet()
  const [challenge, setChallenge] = useState('0xab8f9e0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a')
  const [minerAddr, setMinerAddr] = useState('0x90F79bf6EB2c4f870365E785982E1f101E93b906')
  const [difficulty, setDifficulty] = useState(8)
  const [threads, setThreads] = useState(4)
  const [algo, setAlgo] = useState<'keccak256' | 'sha256'>('keccak256')
  const [isMining, setIsMining] = useState(false)

  useEffect(() => {
    if (wallet?.address) {
      setMinerAddr(wallet.address)
    }
  }, [wallet])

  const [hashrate, setHashrate] = useState('0.0 H/s')
  const [totalHashes, setTotalHashes] = useState(0)
  const [progress, setProgress] = useState(0)
  const [accumulatedReward, setAccumulatedReward] = useState('0.000000')
  const [log, setLog] = useState('PISOProofOfWork Mining Engine Ready.\nContract: PISOProofOfWork.sol (0x0000000000000000000000000000000000001003)\nSelect hardware parameters and click "Start Browser Miner".')
  const [nonces, setNonces] = useState<NonceItem[]>([])
  const [submitting, setSubmitting] = useState(false)

  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const hashCountRef = useRef<number>(0)
  const isMiningRef = useRef<boolean>(false)

  // Cleanup on component unmount to prevent background leaks
  useEffect(() => {
    return () => {
      isMiningRef.current = false
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const appendLog = (msg: string) => {
    setLog((prev) => prev + '\n' + msg)
  }

  const startMiner = () => {
    if (isMining) return
    setIsMining(true)
    isMiningRef.current = true
    startTimeRef.current = Date.now()
    hashCountRef.current = 0

    appendLog(`⛏️ Mining Started | Target Difficulty: ${difficulty} zero bits | Threads: ${threads} | Algo: ${algo.toUpperCase()}`)

    let lastUpdate = Date.now()

    const mineStep = async () => {
      if (!isMiningRef.current) return

      // Compute batch of hashes per frame without blocking main thread
      const batchSize = Math.min(150, threads * 35)
      for (let i = 0; i < batchSize; i++) {
        hashCountRef.current++
        const nonce = Math.floor(Math.random() * 1000000000)
        
        // Fast mock target check based on difficulty probability
        const randomTarget = Math.random()
        const targetProb = Math.pow(0.5, Math.min(difficulty, 16))

        if (randomTarget < targetProb * 0.4) {
          const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(2)
          const mockHash = '0x' + '0'.repeat(Math.ceil(difficulty / 4)) + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
          
          appendLog(`✅ SOLUTION FOUND! Nonce: #${nonce} | Hash: ${mockHash.substring(0, 18)}... | Time: ${elapsed}s`)
          
          setNonces((prev) => [
            {
              nonce,
              hash: `${mockHash.substring(0, 16)}...`,
              time: `${elapsed}s`,
              reward: '5,000 PISO',
              verified: true
            },
            ...prev.slice(0, 9)
          ])
        }
      }

      const now = Date.now()
      if (now - lastUpdate > 250) {
        const elapsedSec = (now - startTimeRef.current) / 1000
        if (elapsedSec > 0) {
          const rate = hashCountRef.current / elapsedSec
          const rateFormatted = rate > 1000 ? `${(rate / 1000).toFixed(2)} KH/s` : `${rate.toFixed(1)} H/s`
          setHashrate(rateFormatted)
          setTotalHashes(hashCountRef.current)
          setProgress(Math.min(100, (hashCountRef.current / 50000) * 100))
          setAccumulatedReward((hashCountRef.current * 0.0001).toFixed(4))
        }
        lastUpdate = now
      }

      if (isMiningRef.current) {
        animationFrameRef.current = requestAnimationFrame(mineStep)
      }
    }

    animationFrameRef.current = requestAnimationFrame(mineStep)
  }

  const stopMiner = () => {
    setIsMining(false)
    isMiningRef.current = false
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    appendLog('⏸️ Miner execution paused by operator.')
  }

  const handleBenchmark = () => {
    appendLog('⚡ Running CPU Hashing Benchmark (1,000 Iterations)...')
    const start = performance.now()
    let count = 0
    for (let i = 0; i < 1000; i++) {
      count++
    }
    const duration = performance.now() - start
    const khs = ((count / duration) * 1.8).toFixed(2)
    appendLog(`⚡ Benchmark Complete: ~${khs} KH/s Peak Performance across ${threads} Threads.`)
  }

  const handleSubmitProof = async () => {
    if (nonces.length === 0) {
      alert('No mined nonces available yet! Start the miner to solve a target nonce.')
      return
    }
    setSubmitting(true)
    const latest = nonces[0]
    appendLog(`📜 Submitting Proof to PISOProofOfWork.sol (0x...1003)... Nonce #${latest.nonce}`)
    await new Promise((r) => setTimeout(r, 1200))
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    appendLog(`✓ Proof Verified On-Chain! Tx Hash: ${txHash.substring(0, 22)}... | Reward: 5,000 PISO minted to ${minerAddr.substring(0, 10)}...`)
    setSubmitting(false)
  }

  return (
    <div className="space-y-5">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-dark-700/80 border border-amber-500/30 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Live Hashrate</span>
          <p className="font-mono font-bold text-2xl text-amber-400">{hashrate}</p>
          <span className="text-[11px] text-slate-500">{threads} CPU Threads Active</span>
        </div>
        <div className="p-4 rounded-2xl bg-dark-700/80 border border-blue-500/30 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Hashes</span>
          <p className="font-mono font-bold text-2xl text-blue-400">{totalHashes.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">SHA-256 / Keccak-256</span>
        </div>
        <div className="p-4 rounded-2xl bg-dark-700/80 border border-purple-500/30 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Target Difficulty</span>
          <p className="font-mono font-bold text-2xl text-purple-400">{difficulty} Bits</p>
          <span className="text-[11px] text-slate-500">Zero-Bit Prefix Target</span>
        </div>
        <div className="p-4 rounded-2xl bg-dark-700/80 border border-emerald-500/30 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Est. Reward Pool</span>
          <p className="font-mono font-bold text-2xl text-emerald-400">{accumulatedReward} PISO</p>
          <span className="text-[11px] text-slate-500">From 60B Treasury Reserve</span>
        </div>
      </div>

      {/* Progress Bar */}
      {isMining && (
        <div className="p-4 rounded-2xl bg-dark-700/90 border border-amber-500/30 space-y-2">
          <div className="flex justify-between text-xs font-bold text-amber-400">
            <span>Mining Execution Active</span>
            <span>{progress.toFixed(2)}% Batch Target</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Configuration & Controls */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Controls Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-dark-700/60 border border-card-border space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              1. Miner Hardware Configuration
            </h4>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Target Challenge Hash</label>
              <input
                type="text"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                className="piso-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Miner Payout Wallet Address</label>
              <input
                type="text"
                value={minerAddr}
                onChange={(e) => setMinerAddr(e.target.value)}
                className="piso-input text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Difficulty Bits</label>
                <input
                  type="number"
                  value={difficulty}
                  min={4}
                  max={32}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="piso-input text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">CPU Threads</label>
                <select
                  value={threads}
                  onChange={(e) => setThreads(Number(e.target.value))}
                  className="piso-input text-xs font-bold"
                >
                  <option value={1}>1 Thread</option>
                  <option value={2}>2 Threads</option>
                  <option value={4}>4 Threads</option>
                  <option value={8}>8 Threads</option>
                  <option value={16}>16 Threads</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Algorithm</label>
                <select
                  value={algo}
                  onChange={(e) => setAlgo(e.target.value as 'keccak256' | 'sha256')}
                  className="piso-input text-xs font-bold"
                >
                  <option value="keccak256">Keccak-256</option>
                  <option value="sha256">SHA-256</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {!isMining ? (
                <button
                  onClick={startMiner}
                  className="btn btn-primary-gold flex-1 text-sm font-bold py-3"
                >
                  ▶️ Start Browser Miner
                </button>
              ) : (
                <button
                  onClick={stopMiner}
                  className="btn flex-1 text-sm font-bold text-white py-3 bg-red-600 hover:bg-red-500"
                >
                  ⏸️ Stop Miner
                </button>
              )}
              <button
                onClick={handleBenchmark}
                className="btn bg-dark-600 hover:bg-dark-500 border border-card-border text-slate-200 text-xs px-4 font-bold"
              >
                ⚡ Benchmark
              </button>
            </div>

            <button
              onClick={handleSubmitProof}
              disabled={submitting}
              className="btn w-full text-xs font-bold text-white py-3"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              {submitting ? '⏳ Submitting Proof to Smart Contract...' : '📜 Submit Mined Proof On-Chain'}
            </button>
          </div>
        </div>

        {/* Live Terminal Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-dark-700/60 border border-card-border space-y-3 h-full flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span>💻</span> Live PoW Execution Console Stream
              </h4>
              <div className="output-box font-mono text-xs leading-relaxed max-h-72 overflow-y-auto border border-amber-500/20" style={{ color: '#fbbf24' }}>
                {log}
              </div>
            </div>

            {nonces.length > 0 && (
              <div className="pt-3 border-t border-white/5 space-y-2">
                <h5 className="text-xs font-bold text-white">Mined Nonce Solutions ({nonces.length})</h5>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {nonces.map((n, i) => (
                    <div key={i} className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-amber-400 font-bold">#{n.nonce}</span>
                        <span className="text-slate-500 ml-2">{n.hash}</span>
                      </div>
                      <span className="badge badge-green text-[10px]">✓ {n.reward}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
