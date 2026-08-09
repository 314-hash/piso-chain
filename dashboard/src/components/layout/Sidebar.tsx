import { NavLink } from 'react-router-dom'
import { X, Zap } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { to: '/', label: 'Overview & Analytics', icon: '📊', exact: true },
  {
    to: '/pow', label: 'PoW Mining Studio', icon: '⛏️',
    style: { background: 'rgba(245,158,11,0.12)', borderColor: '#f59e0b' },
  },
  {
    to: '/sakura', label: 'Sakura AI Agent Layer', icon: '🌸',
    style: { background: 'rgba(244,114,182,0.12)', borderColor: '#f472b6' },
  },
  {
    to: '/mysterium', label: 'Mysterium dVPN Node', icon: '🌐',
    style: { background: 'rgba(139,92,246,0.12)', borderColor: '#8b5cf6' },
  },
  {
    to: '/wallet', label: 'Wallet Studio (Mainnet)', icon: '👛',
    style: { background: 'rgba(6,182,212,0.12)', borderColor: '#06b6d4' },
  },
  {
    to: '/swap', label: 'PISOSwap DEX', icon: '🔀',
    style: { background: 'rgba(59,130,246,0.12)', borderColor: '#3b82f6' },
  },
  {
    to: '/bridge', label: 'Cross-Chain Bridge', icon: '🌉',
    style: { background: 'rgba(14,165,233,0.12)', borderColor: '#0ea5e9' },
  },
  {
    to: '/freqtrade', label: 'Trading Bot (Freqtrade)', icon: '📈',
    style: { background: 'rgba(16,185,129,0.12)', borderColor: '#10b981' },
  },
  {
    to: '/contracts', label: 'System Contracts Hub', icon: '📜',
    style: { background: 'rgba(16,185,129,0.12)', borderColor: '#10b981' },
  },
  {
    to: '/enterprise', label: 'Enterprise Suite', icon: '🚀',
    style: { background: 'rgba(168,85,247,0.12)', borderColor: '#a855f7' },
  },
  {
    to: '/explorer', label: 'Explorer & RPC', icon: '🔍',
    style: {},
  },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`
        fixed md:static top-0 left-0 h-full z-50 w-64 flex flex-col
        bg-dark-800 border-r border-card-border
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-card-border">
        <div className="relative flex-shrink-0">
          <img
            src="/piso_logo.jpg"
            alt="PISO Logo"
            className="w-9 h-9 rounded-full object-cover border-2 border-piso-gold shadow-glow-gold"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-green border-2 border-dark-800 pulse-green" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight leading-none">
            PISO <span className="text-accent-cyan">CHAIN</span>
          </span>
          <span className="text-xs text-slate-500 font-mono">Chain ID: 2026001</span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden ml-auto p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            style={item.style ? { ...item.style, borderColor: item.style?.borderColor ? `${item.style.borderColor}33` : undefined } : undefined}
          >
            <span className="text-lg leading-none flex-shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Network status badge */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-accent-green/8 border border-accent-green/20">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 pulse-green" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white leading-tight">Mainnet Parlia</p>
            <p className="text-xs text-slate-500 font-mono truncate">RPC: piso-rpc-dev.loca.lt</p>
          </div>
          <Zap size={14} className="text-accent-green flex-shrink-0" />
        </div>
      </div>
    </aside>
  )
}
