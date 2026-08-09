import { NavLink } from 'react-router-dom'

const bottomNavItems = [
  { to: '/', label: 'Overview', icon: '📊', end: true },
  { to: '/mysterium', label: 'dVPN', icon: '🌐', end: false },
  { to: '/wallet', label: 'Wallet', icon: '👛', end: false },
  { to: '/swap', label: 'Swap', icon: '🔀', end: false },
  { to: '/sakura', label: 'AI', icon: '🌸', end: false },
]

export default function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav md:hidden">
      <div className="flex items-stretch">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-semibold transition-colors ${
                isActive ? 'text-accent-cyan' : 'text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl leading-tight">{item.icon}</span>
                <span className={`text-[10px] font-medium ${isActive ? 'text-accent-cyan' : 'text-slate-600'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 w-6 h-0.5 rounded-full bg-accent-cyan" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
