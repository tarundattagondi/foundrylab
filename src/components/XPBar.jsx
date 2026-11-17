import { levelInfo } from '../lib/progress'

export default function XPBar({ xp, compact = false }) {
  const { level, title, into, next } = levelInfo(xp)
  return (
    <div className="flex items-center gap-2" title={`${xp} XP total`}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500 text-sm font-black text-white shadow-sm shadow-brand-500/40">
        {level}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="hidden truncate text-xs font-extrabold sm:inline">{title}</span>
          {!compact && <span className="muted whitespace-nowrap text-[11px] font-semibold">{into}/{next} XP</span>}
        </div>
        <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-ink-100 sm:w-32 dark:bg-ink-800">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-amber-400 transition-all duration-700" style={{ width: `${(into / next) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
