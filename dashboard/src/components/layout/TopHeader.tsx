import { Menu, Search, Wallet } from 'lucide-react'
import { useState } from 'react'

interface TopHeaderProps {
  onHamburger: () => void
}

export default function TopHeader({ onHamburger }: TopHeaderProps) {
  const [connected, setConnected] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = () => {
    if (searchValue.trim()) {
      alert(`Searching: ${searchValue}`)
    }
  }

  const handleAddMetaMask = async () => {
    const win = window as any
    if (win.ethereum) {
      try {
        await win.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x1EED91',
            chainName: 'PISO Chain Mainnet',
            nativeCurrency: { name: 'PISO', symbol: 'PISO', decimals: 18 },
            rpcUrls: ['https://piso-rpc-dev.loca.lt'],
            blockExplorerUrls: ['https://piso-chain.vercel.app/explorer'],
          }],
        })
      } catch (e: any) {
        alert('MetaMask error: ' + e.message)
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask.')
    }
  }

  const handleConnect = async () => {
    const win = window as any
    if (win.ethereum) {
      try {
        await win.ethereum.request({ method: 'eth_requestAccounts' })
        setConnected(true)
      } catch {
        alert('Connection rejected.')
      }
    } else {
      alert('Please install MetaMask to connect your wallet.')
    }
  }

  return (
    <header className="flex items-center gap-3 px-3 md:px-6 py-3 bg-dark-800/80 backdrop-blur-lg border-b border-card-border sticky top-0 z-30">
      {/* Mobile hamburger */}
      <button
        onClick={onHamburger}
        className="md:hidden p-2.5 rounded-xl bg-card border border-card-border text-slate-400 hover:text-white hover:border-accent-blue transition-all flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2 flex-shrink-0">
        <span className="font-black text-base">
          ⚡ PISO <span className="text-accent-cyan">CHAIN</span>
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-1 flex gap-2 max-w-xl">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Block #, Tx Hash, or Address…"
            className="w-full bg-dark-700 border border-card-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/10 transition-all"
          />
        </div>
        <button
          onClick={handleSearch}
          className="btn btn-primary-blue px-4 py-2 text-sm rounded-xl hidden sm:flex"
        >
          Search
        </button>
      </div>

      {/* Header actions */}
      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        {/* RPC status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-dark-700 border border-card-border rounded-xl text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full pulse-green" />
          <span className="font-mono">RPC Online</span>
        </div>

        {/* Add to MetaMask */}
        <button
          onClick={handleAddMetaMask}
          className="btn text-sm px-3 py-2 rounded-xl text-white font-bold hidden md:flex"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          🦊 Add Network
        </button>

        {/* Connect Wallet */}
        <button
          onClick={handleConnect}
          className={`btn text-sm px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 ${
            connected
              ? 'bg-accent-green/15 border border-accent-green/30 text-emerald-400'
              : 'bg-dark-700 border border-card-border text-slate-300 hover:border-accent-blue hover:text-white'
          }`}
        >
          <Wallet size={14} />
          <span className="hidden sm:inline">{connected ? 'Connected' : 'Connect'}</span>
        </button>
      </div>
    </header>
  )
}
