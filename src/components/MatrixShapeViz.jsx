import { useEffect, useState } from 'react'
import VizShell from './VizShell'
import useGoal from './useGoal'

const TARGET = [2, 5]

function Grid({ rows, cols, tone, label, highlight }) {
  const cell = Math.max(10, Math.min(22, 120 / Math.max(rows, cols)))
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid gap-[3px] rounded-lg p-1.5" style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)`, background: 'var(--line)' }}>
        {Array.from({ length: rows * cols }, (_, i) => (
          <div key={i} className={`rounded-[3px] ${tone}`} style={{ width: cell, height: cell }} />
        ))}
      </div>
      <p className="font-mono text-sm font-bold">
        {label} ({rows}, <span className={highlight}>{cols}</span>)
      </p>
    </div>
  )
}

function Slider({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-3 text-sm font-bold">
      <span className="w-20 shrink-0">{label}</span>
      <input type="range" min={1} max={6} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-[#fb5b14]" />
      <span className="w-4 text-right font-mono tabular-nums">{value}</span>
    </label>
  )
}

export default function MatrixShapeViz({ activity }) {
  const [done, achieve] = useGoal(activity, 'Shape master! Inner dimensions matched, outer ones survived. 🧩')
  const [m, setM] = useState(2)
  const [n, setN] = useState(3)
  const [n2, setN2] = useState(4)
  const [p, setP] = useState(4)

  const ok = n === n2
  useEffect(() => {
    if (ok && m === TARGET[0] && p === TARGET[1]) achieve()
  }, [ok, m, p, achieve])

  return (
    <VizShell goal={`Pick shapes that can multiply AND give an output of shape (${TARGET.join(', ')}).`} done={done} xp={activity.xp}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-wide text-brand-600 dark:text-brand-300">Matrix A</p>
          <Slider label="rows (m)" value={m} onChange={setM} />
          <Slider label="cols (n)" value={n} onChange={setN} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-wide text-violet-600 dark:text-violet-300">Matrix B</p>
          <Slider label="rows" value={n2} onChange={setN2} />
          <Slider label="cols (p)" value={p} onChange={setP} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 overflow-x-auto py-2">
        <Grid rows={m} cols={n} tone="bg-brand-400" label="A" highlight={ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} />
        <span className="text-2xl font-black">@</span>
        <div className="flex flex-col items-center gap-2">
          <div className="grid gap-[3px] rounded-lg p-1.5" style={{ gridTemplateColumns: `repeat(${p}, ${Math.max(10, Math.min(22, 120 / Math.max(n2, p)))}px)`, background: 'var(--line)' }}>
            {Array.from({ length: n2 * p }, (_, i) => (
              <div key={i} className="rounded-[3px] bg-violet-400" style={{ width: Math.max(10, Math.min(22, 120 / Math.max(n2, p))), height: Math.max(10, Math.min(22, 120 / Math.max(n2, p))) }} />
            ))}
          </div>
          <p className="font-mono text-sm font-bold">
            B (<span className={ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{n2}</span>, {p})
          </p>
        </div>
        <span className="text-2xl font-black">=</span>
        {ok ? (
          <Grid rows={m} cols={p} tone="bg-emerald-400" label="C" />
        ) : (
          <div className="grid h-24 w-24 place-items-center rounded-xl border-2 border-dashed border-rose-400 text-3xl" aria-hidden>✖</div>
        )}
      </div>

      <div
        className={`rounded-xl p-3 text-center text-sm font-bold ${
          ok ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
        }`}
        aria-live="polite"
      >
        {ok
          ? `✅ (${m}, ${n}) @ (${n2}, ${p}) → (${m}, ${p}). The inner ${n}s match and cancel out.`
          : `❌ Can't multiply: A has ${n} columns but B has ${n2} rows. The inner numbers must match.`}
      </div>
    </VizShell>
  )
}
