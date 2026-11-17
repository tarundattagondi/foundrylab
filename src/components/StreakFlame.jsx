// The flame grows with the streak: small at 1 day, big and animated by day 7+.
export default function StreakFlame({ count, showLabel = true }) {
  const size = count === 0 ? 18 : Math.min(18 + count * 2.5, 34)
  return (
    <div className="flex items-center gap-1.5" title={count ? `${count}-day streak` : 'No streak yet. Complete a lab today!'}>
      <span
        aria-hidden
        className={`inline-block leading-none ${count ? 'animate-flicker' : 'opacity-40 grayscale'}`}
        style={{ fontSize: size }}
      >
        🔥
      </span>
      {showLabel && (
        <span className="text-sm font-black tabular-nums">
          {count}
          <span className="muted ml-1 hidden text-xs font-bold sm:inline">day{count === 1 ? '' : 's'}</span>
        </span>
      )}
    </div>
  )
}
