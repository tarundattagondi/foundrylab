export default function ProgressRing({ value, size = 36, stroke = 4, children, label }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, value))
  const done = pct >= 1
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }} aria-label={label} role="img">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" style={{ stroke: 'var(--line)' }} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ stroke: done ? 'var(--good)' : 'var(--accent)', transition: 'stroke-dashoffset .7s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-sm">{children}</div>
    </div>
  )
}
