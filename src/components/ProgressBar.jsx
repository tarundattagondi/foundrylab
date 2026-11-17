export default function ProgressBar({ value, className = '', color = 'bg-brand-500', label }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <div className={className}>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
