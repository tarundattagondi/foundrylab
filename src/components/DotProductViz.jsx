import { useEffect, useState } from 'react'
import VectorPlane, { fmt } from './VectorPlane'
import VizShell from './VizShell'
import useGoal from './useGoal'

const A_COLOR = 'var(--accent)'
const B_COLOR = 'var(--blue)'

function meaning(dot, cos) {
  if (Math.abs(dot) < 1e-9) return { text: 'Perpendicular: these vectors are unrelated.', tone: 'text-sky-600 dark:text-sky-300' }
  if (cos > 0.9) return { text: 'Strongly aligned: pointing almost the same way!', tone: 'text-emerald-600 dark:text-emerald-300' }
  if (cos > 0) return { text: 'Somewhat aligned: same general direction.', tone: 'text-emerald-600 dark:text-emerald-300' }
  if (cos < -0.9) return { text: 'Opposite: pointing away from each other.', tone: 'text-rose-600 dark:text-rose-300' }
  return { text: 'Leaning apart: more opposite than aligned.', tone: 'text-rose-600 dark:text-rose-300' }
}

export default function DotProductViz({ activity }) {
  const [done, achieve] = useGoal(activity, 'Perpendicular achieved! Dot product = 0 means "unrelated". 📐')
  const [a, setA] = useState({ x: 3, y: 1 })
  const [b, setB] = useState({ x: 1, y: 3 })

  const dot = a.x * b.x + a.y * b.y
  const la = Math.hypot(a.x, a.y)
  const lb = Math.hypot(b.x, b.y)
  const cos = la && lb ? dot / (la * lb) : 0
  const m = meaning(dot, cos)

  useEffect(() => {
    if (Math.abs(dot) < 1e-9 && la >= 1 && lb >= 1) achieve()
  }, [dot, la, lb, achieve])

  // Projection of b onto a, drawn as a dashed shadow.
  const proj = la ? dot / (la * la) : 0

  return (
    <VizShell goal="Drag the arrows until the dot product is exactly 0 (both arrows at least 1 long)." done={done} xp={activity.xp}>
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
        <VectorPlane
          ariaLabel={`Vector a is (${a.x}, ${a.y}), vector b is (${b.x}, ${b.y}); dot product ${fmt(dot)}`}
          vectors={[
            { ...a, color: A_COLOR, label: 'a' },
            { ...b, color: B_COLOR, label: 'b' },
          ]}
          onChange={(i, p) => (i === 0 ? setA(p) : setB(p))}
        >
          <line x1={b.x} y1={-b.y} x2={a.x * proj} y2={-a.y * proj} style={{ stroke: 'var(--muted)' }} strokeWidth={0.04} strokeDasharray="0.15 0.12" />
          <line x1={0} y1={0} x2={a.x * proj} y2={-a.y * proj} style={{ stroke: B_COLOR }} strokeOpacity={0.35} strokeWidth={0.28} strokeLinecap="round" />
        </VectorPlane>
        <div className="space-y-3">
          <div className="card p-4 text-center">
            <p className="muted text-xs font-bold uppercase tracking-wide">a · b</p>
            <p className={`text-4xl font-black tabular-nums ${dot > 0 ? 'text-emerald-600 dark:text-emerald-400' : dot < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-sky-600 dark:text-sky-400'}`}>{fmt(dot)}</p>
          </div>
          <p className="rounded-lg bg-ink-100 p-2 font-mono text-xs dark:bg-ink-800">
            ({fmt(a.x)})({fmt(b.x)}) + ({fmt(a.y)})({fmt(b.y)}) = {fmt(dot)}
          </p>
          <p className={`text-sm font-bold ${m.tone}`}>{m.text}</p>
          <p className="muted text-xs">The faded blue bar is b's "shadow" on a. The dot product is that shadow's length × the length of a.</p>
        </div>
      </div>
    </VizShell>
  )
}
