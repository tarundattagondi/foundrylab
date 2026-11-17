// Common frame for playgrounds: the challenge goal and its status.
export default function VizShell({ goal, done, xp, children }) {
  return (
    <div className="space-y-4">
      <div
        className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 text-sm ${
          done
            ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
            : 'border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-900/20'
        }`}
      >
        <span className="text-lg" aria-hidden>{done ? '🏅' : '🎯'}</span>
        <p className="min-w-0 flex-1"><strong>Challenge:</strong> {goal}</p>
        <span className={`chip ${done ? 'bg-emerald-600 text-white' : 'bg-brand-500 text-white'}`}>{done ? 'Complete!' : `+${xp} XP`}</span>
      </div>
      {children}
    </div>
  )
}
