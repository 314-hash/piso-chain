import { useEffect, useRef, useState } from 'react'

interface KpiCardProps {
  title: string
  value: string
  subtext?: string
  icon?: string
  highlightColor?: string
  delay?: number
}

export default function KpiCard({ title, value, subtext, icon, highlightColor = '#06b6d4', delay = 0 }: KpiCardProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 150)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      ref={ref}
      className={`kpi-card-inner glass-card p-5 transition-all duration-500 ${visible ? 'count-up opacity-100' : 'opacity-0'}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        {icon && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background: `${highlightColor}18`, border: `1px solid ${highlightColor}33` }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <p className="font-mono font-bold text-2xl md:text-3xl text-white leading-tight tracking-tight break-all">
        {value}
      </p>

      {/* Subtext */}
      {subtext && (
        <p className="text-xs text-slate-500 mt-2 leading-snug">{subtext}</p>
      )}

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-40"
        style={{ background: `linear-gradient(90deg, transparent, ${highlightColor}, transparent)` }}
      />
    </div>
  )
}
