import { ReactNode } from 'react'

interface BentoCardProps {
  children: ReactNode
  className?: string
  accentColor?: string
  span?: 1 | 2
}

export default function BentoCard({ children, className = '', accentColor, span = 1 }: BentoCardProps) {
  return (
    <div
      className={`
        glass-card p-5 md:p-6 relative overflow-hidden
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-card-hover
        ${span === 2 ? 'md:col-span-2' : ''}
        ${className}
      `}
      style={accentColor ? {
        borderColor: `${accentColor}33`,
        boxShadow: `0 0 0 1px ${accentColor}22`,
      } : undefined}
    >
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />
      )}
      {children}
    </div>
  )
}
