import { useEffect, useState } from 'react'
import VectorPlane, { fmt } from './VectorPlane'
import VizShell from './VizShell'
import useGoal from './useGoal'

const PRESETS = [
  { name: 'cat vs kitten', a: { x: 3, y: 2 }, b: { x: 2.5, y: 2 }, la: 'cat', lb: 'kitten' },
  { name: 'cat vs spreadsheet', a: { x: 3, y: 2 }, b: { x: -1.5, y: 2.5 }, la: 'cat', lb: 'spreadsheet' },
  { name: 'up vs down', a: { x: 0, y: 3 }, b: { x: 0, y: -2 }, la: 'up', lb: 'down' },
]

export default function VectorSimilarityViz({ activity }) {
  const [done, achieve] = useGoal(activity, 'Length ≠ meaning. Direction is what cosine similarity sees! 🧭')
  const [a, setA] = useState({ x: 3, y: 2 })
  const [b, setB] = useState({ x: -1.5, y: 2.5 })
  const [labels, setLabels] = useState(['cat', 'spreadsheet'])

  const la = Math.hypot(a.x, a.y)
  const lb = Math.hypot(b.x, b.y)
  const dot = a.x * b.x + a.y * b.y
  const cos = la && lb ? dot / (la * lb) : 0
  const angle = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI
  const ratio = la && lb ? Math.max(la, lb) / Math.min(la, lb) : 1

  useEffect(() => {
    if (cos >= 0.95 && ratio >= 2) achieve()
  }, [cos, ratio, achieve])

  const verdict = cos > 0.9 ? 'Very similar meaning' : cos > 0.5 ? 'Related' : cos > -0.2 ? 'Unrelated' : 'Opposite-ish'

  return (
    <VizShell goal="Get similarity ≥ 0.95 while one arrow is at least twice as long as the other." done={done} xp={activity.xp}>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.name} className="btn-ghost py-1 text-xs" onClick={() => { setA(p.a); setB(p.b); setLabels([p.la, p.lb]) }}>
            {p.name}
          </button>
        ))}
      </div>
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
        <VectorPlane
          ariaLabel={`Cosine similarity ${fmt(cos)}`}
          vectors={[
            { ...a, color: 'var(--accent)', label: labels[0] },
            { ...b, color: 'var(--violet)', label: labels[1] },
          ]}
          onChange={(i, p) => (i === 0 ? setA(p) : setB(p))}
        />
        <div className="space-y-3">
          <div className="card p-4">
            <p className="muted text-center text-xs font-bold uppercase tracking-wide">cosine similarity</p>
            <p className="text-center text-4xl font-black tabular-nums">{fmt(cos)}</p>
            <div className="relative mt-3 h-3 rounded-full bg-gradient-to-r from-rose-400 via-ink-200 to-emerald-400 dark:via-ink-700">
              <div className="absolute top-1/2 h-5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded bg-[color:var(--ink)] transition-all" style={{ left: `${((cos + 1) / 2) * 100}%` }} />
            </div>
            <div className="muted mt-1 flex justify-between text-[10px] font-bold"><span>-1</span><span>0</span><span>1</span></div>
          </div>
          <p className="text-sm font-bold">{verdict} · {fmt(angle, 0)}° apart</p>
          <p className="muted text-xs">Lengths: {fmt(la)} and {fmt(lb)}. Notice: stretching an arrow doesn't change the similarity. Embeddings compare <em>direction</em> — that's how a search engine knows "kitten" is close to "cat".</p>
        </div>
      </div>
    </VizShell>
  )
}
