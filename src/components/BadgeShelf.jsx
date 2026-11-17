import { BADGES } from '../lib/progress'

export default function BadgeShelf({ earned }) {
  const count = BADGES.filter((b) => earned[b.id]).length
  return (
    <div>
      <p className="muted mb-3 text-sm font-semibold">{count} of {BADGES.length} unlocked</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {BADGES.map((b) => {
          const got = Boolean(earned[b.id])
          return (
            <div
              key={b.id}
              title={`${b.name}: ${b.desc}`}
              className={`flex flex-col items-center rounded-xl border p-2 text-center transition ${
                got
                  ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20'
                  : 'border-dashed border-[color:var(--line)] opacity-60'
              }`}
            >
              <span className={`text-2xl ${got ? '' : 'grayscale'}`} aria-hidden>{got ? b.emoji : '🔒'}</span>
              <span className="mt-1 text-[11px] font-extrabold leading-tight">{b.name}</span>
              <span className="muted mt-0.5 hidden text-[10px] leading-tight sm:block">{b.desc}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
