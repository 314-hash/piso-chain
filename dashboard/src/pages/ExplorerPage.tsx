import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { callJsonRpc, getGenesisAllocation } from '../services/web3'
import BentoCard from '../components/ui/BentoCard'
import KpiCard from '../components/ui/KpiCard'

interface BlockItem {
  number: number
  hash: string
  txns: number
  validator: string
  time: string
  gas: string
}

interface TxnItem {
  hash: string
  from: string
  to: string
  value: string
  status: string
  block?: number
}

export default function ExplorerPage() {
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [rpcConnected, setRpcConnected] = useState(false)
  const [latestBlockHeight, setLatestBlockHeight] = useState(1248)
  const [totalTxns, setTotalTxns] = useState(14832)
  const [avgGas, setAvgGas] = useState('0.0021 Gwei')
  
  const [blocks, setBlocks] = useState<BlockItem[]>([
    { number: 1248, hash: '0x8f4e2ca3b1d726b2c918ef0e9a7dfbd48bbee482d8a4f6e5d4c3b2a1f0ef6c2e0', txns: 3, validator: '0xB5A7...82D8', time: '3s ago', gas: '0.0021 Gwei' },
    { number: 1247, hash: '0x7d3f1bc4a2f726b2c918ef0e9a7dfbd48bbee482d8a4f6e5d4c3b2a1f0ef6c2e1', txns: 1, validator: '0xB5A7...82D8', time: '6s ago', gas: '0.0018 Gwei' },
    { number: 1246, hash: '0x6c2e0ab3d1f726b2c918ef0e9a7dfbd48bbee482d8a4f6e5d4c3b2a1f0ef6c2e2', txns: 4, validator: '0xB5A7...82D8', time: '9s ago', gas: '0.0024 Gwei' },
    { number: 1245, hash: '0x5b1d9ea2c0f726b2c918ef0e9a7dfbd48bbee482d8a4f6e5d4c3b2a1f0ef6c2e3', txns: 0, validator: '0xB5A7...82D8', time: '12s ago', gas: '0.0000 Gwei' },
    { number: 1244, hash: '0x4a0c8d91bff726b2c918ef0e9a7dfbd48bbee482d8a4f6e5d4c3b2a1f0ef6c2e4', txns: 5, validator: '0xB5A7...82D8', time: '15s ago', gas: '0.0031 Gwei' },
  ])

  const [txns, setTxns] = useState<TxnItem[]>([
    { hash: '0x1f2e3da4b5c726b2c918ef0e9a7dfbd48bbee482d8a4f6e5d4c3b2a1f0ef6c2e0', from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', to: '0x0000000000000000000000000000000000001000', value: '100.00 PISO', status: 'Success', block: 1248 },
    { hash: '0x2a3b4cb5c6c726b2c918ef0e9a7dfbd48bbee482d8a4f6e5d4c3b2a1f0ef6c2e1', from: '0xB5A772355e12CA975C175C9a7CFBD48BBEE482D8', to: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', value: '50.00 PISO', status: 'Success', block: 1248 },
    { hash: '0x3b4c5dc6d7c726b2c918ef0e9a7dfbd48bbee482d8a4f6e5d4c3b2a1f0ef6c2e2', from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', to: '0x0000000000000000000000000000000000001001', value: '0.00 PISO', status: 'Success', block: 1247 },
  ])

  // Inspected detail state
  const [inspectedItem, setInspectedItem] = useState<{
    type: 'block' | 'tx' | 'address'
    query: string
    data: any
  } | null>(null)
  
  const [searchError, setSearchError] = useState('')

  // Poll RPC data & fallback simulation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blockNumberHex = await callJsonRpc('eth_blockNumber', [])
        if (blockNumberHex && blockNumberHex.startsWith('0x')) {
          setRpcConnected(true)
          const blockNum = parseInt(blockNumberHex, 16)
          setLatestBlockHeight(blockNum)

          // Fetch recent blocks
          const blockList: BlockItem[] = []
          const txnList: TxnItem[] = []

          // Fetch last 5 blocks
          for (let i = 0; i < 5; i++) {
            const targetNum = blockNum - i
            if (targetNum < 0) break
            
            const blockData = await callJsonRpc('eth_getBlockByNumber', ['0x' + targetNum.toString(16), true])
            if (blockData) {
              const gasUsed = parseInt(blockData.gasUsed, 16)
              blockList.push({
                number: targetNum,
                hash: blockData.hash,
                txns: blockData.transactions ? blockData.transactions.length : 0,
                validator: blockData.miner ? `${blockData.miner.slice(0, 6)}...${blockData.miner.slice(-4)}` : '0x0000...0000',
                time: i === 0 ? 'Just now' : `${i * 3}s ago`,
                gas: `${(gasUsed / 1e9).toFixed(4)} Gwei`
              })

              // Populate up to 5 transactions
              if (blockData.transactions && txnList.length < 5) {
                blockData.transactions.forEach((tx: any) => {
                  if (txnList.length < 5) {
                    const valueHex = tx?.value || '0x0'
                    const wei = BigInt(valueHex)
                    const valPiso = Number(wei) / 1e18
                    txnList.push({
                      hash: tx.hash,
                      from: tx.from,
                      to: tx.to || '0x0000...0000 (Contract Deployment)',
                      value: `${valPiso.toFixed(2)} PISO`,
                      status: 'Success',
                      block: targetNum
                    })
                  }
                })
              }
            }
          }

          if (blockList.length > 0) setBlocks(blockList)
          if (txnList.length > 0) setTxns(txnList)
        }
      } catch (err) {
        // Fallback offline simulator: increment block height every 3 seconds
        setRpcConnected(false)
        setLatestBlockHeight((prevHeight) => prevHeight + 1)

        const blockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
        const txCount = Math.floor(Math.random() * 4) // 0-3 transactions
        
        setBlocks((prevBlocks) => [
          {
            number: latestBlockHeight + 1,
            hash: blockHash,
            txns: txCount,
            validator: '0xB5A7...82D8',
            time: 'Just now',
            gas: txCount > 0 ? `${(Math.random() * 0.005 + 0.001).toFixed(4)} Gwei` : '0.0000 Gwei'
          },
          ...prevBlocks.map((b, idx) => ({ ...b, time: `${(idx + 1) * 3}s ago` })).slice(0, 4)
        ])

        if (txCount > 0) {
          const newSimTxns: TxnItem[] = []
          for (let t = 0; t < txCount; t++) {
            const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
            newSimTxns.push({
              hash: txHash,
              from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
              to: '0xB5A772355e12CA975C175C9a7CFBD48BBEE482D8',
              value: `${(Math.random() * 25 + 1).toFixed(2)} PISO`,
              status: 'Success',
              block: latestBlockHeight + 1
            })
          }
          setTxns((prevTxns) => [...newSimTxns, ...prevTxns].slice(0, 5))
          setTotalTxns((t) => t + txCount)
        }
      }
    }

    fetchData()
    const timer = setInterval(fetchData, 3000)
    return () => clearInterval(timer)
  }, [])

  const executeSearch = async (query: string) => {
    setSearchError('')
    setInspectedItem(null)
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setSearchError('Please enter a query.')
      return
    }

    try {
      // 1. EVM Account Address Search
      if (trimmedQuery.startsWith('0x') && trimmedQuery.length === 42) {
        try {
          const balanceHex = await callJsonRpc('eth_getBalance', [trimmedQuery, 'latest'])
          const txCountHex = await callJsonRpc('eth_getTransactionCount', [trimmedQuery, 'latest'])
          const wei = BigInt(balanceHex)
          const piso = Number(wei) / 1e18

          setInspectedItem({
            type: 'address',
            query: trimmedQuery,
            data: {
              balance: `${piso.toLocaleString()} PISO`,
              nonce: parseInt(txCountHex, 16),
              genesis: getGenesisAllocation(trimmedQuery),
              status: 'Live Web3 Account Data'
            }
          })
        } catch {
          // Offline fallback
          const genesis = getGenesisAllocation(trimmedQuery)
          setInspectedItem({
            type: 'address',
            query: trimmedQuery,
            data: {
              balance: genesis.balance,
              nonce: 0,
              genesis,
              status: 'Offline Allocation Map Cache'
            }
          })
        }
      } 
      // 2. Transaction Hash Search
      else if (trimmedQuery.startsWith('0x') && trimmedQuery.length === 66) {
        try {
          const txInfo = await callJsonRpc('eth_getTransactionByHash', [trimmedQuery])
          const txReceipt = await callJsonRpc('eth_getTransactionReceipt', [trimmedQuery])
          
          if (!txInfo) throw new Error('Not found')
          
          const wei = BigInt(txInfo.value)
          const piso = Number(wei) / 1e18

          setInspectedItem({
            type: 'tx',
            query: trimmedQuery,
            data: {
              status: txReceipt && parseInt(txReceipt.status, 16) === 1 ? 'Success' : 'Pending/Failed',
              block: txInfo.blockNumber ? parseInt(txInfo.blockNumber, 16) : 'Pending',
              from: txInfo.from,
              to: txInfo.to || 'Contract Deployment',
              value: `${piso.toLocaleString()} PISO`,
              gasLimit: parseInt(txInfo.gas, 16).toLocaleString(),
              gasUsed: txReceipt ? parseInt(txReceipt.gasUsed, 16).toLocaleString() : 'N/A',
              nonce: parseInt(txInfo.nonce, 16),
              mode: 'Live JSON-RPC Broadcast Receipt'
            }
          })
        } catch {
          // Offline fallback
          setInspectedItem({
            type: 'tx',
            query: trimmedQuery,
            data: {
              status: 'Success',
              block: latestBlockHeight - 1,
              from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
              to: '0xB5A772355e12CA975C175C9a7CFBD48BBEE482D8',
              value: '50.00 PISO',
              gasLimit: '21,000',
              gasUsed: '21,000',
              nonce: 2,
              mode: 'Simulated Local Database Transaction'
            }
          })
        }
      } 
      // 3. Block Number Search
      else if (/^\d+$/.test(trimmedQuery)) {
        const num = parseInt(trimmedQuery)
        try {
          const blockData = await callJsonRpc('eth_getBlockByNumber', ['0x' + num.toString(16), false])
          if (!blockData) throw new Error('Not found')
          
          setInspectedItem({
            type: 'block',
            query: trimmedQuery,
            data: {
              hash: blockData.hash,
              parentHash: blockData.parentHash,
              miner: blockData.miner,
              txns: blockData.transactions ? blockData.transactions.length : 0,
              size: parseInt(blockData.size, 16).toLocaleString() + ' bytes',
              gasLimit: parseInt(blockData.gasLimit, 16).toLocaleString(),
              gasUsed: parseInt(blockData.gasUsed, 16).toLocaleString(),
              timestamp: new Date(parseInt(blockData.timestamp, 16) * 1000).toLocaleString(),
              mode: 'Live JSON-RPC Block'
            }
          })
        } catch {
          // Offline fallback
          setInspectedItem({
            type: 'block',
            query: trimmedQuery,
            data: {
              hash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
              parentHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
              miner: '0xB5A772355e12CA975C175C9a7CFBD48BBEE482D8',
              txns: 2,
              size: '420 bytes',
              gasLimit: '30,000,000',
              gasUsed: '42,000',
              timestamp: new Date().toLocaleString(),
              mode: 'Simulated block database fallback'
            }
          })
        }
      } else {
        setSearchError('Invalid query format. Address must be 42 chars, Tx hash must be 66 chars, block must be a number.')
      }
    } catch (e: any) {
      setSearchError('Search failed: ' + e.message)
    }
  }

  const handleSearch = () => {
    executeSearch(searchQuery)
  }

  // Trigger search on mount/update if 'q' search param changes
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setSearchQuery(q)
      executeSearch(q)
    }
  }, [searchParams])

  return (
    <div className="space-y-5 slide-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white">🔍 Blockchain Explorer & RPC Hub</h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time block production tracker, address balances, transaction proofs, and client state
          </p>
        </div>
        <span className={`badge ${rpcConnected ? 'badge-green' : 'badge-amber'} py-1.5 px-3 font-mono`}>
          {rpcConnected ? '🟢 RPC CONNECTED' : '🟡 RPC OFFLINE (SIMULATING)'}
        </span>
      </div>

      {/* Search BentoCard */}
      <BentoCard accentColor="#06b6d4">
        <div className="space-y-3">
          <label className="text-xs text-slate-400 font-bold block">Inspect PISO L1 Ledger State</label>
          <div className="flex gap-2.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="piso-input flex-1 font-mono text-xs"
              placeholder="Search EVM Account Address, Tx Hash (0x...), or Block Height..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
            />
            <button onClick={handleSearch} className="btn btn-primary-blue text-xs font-bold px-5">
              🔍 Search
            </button>
          </div>
          {searchError && <p className="text-red-400 text-xs font-mono">{searchError}</p>}
        </div>
      </BentoCard>

      {/* Inspected Item View */}
      {inspectedItem && (
        <BentoCard accentColor="#ec4899">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h3 className="font-black text-white text-base flex items-center gap-1.5">
                <span>📋</span> Inspected {inspectedItem.type.toUpperCase()} details
              </h3>
              <button
                onClick={() => setInspectedItem(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close Details
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs space-y-2 text-slate-300">
              <div className="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500 font-bold">Query Input:</span>
                <span className="text-cyan-400 break-all select-all font-bold">{inspectedItem.query}</span>
              </div>

              {inspectedItem.type === 'address' && (
                <>
                  <div className="flex justify-between">
                    <span>Balance PISO:</span>
                    <strong className="text-white">{inspectedItem.data.balance}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mempool Nonce:</span>
                    <strong className="text-white">{inspectedItem.data.nonce}</strong>
                  </div>
                  <div className="flex flex-col pt-1.5">
                    <span className="text-slate-500">Genesis Map Note:</span>
                    <span className="text-purple-300 italic">{inspectedItem.data.genesis.note}</span>
                  </div>
                </>
              )}

              {inspectedItem.type === 'tx' && (
                <>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="badge badge-green text-[10px]">✓ {inspectedItem.data.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confirmed in Block:</span>
                    <strong className="text-white">#{inspectedItem.data.block}</strong>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500">From Sender Address:</span>
                    <span className="text-white break-all">{inspectedItem.data.from}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500">To Recipient Address:</span>
                    <span className="text-white break-all">{inspectedItem.data.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Asset Swapped / Sent:</span>
                    <strong className="text-emerald-400">{inspectedItem.data.value}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas limit / gas used:</span>
                    <span className="text-slate-400">{inspectedItem.data.gasLimit} / {inspectedItem.data.gasUsed}</span>
                  </div>
                </>
              )}

              {inspectedItem.type === 'block' && (
                <>
                  <div className="flex flex-col">
                    <span className="text-slate-500">Block Hash:</span>
                    <span className="text-white break-all">{inspectedItem.data.hash}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500">Parent Block Hash:</span>
                    <span className="text-slate-400 break-all">{inspectedItem.data.parentHash}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500">Consensus Validator:</span>
                    <span className="text-white break-all">{inspectedItem.data.miner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transactions Enclosed:</span>
                    <strong className="text-white">{inspectedItem.data.txns} txns</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas capacity / gas used:</span>
                    <span className="text-slate-400">{inspectedItem.data.gasLimit} / {inspectedItem.data.gasUsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Block Timestamp:</span>
                    <span className="text-slate-300">{inspectedItem.data.timestamp}</span>
                  </div>
                </>
              )}

              <div className="border-t border-white/5 pt-2 flex justify-between text-[10px] text-slate-500">
                <span>Database Source:</span>
                <span>{inspectedItem.data.mode || inspectedItem.data.status}</span>
              </div>
            </div>
          </div>
        </BentoCard>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KpiCard title="Latest Block" value={`#${latestBlockHeight.toLocaleString()}`} icon="📦" highlightColor="#3b82f6" />
        <KpiCard title="Transactions Logged" value={totalTxns.toLocaleString()} icon="🔄" highlightColor="#10b981" />
        <KpiCard title="Active Consensus Nodes" value="1 / 21" icon="✅" highlightColor="#8b5cf6" />
        <KpiCard title="Average Gas Price" value={avgGas} icon="⛽" highlightColor="#f59e0b" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Latest Blocks */}
        <BentoCard accentColor="#3b82f6">
          <h3 className="font-bold text-white text-base mb-3.5 flex items-center gap-1.5">
            <span>📦</span> Real-Time Blocks Production Stream
          </h3>
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="piso-table text-xs">
              <thead>
                <tr>
                  <th>Block Height</th>
                  <th>Block Hash</th>
                  <th>Txns</th>
                  <th>Consensus Fee Recipient</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                {blocks.map((b) => (
                  <tr key={b.number} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-blue-400">#{b.number}</td>
                    <td className="py-2.5 px-3 text-slate-400 select-all">{b.hash.slice(0, 16)}...</td>
                    <td className="py-2.5 px-3 text-white font-bold">{b.txns}</td>
                    <td className="py-2.5 px-3 text-slate-400">{b.validator}</td>
                    <td className="py-2.5 px-3 text-slate-500 italic text-[11px]">{b.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BentoCard>

        {/* Latest Transactions */}
        <BentoCard accentColor="#10b981">
          <h3 className="font-bold text-white text-base mb-3.5 flex items-center gap-1.5">
            <span>🔄</span> Real-Time Transactions Stream
          </h3>
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="piso-table text-xs">
              <thead>
                <tr>
                  <th>Transaction Hash</th>
                  <th>Sender</th>
                  <th>Recipient</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                {txns.map((t, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 text-blue-400 select-all">{t.hash.slice(0, 16)}...</td>
                    <td className="py-2.5 px-3 text-slate-400">{t.from.slice(0, 6)}...{t.from.slice(-4)}</td>
                    <td className="py-2.5 px-3 text-slate-400">{t.to.slice(0, 6)}...{t.to.slice(-4)}</td>
                    <td className="py-2.5 px-3 text-white font-bold">{t.value}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BentoCard>
      </div>
    </div>
  )
}
