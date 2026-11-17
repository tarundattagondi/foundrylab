import { useEffect, useRef, useState } from 'react'
import VizShell from './VizShell'
import useGoal from './useGoal'

// f(x) = (x - 1)^2, plotted over x in [-4, 6].
const f = (x) => (x - 1) ** 2
const df = (x) => 2 * (x - 1)
const X0 = -3
const XMIN = -4
const XMAX = 6
const YMAX = 26
const W = 400
const H = 240
const sx = (x) => ((x - XMIN) / (XMAX - XMIN)) * W
const sy = (y) => H - 12 - (Math.min(y, YMAX) / YMAX) * (H - 24)

const curve = Array.from({ length: 101 }, (_, i) => {
  const x = XMIN + ((XMAX - XMIN) * i) / 100
  return `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`
}).join(' ')

function describe(lr) {
  if (lr < 0.1) return 'Tiny steps — safe, but slooow.'
  if (lr < 0.45) return 'Nice and steady — smooth roll to the bottom.'
  if (lr <= 0.55) return 'Sweet spot — almost one jump to the minimum!'
  if (lr < 1) return 'Big steps — it zig-zags across the valley but settles.'
  if (lr === 1) return 'Exactly too big — it bounces back and forth forever.'
  return 'Way too big — every step overshoots further. Divergence!'
}

export default function GradientDescentViz({ activity }) {
  const [done, achieve] = useGoal(activity, 'Found the sweet spot! That is learning-rate tuning in a nutshell. ⛳')
  const [lr, setLr] = useState(0.1)
  const [path, setPath] = useState([X0])
  const [auto, setAuto] = useState(false)
  const timer = useRef()

  const x = path[path.length - 1]
  const steps = path.length - 1
  const offChart = x < XMIN || x > XMAX || f(x) > YMAX
  const atBottom = Math.abs(x - 1) < 0.05

  const step = () => setPath((p) => (p.length > 60 ? p : [...p, p[p.length - 1] - lr * df(p[p.length - 1])]))
  const reset = () => {
    setAuto(false)
    setPath([X0])
  }

  useEffect(() => {
    if (!auto) return
    timer.current = setInterval(step, 350)
    return () => clearInterval(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, lr])

  useEffect(() => {
    if (auto && (atBottom || offChart || steps >= 30)) setAuto(false)
  }, [auto, atBottom, offChart, steps])

  useEffect(() => {
    if (atBottom && steps > 0 && steps <= 5) achieve()
  }, [atBottom, steps, achieve])

  const clampX = (v) => Math.max(XMIN, Math.min(XMAX, v))

  return (
    <VizShell goal="Reach the bottom of the valley in 5 steps or fewer. Tune the learning rate!" done={done} xp={activity.xp}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ background: 'var(--card)' }} role="img" aria-label={`Ball at x = ${x.toFixed(2)} after ${steps} steps`}>
        <line x1={sx(1)} y1={0} x2={sx(1)} y2={H} style={{ stroke: 'var(--good)' }} strokeDasharray="4 4" strokeOpacity={0.6} />
        <text x={sx(1) + 4} y={14} fontSize={11} fontWeight={800} style={{ fill: 'var(--good)' }}>minimum</text>
        <path d={curve} fill="none" style={{ stroke: 'var(--muted)' }} strokeWidth={2.5} />
        {path.slice(1).map((px, i) => {
          const prev = path[i]
          return (
            <line
              key={i}
              x1={sx(clampX(prev))}
              y1={sy(f(prev))}
              x2={sx(clampX(px))}
              y2={sy(f(px))}
              style={{ stroke: 'var(--accent)' }}
              strokeOpacity={0.35 + (0.65 * (i + 1)) / path.length}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          )
        })}
        {path.slice(0, -1).map((px, i) => (
          <circle key={i} cx={sx(clampX(px))} cy={sy(f(px))} r={3} style={{ fill: 'var(--accent)' }} fillOpacity={0.3} />
        ))}
        {!offChart && <circle cx={sx(x)} cy={sy(f(x)) - 9} r={9} style={{ fill: 'var(--accent)', transition: 'cx .3s ease, cy .3s ease' }} />}
      </svg>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="block text-sm font-bold">
          Learning rate: <span className="font-mono">{lr.toFixed(2)}</span>
          <input
            type="range"
            min={0.01}
            max={1.1}
            step={0.01}
            value={lr}
            onChange={(e) => {
              setLr(+e.target.value)
              reset()
            }}
            className="mt-1 w-full accent-[#fb5b14]"
          />
          <span className="muted block text-xs font-semibold">{describe(lr)}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={step} disabled={offChart}>Step</button>
          <button className="btn-ghost" onClick={() => setAuto((a) => !a)} disabled={offChart}>{auto ? '⏸ Pause' : '▶ Auto'}</button>
          <button className="btn-ghost" onClick={reset}>↺ Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
        {[
          ['step', steps],
          ['x', x.toFixed(3)],
          ['loss f(x)', f(x) > 1e6 ? '∞-ish' : f(x).toFixed(3)],
          ['gradient', Math.abs(df(x)) > 1e6 ? 'huge' : df(x).toFixed(3)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-ink-100 p-2 dark:bg-ink-800">
            <p className="muted text-[10px] font-bold uppercase">{k}</p>
            <p className="font-mono text-sm font-bold">{v}</p>
          </div>
        ))}
      </div>
      {offChart && <p className="text-sm font-bold text-rose-600 dark:text-rose-400">💥 The ball flew off the chart! That's what a too-high learning rate does to training. Lower it and reset.</p>}
      {atBottom && steps > 0 && <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">⛳ At the bottom in {steps} step{steps === 1 ? '' : 's'}! {steps > 5 ? 'Can you do it in 5 or fewer?' : ''}</p>}
      <p className="muted text-xs">Update rule: x ← x − lr × f′(x). The gradient is steep far from the minimum and flat near it, so steps shrink naturally.</p>
    </VizShell>
  )
}
