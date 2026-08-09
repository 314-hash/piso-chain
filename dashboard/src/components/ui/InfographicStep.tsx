interface InfographicStepProps {
  step: string
  icon: string
  title: string
  description: string
  flowTag: string
  accentColor: string
  bgColor: string
}

export default function InfographicStep({ step, icon, title, description, flowTag, accentColor, bgColor }: InfographicStepProps) {
  return (
    <div
      className="relative p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: 'rgba(0,0,0,0.4)',
        border: `1px solid ${accentColor}40`,
      }}
    >
      {/* Step number watermark */}
      <div
        className="absolute top-3 right-4 font-mono font-black text-5xl pointer-events-none select-none opacity-10"
        style={{ color: accentColor }}
      >
        {step}
      </div>

      {/* Icon */}
      <div className="text-3xl mb-3">{icon}</div>

      {/* Title */}
      <h4 className="font-bold text-sm mb-2 leading-tight" style={{ color: accentColor }}>
        {title}
      </h4>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed mb-4">{description}</p>

      {/* Flow tag */}
      <div
        className="rounded-lg px-3 py-2 font-mono text-xs text-center"
        style={{
          background: bgColor,
          border: `1px solid ${accentColor}40`,
          color: accentColor,
        }}
      >
        {flowTag}
      </div>
    </div>
  )
}
