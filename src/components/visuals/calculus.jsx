// Interactive visuals for the calculus module. Export a map of { name: Component }.
// Each component receives the block's props (see ./index.jsx).
import { useEffect, useMemo, useRef, useState } from 'react'
import { Arrow, C, Curve, DragPoint, Goal, NumberRow, Plane, Slider, Stepper, VisualCard, fmt, usePlane } from './kit'
import { Inline } from '../Inline'

// Turn an authored rule string like "x * 2 + 1" into a JS function.
const makeFn = (rule, v = 'x') => new Function(v, `return (${rule})`) // eslint-disable-line no-new-func
// Put a number into a pretty rule like "2 × x + 1" → "2 × 3 + 1".
const subst = (text, value, v = 'x') => text.replace(new RegExp(`\\b${v}\\b`, 'g'), value < 0 ? `(${fmt(value)})` : fmt(value))

/** A line segment in plane coordinates. */
function Seg({ x1, y1, x2, y2, color = C.muted, width = 2, dashed }) {
  const { sx, sy } = usePlane()
  return <line x1={sx(x1)} y1={sy(y1)} x2={sx(x2)} y2={sy(y2)} style={{ stroke: color }} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? '6 5' : undefined} />
}
/** A text label in plane coordinates. */
function Label({ x, y, children, color = C.ink, anchor = 'middle', size = 12, dy = 0 }) {
  const { sx, sy } = usePlane()
  return <text x={sx(x)} y={sy(y) + dy} fontSize={size} fontWeight={800} textAnchor={anchor} style={{ fill: color, paintOrder: 'stroke', stroke: C.card, strokeWidth: 3 }}>{children}</text>
}
/** A dot in plane coordinates. */
function Dot({ x, y, color = C.accent, r = 6, opacity = 1 }) {
  const { sx, sy } = usePlane()
  return <circle cx={sx(x)} cy={sy(y)} r={r} opacity={opacity} style={{ fill: color, stroke: C.card }} strokeWidth={2} />
}

// ───────────────────────── 1. Function machine ─────────────────────────
function FunctionMachine({ rule = 'x * 2 + 1', show = '2 × x + 1', name = 'f', label = 'double it, then add 1', min = 0, max = 10, start = 3 }) {
  const f = useMemo(() => makeFn(rule), [rule])
  const [x, setX] = useState(start)
  const [stage, setStage] = useState('idle') // idle → in → working → out
  const [shown, setShown] = useState(null) // { x, y } currently in the output tray
  const [history, setHistory] = useState([])
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function drop() {
    if (stage === 'in' || stage === 'working') return
    timers.current.forEach(clearTimeout)
    const y = f(x)
    setShown(null)
    setStage('in')
    timers.current = [
      setTimeout(() => setStage('working'), 550),
      setTimeout(() => {
        setStage('out')
        setShown({ x, y })
        setHistory((h) => [{ x, y }, ...h.filter((r) => r.x !== x)].slice(0, 8))
      }, 1350),
    ]
  }

  const tries = history.length
  return (
    <VisualCard
      title={`The ${name} machine: ${label}`}
      hint="Pick an input with the slider, then press **Drop it in!** Watch the number go through the machine."
      footer={`Same input in → same output out, every time. That is what makes it a **function**.`}
    >
      <Slider label="Input **x**" value={x} min={min} max={max} onChange={(v) => { setX(v); if (stage === 'out') setStage('idle') }} />
      <div className="flex flex-col items-center gap-1 py-1">
        <div
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-sky-400 bg-sky-100 font-mono text-lg font-black text-sky-900 shadow transition-all duration-500 dark:bg-sky-900/50 dark:text-sky-100"
          style={{ transform: stage === 'in' || stage === 'working' ? 'translateY(56px) scale(.6)' : 'none', opacity: stage === 'working' ? 0 : 1 }}
          aria-hidden
        >
          {fmt(x)}
        </div>
        <span className="text-xs font-bold text-ink-500">input</span>
        <div className={`relative z-10 w-full max-w-xs rounded-2xl border-4 border-brand-400 bg-brand-50 px-4 py-3 text-center shadow-sm dark:bg-brand-900/30 ${stage === 'working' ? 'animate-flicker' : ''}`}>
          <div className="flex items-center justify-center gap-2">
            <span className={`text-2xl ${stage === 'working' ? 'animate-spin' : ''}`} aria-hidden>⚙️</span>
            <span className="font-mono text-lg font-black">{name}(x) = {show}</span>
          </div>
          <p className="text-xs font-semibold text-brand-800 dark:text-brand-200">{stage === 'working' ? 'Working on it…' : `Rule: ${label}`}</p>
        </div>
        <span className="text-xs font-bold text-ink-500">output</span>
        <div className="grid h-12 min-w-12 place-items-center rounded-full border-2 border-emerald-400 bg-emerald-100 px-3 font-mono text-lg font-black text-emerald-900 transition-all duration-300 dark:bg-emerald-900/50 dark:text-emerald-100" style={{ transform: shown ? 'scale(1)' : 'scale(0)', opacity: shown ? 1 : 0 }} aria-live="polite">
          {shown ? fmt(shown.y) : ''}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button className="btn-primary" onClick={drop} disabled={stage === 'in' || stage === 'working'}>⬇️ Drop it in!</button>
        {shown && <span className="font-mono text-sm font-bold">{name}({fmt(shown.x)}) = {subst(show, shown.x)} = <span className="text-emerald-700 dark:text-emerald-300">{fmt(shown.y)}</span></span>}
      </div>
      {tries > 0 && (
        <div className="overflow-x-auto">
          <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-ink-500">Your table so far</p>
          <table className="text-sm">
            <tbody>
              <tr><th className="pr-3 text-left">input x</th>{history.map((r) => <td key={r.x} className="px-2 text-center font-mono">{fmt(r.x)}</td>)}</tr>
              <tr><th className="pr-3 text-left">output {name}(x)</th>{history.map((r) => <td key={r.x} className="px-2 text-center font-mono font-bold text-emerald-700 dark:text-emerald-300">{fmt(r.y)}</td>)}</tr>
            </tbody>
          </table>
        </div>
      )}
      <Goal done={tries >= 3}>{tries >= 3 ? 'Great testing! Try one of your old inputs again: it gives the same answer.' : `Try ${3 - tries} more different input${3 - tries === 1 ? '' : 's'}.`}</Goal>
    </VisualCard>
  )
}

// ───────────────────────── 2. Walk to a point ─────────────────────────
function PointWalk({ target = [3, 7], start = [1, 1], size = 8 }) {
  const [p, setP] = useState({ x: start[0], y: start[1] })
  const done = target && p.x === target[0] && p.y === target[1]
  return (
    <VisualCard title="Finding a point: across, then up" hint="Drag the orange dot. The dashed path shows how to walk there from (0, 0).">
      <Plane xmin={0} xmax={size} ymin={0} ymax={size} unit={34} maxWidth={360} ariaLabel={`Point at (${p.x}, ${p.y})`}>
        {target && !done && <TargetMark x={target[0]} y={target[1]} />}
        {p.x > 0 && <Seg x1={0} y1={0} x2={p.x} y2={0} color={C.blue} width={4} dashed />}
        {p.y > 0 && <Seg x1={p.x} y1={0} x2={p.x} y2={p.y} color={C.accent} width={4} dashed />}
        {p.x > 0 && <Label x={p.x / 2} y={0} dy={-8} color={C.blue}>{p.x} right</Label>}
        {p.y > 0 && <Label x={p.x} y={p.y / 2} dy={4} anchor="start" color={C.accent}>{'  '}{p.y} up</Label>}
        <DragPoint x={p.x} y={p.y} onMove={setP} label={`(${p.x}, ${p.y})`} />
      </Plane>
      <p className="text-center text-lg font-black">
        <span className="font-mono">({p.x}, {p.y})</span>: walk <span className="text-sky-700 dark:text-sky-300">{p.x} across</span>, then <span className="text-brand-600 dark:text-brand-300">{p.y} up</span>.
      </p>
      {target && <Goal done={done}>{done ? `You found (${target[0]}, ${target[1]})! First number = across, second number = up.` : `Can you put the dot on (${target[0]}, ${target[1]})? Look for the green ring.`}</Goal>}
    </VisualCard>
  )
}
function TargetMark({ x, y }) {
  const { sx, sy } = usePlane()
  return <circle cx={sx(x)} cy={sy(y)} r={13} fill="none" style={{ stroke: C.good }} strokeWidth={3} strokeDasharray="4 3" />
}

// ───────────────────────── 3. Plot builder ─────────────────────────
function PlotBuilder({ rule = '2 * x + 1', show = '2x + 1', xs = [0, 1, 2, 3], xmin = -1, xmax = 4, ymin = -1, ymax = 8, unit = 34 }) {
  const f = useMemo(() => makeFn(rule), [rule])
  const [step, setStep] = useState(0)
  const [probe, setProbe] = useState(xs[Math.floor(xs.length / 2)])
  const total = xs.length + 2
  const shown = Math.min(Math.max(step, 0), xs.length)
  const connected = step === total - 1
  const labels = ['an empty grid', ...xs.map((x) => `plot (${fmt(x)}, ${fmt(f(x))})`), 'connect the dots']
  return (
    <VisualCard
      title={`Drawing f(x) = ${show}, dot by dot`}
      hint="Press **Next ▶** to turn each column of the table into a dot. At the end, Python connects the dots."
      footer={connected ? 'Every dot on the line is one input and its output. Slide the purple x to read any point off the graph.' : 'Each column of the table becomes one dot: go **x** across, then **f(x)** up.'}
    >
      <div className="overflow-x-auto">
        <table className="mx-auto text-sm">
          <tbody>
            <tr><th className="pr-3 text-left">x</th>{xs.map((x, i) => <td key={i} className={`rounded px-2 text-center font-mono ${i === shown - 1 && !connected ? 'bg-amber-200 dark:bg-amber-700/50' : ''}`}>{fmt(x)}</td>)}</tr>
            <tr><th className="pr-3 text-left">f(x)</th>{xs.map((x, i) => <td key={i} className={`rounded px-2 text-center font-mono font-bold ${i === shown - 1 && !connected ? 'bg-amber-200 dark:bg-amber-700/50' : ''} ${i < shown ? '' : 'text-transparent'}`}>{fmt(f(x))}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <Plane xmin={xmin} xmax={xmax} ymin={ymin} ymax={ymax} unit={unit} maxWidth={380} ariaLabel={`Graph of f(x) = ${show}`}>
        {connected && <Curve fn={f} color={C.accent} width={3.5} />}
        {xs.slice(0, shown).map((x, i) => (
          <g key={i}>
            {i === shown - 1 && !connected && (
              <>
                <Seg x1={x} y1={0} x2={x} y2={f(x)} color={C.blue} dashed />
                <Seg x1={0} y1={f(x)} x2={x} y2={f(x)} color={C.blue} dashed />
              </>
            )}
            <Dot x={x} y={f(x)} r={7} />
            {i === shown - 1 && !connected && <Label x={x} y={f(x)} dy={-12}>({fmt(x)}, {fmt(f(x))})</Label>}
          </g>
        ))}
        {connected && (
          <>
            <Seg x1={probe} y1={0} x2={probe} y2={f(probe)} color={C.violet} dashed />
            <Seg x1={0} y1={f(probe)} x2={probe} y2={f(probe)} color={C.violet} dashed />
            <Dot x={probe} y={f(probe)} color={C.violet} r={8} />
            <Label x={probe} y={f(probe)} dy={-13} color={C.violet}>f({fmt(probe)}) = {fmt(f(probe))}</Label>
          </>
        )}
      </Plane>
      <Stepper step={step} total={total} setStep={setStep} labels={labels} />
      {connected && <Slider label="Slide **x** along the graph" value={probe} min={xs[0]} max={xs[xs.length - 1]} step={0.5} onChange={setProbe} />}
    </VisualCard>
  )
}

// ───────────────────────── 4. Slope from two points ─────────────────────────
function SlopeLine({ a = [1, 3], b = [3, 7], goal }) {
  const [A, setA] = useState({ x: a[0], y: a[1] })
  const [B, setB] = useState({ x: b[0], y: b[1] })
  const rise = B.y - A.y
  const run = B.x - A.x
  const slope = run !== 0 ? rise / run : null
  const kind = slope === null ? 'straight up' : slope > 0 ? 'uphill ↗' : slope < 0 ? 'downhill ↘' : 'flat →'
  const tone = slope === null ? 'bg-ink-200 dark:bg-ink-700' : slope > 0 ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200' : slope < 0 ? 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200' : 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200'
  const angle = slope === null ? -90 : (-Math.atan(slope) * 180) / Math.PI
  const line = slope === null ? null : (x) => A.y + slope * (x - A.x)
  return (
    <VisualCard title="Rise over run" hint="Drag the two dots **A** and **B**. Watch the rise (up) and run (across) change.">
      <Plane xmin={-1} xmax={8} ymin={-1} ymax={8} unit={34} maxWidth={380} ariaLabel={`Line through A (${A.x}, ${A.y}) and B (${B.x}, ${B.y}), slope ${slope === null ? 'undefined' : fmt(slope)}`}>
        {line && <Curve fn={line} color={C.muted} width={2.5} dashed />}
        {run !== 0 && <Seg x1={A.x} y1={A.y} x2={B.x} y2={A.y} color={C.blue} width={4} />}
        {rise !== 0 && <Seg x1={B.x} y1={A.y} x2={B.x} y2={B.y} color={C.accent} width={4} />}
        {run !== 0 && <Label x={(A.x + B.x) / 2} y={A.y} dy={rise >= 0 ? 17 : -8} color={C.blue}>run = {fmt(run)}</Label>}
        {rise !== 0 && <Label x={B.x} y={(A.y + B.y) / 2} dy={4} anchor={run >= 0 ? 'start' : 'end'} color={C.accent}>{run >= 0 ? '  ' : ''}rise = {fmt(rise)}{run < 0 ? '  ' : ''}</Label>}
        <DragPoint x={A.x} y={A.y} onMove={setA} label="A" color={C.violet} />
        <DragPoint x={B.x} y={B.y} onMove={setB} label="B" />
      </Plane>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <p className="font-mono text-lg font-black" aria-live="polite">
          slope = rise ÷ run = {fmt(rise)} ÷ {fmt(run)} = {slope === null ? '?' : fmt(slope)}
        </p>
        <span className={`chip text-sm ${tone}`}>{kind}</span>
        <span className="inline-block text-3xl transition-transform duration-300" style={{ transform: `rotate(${Math.max(-80, Math.min(80, angle))}deg)` }} aria-hidden>🛹</span>
      </div>
      {slope === null && <p className="text-center text-sm font-bold text-amber-700 dark:text-amber-300">The run is 0, so we would divide by zero. A straight-up wall has no slope number!</p>}
      {goal !== undefined && <Goal done={slope === goal}>{slope === goal ? `Yes! Slope ${goal} exactly.` : `Challenge: move the dots to make the slope exactly ${goal}.`}</Goal>}
    </VisualCard>
  )
}

// ───────────────────────── 5. Secant → tangent (zoom in) ─────────────────────────
const H_STEPS = [2, 1, 0.5, 0.2, 0.1, 0.01]
const ZOOMS = [1, 2, 4, 8, 16, 32]
function TangentZoom({ rule = 'x ** 2', show = 'x²', d = '2 * x', dShow = '2x', x0 = 1, xmin = -3, xmax = 3, ymin = -1, ymax = 9 }) {
  const f = useMemo(() => makeFn(rule), [rule])
  const df = useMemo(() => makeFn(d), [d])
  const [x, setX] = useState(x0)
  const [hi, setHi] = useState(0)
  const [zi, setZi] = useState(0)
  const h = H_STEPS[hi]
  const rise = f(x + h) - f(x)
  const est = rise / h
  const exact = df(x)
  const close = Math.abs(est - exact) < 0.05
  const half = 1.5 / ZOOMS[zi]
  const y0 = f(x)
  return (
    <VisualCard
      title={`Zooming in on f(x) = ${show}`}
      hint="Move the dot along the curve, then shrink the **nudge h**. The blue line through two points turns into the green slope line."
      footer={`As h gets tiny, rise ÷ run gets closer and closer to the true slope **f′(x) = ${dShow}**. That true slope is the **derivative**.`}
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Plane xmin={xmin} xmax={xmax} ymin={ymin} ymax={ymax} unit={32} maxWidth={320} ariaLabel={`Curve ${show} with a line through x = ${x} and x + h`}>
          <Curve fn={f} color={C.muted} width={3} />
          {close && <Curve fn={(t) => y0 + exact * (t - x)} color={C.good} width={2.5} />}
          <Curve fn={(t) => y0 + est * (t - x)} color={C.blue} width={2} dashed />
          <Seg x1={x} y1={y0} x2={x + h} y2={y0} color={C.blue} width={3} />
          <Seg x1={x + h} y1={y0} x2={x + h} y2={f(x + h)} color={C.accent} width={3} />
          <Dot x={x + h} y={f(x + h)} color={C.blue} r={6} />
          <Dot x={x} y={y0} color={C.accent} r={7} />
        </Plane>
        <div className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-wider text-ink-500">🔍 Magnifying glass ×{ZOOMS[zi]}</p>
          <Plane xmin={x - half} xmax={x + half} ymin={y0 - half} ymax={y0 + half} unit={180 / (2 * half)} labels={false} xLabel="" yLabel="" maxWidth={220} ariaLabel="Zoomed-in view of the curve">
            <Curve fn={f} color={C.muted} width={3} />
            <Dot x={x} y={y0} color={C.accent} r={6} />
          </Plane>
          <p className="text-center text-xs font-bold">{zi >= 3 ? 'Zoomed in this much, the curve looks like a straight line!' : 'Zoom in more…'}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="Dot at **x**" value={x} min={xmin + 0.5} max={xmax - 1} step={0.5} onChange={setX} />
        <Slider label="Nudge **h**" value={hi} min={0} max={H_STEPS.length - 1} onChange={setHi} format={(i) => fmt(H_STEPS[i])} />
        <Slider label="Zoom" value={zi} min={0} max={ZOOMS.length - 1} onChange={setZi} format={(i) => `×${ZOOMS[i]}`} />
      </div>
      <div className="overflow-x-auto">
        <table className="mx-auto text-sm">
          <tbody className="font-mono">
            <tr><td className="pr-3 font-sans font-bold">run (h)</td><td className="text-sky-700 dark:text-sky-300">{fmt(h)}</td></tr>
            <tr><td className="pr-3 font-sans font-bold">rise</td><td className="text-brand-700 dark:text-brand-300">f({fmt(x + h)}) − f({fmt(x)}) = {fmt(rise, 4)}</td></tr>
            <tr><td className="pr-3 font-sans font-bold">rise ÷ run</td><td className="font-black">{fmt(est, 4)}</td></tr>
            <tr><td className="pr-3 font-sans font-bold">true slope</td><td className="font-black text-emerald-700 dark:text-emerald-300">{subst(dShow.replace(/(\d)x/, '$1 × x'), x)} = {fmt(exact, 4)}</td></tr>
          </tbody>
        </table>
      </div>
      <Goal done={close}>{close ? 'The nudge is so tiny that rise ÷ run matches the true slope. The green line just touches the curve at your dot.' : 'Keep shrinking h. Watch rise ÷ run get closer to the true slope.'}</Goal>
    </VisualCard>
  )
}

// ───────────────────────── 6. Power rule checker ─────────────────────────
const POWER_FNS = [
  { key: 'x²', f: 'x ** 2', d: '2 * x', dShow: '2x', why: 'Bring the 2 down in front, take 1 off the power: 2 · x¹ = **2x**.' },
  { key: 'x³', f: 'x ** 3', d: '3 * x ** 2', dShow: '3x²', why: 'Bring the 3 down, take 1 off the power: **3x²**.' },
  { key: '3x', f: '3 * x', d: '3', dShow: '3', why: 'A straight line. It climbs 3 for every 1 across, everywhere: **3**.' },
  { key: '5', f: '5', d: '0', dShow: '0', why: 'A flat line never changes, so the slope is **0**.' },
  { key: 'x² + 3x', f: 'x ** 2 + 3 * x', d: '2 * x + 3', dShow: '2x + 3', why: 'Add the pieces: x² gives 2x, 3x gives 3, so **2x + 3**.' },
]
function PowerRule({ start = 0 }) {
  const [k, setK] = useState(start)
  const [x, setX] = useState(1)
  const item = POWER_FNS[k]
  const f = useMemo(() => makeFn(item.f), [item])
  const df = useMemo(() => makeFn(item.d), [item])
  const nudge = (t) => (f(t + 1e-4) - f(t - 1e-4)) / 2e-4
  const xs = [-1, 0, 1, 2]
  return (
    <VisualCard title="Shortcut vs. nudge" hint="Pick a function. Check that the shortcut rule gives the same slopes as the nudge trick.">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Function">
        {POWER_FNS.map((p, i) => (
          <button key={p.key} role="radio" aria-checked={i === k} onClick={() => setK(i)} className={i === k ? 'btn-primary font-mono' : 'btn-ghost font-mono'}>f(x) = {p.key}</button>
        ))}
      </div>
      <p className="rounded-xl bg-amber-50 p-2 text-sm dark:bg-amber-900/20">🧠 Shortcut: f′(x) = <strong className="font-mono">{item.dShow}</strong>. <Inline text={item.why} /></p>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
        <Plane xmin={-3} xmax={3} ymin={-4} ymax={9} unit={24} maxWidth={260} ariaLabel={`Graph of ${item.key} with a slope line at x = ${x}`}>
          <Curve fn={f} color={C.muted} width={3} />
          <Curve fn={(t) => f(x) + df(x) * (t - x)} color={C.good} width={2.5} dashed />
          <Dot x={x} y={f(x)} r={7} />
        </Plane>
        <div className="overflow-x-auto">
          <table className="mx-auto text-sm">
            <thead><tr className="text-left"><th className="pr-3">x</th><th className="pr-3">nudge says</th><th className="pr-3">shortcut says</th><th /></tr></thead>
            <tbody className="font-mono">
              {xs.map((t) => (
                <tr key={t} className={t === x ? 'bg-amber-100 dark:bg-amber-800/40' : ''}>
                  <td className="pr-3">{t}</td>
                  <td className="pr-3">{fmt(nudge(t), 3)}</td>
                  <td className="pr-3 font-bold">{fmt(df(t), 3)}</td>
                  <td>{Math.abs(nudge(t) - df(t)) < 1e-3 ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Slider label="Green slope line at **x**" value={x} min={-1} max={2} onChange={setX} />
    </VisualCard>
  )
}

// ───────────────────────── 7. Chain of machines (forward + backward) ─────────────────────────
function ChainGears({ x0 = 2, g = '3 * x', gShow = '× 3', gd = '3', gdShow = '3', f = 'z ** 2', fShow = 'square it', fd = '2 * z', fdShow = '2z' }) {
  const G = useMemo(() => makeFn(g), [g])
  const GD = useMemo(() => makeFn(gd), [gd])
  const F = useMemo(() => makeFn(f, 'z'), [f])
  const FD = useMemo(() => makeFn(fd, 'z'), [fd])
  const [x, setX] = useState(x0)
  const [step, setStep] = useState(0)
  const [nudge, setNudge] = useState(0.01)
  const z = G(x)
  const y = F(z)
  const sg = GD(x)
  const sf = FD(z)
  const total = sg * sf
  const say = [
    `We start with **x = ${fmt(x)}**. It is about to go through two machines.`,
    `**Forward 1:** x goes into machine g (${gShow}). Out comes **z = ${fmt(z)}**.`,
    `**Forward 2:** z goes into machine f (${fShow}). Out comes **y = ${fmt(y)}**. The forward pass is done!`,
    `**Backward 1:** start at the END. How steep is f at z = ${fmt(z)}? Its slope is ${fdShow} = **${fmt(sf)}**.`,
    `**Backward 2:** step back one machine. How steep is g? Its slope is **${fmt(sg)}**.`,
    `**Chain rule:** multiply the slopes: ${fmt(sf)} × ${fmt(sg)} = **${fmt(total)}**. So y changes ${fmt(total)} times as fast as x.`,
  ]
  const lit = (n) => (step >= n ? 'opacity-100' : 'opacity-25')
  const Box = ({ label, value, on, tone }) => (
    <div className={`flex min-w-14 flex-col items-center transition-opacity duration-500 ${on}`}>
      <span className="font-mono text-xs font-bold text-ink-500">{label}</span>
      <span className={`grid h-12 min-w-12 place-items-center rounded-full border-2 px-2 font-mono text-lg font-black ${tone}`}>{value}</span>
    </div>
  )
  const Machine = ({ name, show, spin }) => (
    <div className="flex flex-col items-center rounded-xl border-4 border-brand-400 bg-brand-50 px-3 py-1.5 dark:bg-brand-900/30">
      <span className={`text-xl ${spin ? 'animate-spin' : ''}`} aria-hidden>⚙️</span>
      <span className="font-mono text-sm font-black">{name}: {show}</span>
    </div>
  )
  const Arr = ({ on, back, text }) => (
    <div className={`flex flex-col items-center text-xs font-bold transition-opacity duration-500 ${on}`}>
      <span className={`text-xl ${back ? 'text-violet-600 dark:text-violet-300' : 'text-sky-600 dark:text-sky-300'}`}>
        <span className="hidden sm:inline">{back ? '←' : '→'}</span><span className="sm:hidden">{back ? '↑' : '↓'}</span>
      </span>
      {text && <span className="font-mono text-violet-700 dark:text-violet-300">{text}</span>}
    </div>
  )
  return (
    <VisualCard title="Machines in a chain" hint="Press **Next ▶** to push x forward through both machines, then carry the slopes backward.">
      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Box label="x" value={fmt(x)} on="opacity-100" tone="border-sky-400 bg-sky-100 dark:bg-sky-900/50" />
        <Arr on={lit(1)} />
        <Machine name="g" show={gShow} spin={step === 1} />
        <Arr on={lit(1)} />
        <Box label="z" value={step >= 1 ? fmt(z) : '?'} on={lit(1)} tone="border-sky-400 bg-sky-100 dark:bg-sky-900/50" />
        <Arr on={lit(2)} />
        <Machine name="f" show={fShow} spin={step === 2} />
        <Arr on={lit(2)} />
        <Box label="y" value={step >= 2 ? fmt(y) : '?'} on={lit(2)} tone="border-emerald-400 bg-emerald-100 dark:bg-emerald-900/50" />
      </div>
      <div className={`flex flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-dashed border-violet-300 p-2 transition-opacity duration-500 dark:border-violet-800 ${step >= 3 ? 'opacity-100' : 'opacity-30'}`}>
        <span className="text-xs font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-300">Backward:</span>
        <span className={`chip bg-violet-100 font-mono text-violet-900 dark:bg-violet-900/40 dark:text-violet-200 ${lit(4)}`}>slope of g = {fmt(sg)}</span>
        <span className="font-black">×</span>
        <span className={`chip bg-violet-100 font-mono text-violet-900 dark:bg-violet-900/40 dark:text-violet-200 ${lit(3)}`}>slope of f = {fmt(sf)}</span>
        <span className="font-black">=</span>
        <span className={`chip bg-emerald-600 font-mono text-white ${lit(5)}`}>dy/dx = {fmt(total)}</span>
      </div>
      <p className="min-h-12 rounded-xl bg-[color:var(--card)] p-3 text-[15px] shadow-sm" aria-live="polite"><Inline text={say[step]} /></p>
      <Stepper step={step} total={say.length} setStep={setStep} labels={['start', 'forward', 'forward', 'backward', 'backward', 'multiply']} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="Start value **x**" value={x} min={1} max={4} onChange={setX} />
        <Slider label="Nudge x by" value={nudge} min={0.001} max={0.1} step={0.001} onChange={setNudge} format={(v) => fmt(v, 3)} />
      </div>
      <p className="rounded-xl bg-sky-50 p-2 text-center font-mono text-sm dark:bg-sky-900/20">
        x +{fmt(nudge, 3)} → z +{fmt(G(x + nudge) - z, 4)} → y +{fmt(F(G(x + nudge)) - y, 4)} &nbsp;·&nbsp; y moved about <strong>{fmt((F(G(x + nudge)) - y) / nudge, 1)}×</strong> as much as x
      </p>
    </VisualCard>
  )
}

// ───────────────────────── 8. Loss playground ─────────────────────────
function LossPlayground({ points = [[1, 2], [2, 4], [3, 6]], w0 = 0.5, wmax = 4 }) {
  const [w, setW] = useState(w0)
  const [squares, setSquares] = useState(false)
  const lossAt = (ww) => points.reduce((s, [x, y]) => s + (ww * x - y) ** 2, 0) / points.length
  const mse = lossAt(w)
  const best = points.reduce((s, [x, y]) => s + x * y, 0) / points.reduce((s, [x]) => s + x * x, 0)
  const done = mse < 0.02
  // Small loss-vs-w chart with its own scales.
  const W = 280, H = 120, P = 24
  const maxL = Math.max(lossAt(0), lossAt(wmax))
  const cx = (v) => P + (v / wmax) * (W - 2 * P)
  const cy = (l) => H - P - (Math.min(l, maxL) / maxL) * (H - 2 * P)
  let path = ''
  for (let i = 0; i <= 80; i++) { const v = (wmax * i) / 80; path += `${i ? 'L' : 'M'}${cx(v).toFixed(1)},${cy(lossAt(v)).toFixed(1)} ` }
  return (
    <VisualCard title="How wrong is the line?" hint="Slide the knob **w**. The line guesses y = w × x. Red lines show how far off each guess is.">
      <Plane xmin={0} xmax={6} ymin={0} ymax={8} unit={34} maxWidth={340} ariaLabel={`Line y = ${w} x and ${points.length} data points, MSE ${fmt(mse)}`}>
        <Curve fn={(x) => w * x} color={C.accent} width={3.5} />
        {points.map(([x, y], i) => {
          const p = w * x
          const e = p - y
          return (
            <g key={i}>
              {squares && Math.abs(e) > 0.01 && <SquareErr x={x} y={y} e={e} />}
              <Seg x1={x} y1={y} x2={x} y2={Math.min(p, 8.2)} color={C.bad} width={3} />
              <Dot x={x} y={y} color={C.blue} r={7} />
              {p <= 8.2 && <Dot x={x} y={p} color={C.accent} r={4} />}
            </g>
          )
        })}
      </Plane>
      <Slider label="Knob **w** (the guess is w × x)" value={w} min={0} max={wmax} step={0.1} onChange={setW} />
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={squares} onChange={(e) => setSquares(e.target.checked)} className="accent-[#fb5b14]" /> Show the squared errors as real squares</label>
      <div className="overflow-x-auto">
        <table className="mx-auto text-sm">
          <thead><tr className="text-left"><th className="pr-3">x</th><th className="pr-3">target y</th><th className="pr-3">guess w·x</th><th className="pr-3">error</th><th>error²</th></tr></thead>
          <tbody className="font-mono">
            {points.map(([x, y]) => (
              <tr key={x}><td className="pr-3">{x}</td><td className="pr-3 text-sky-700 dark:text-sky-300">{y}</td><td className="pr-3 text-brand-700 dark:text-brand-300">{fmt(w * x)}</td><td className="pr-3 text-rose-600 dark:text-rose-300">{fmt(w * x - y)}</td><td>{fmt((w * x - y) ** 2)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-center text-lg font-black">MSE (the loss) = <span className={done ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{fmt(mse)}</span></p>
      <div>
        <p className="mb-1 text-center text-xs font-extrabold uppercase tracking-wider text-ink-500">Loss for every w: a valley!</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full" style={{ maxWidth: 340, background: C.card }} role="img" aria-label="Loss plotted against w">
          <line x1={P} y1={H - P} x2={W - P} y2={H - P} style={{ stroke: C.muted }} />
          <path d={path} fill="none" style={{ stroke: C.violet }} strokeWidth={2.5} />
          <line x1={cx(best)} y1={H - P} x2={cx(best)} y2={P / 2} style={{ stroke: C.good }} strokeDasharray="4 4" />
          <text x={cx(best) + 4} y={P} fontSize={10} fontWeight={800} style={{ fill: C.good }}>bottom: w = {fmt(best)}</text>
          <circle cx={cx(w)} cy={cy(mse)} r={7} style={{ fill: C.accent, stroke: C.card }} strokeWidth={2} />
          {[0, 1, 2, 3, 4].filter((v) => v <= wmax).map((v) => <text key={v} x={cx(v)} y={H - P + 13} fontSize={10} textAnchor="middle" style={{ fill: C.muted }}>{v}</text>)}
          <text x={W - P} y={H - 4} fontSize={10} textAnchor="end" fontWeight={800} style={{ fill: C.muted }}>w</text>
        </svg>
      </div>
      <Goal done={done}>{done ? `Perfect! At w = ${fmt(w)} every guess hits its target, so the loss is 0. You are at the bottom of the valley.` : 'Find the w that makes the loss as small as possible (the bottom of the valley).'}</Goal>
    </VisualCard>
  )
}
function SquareErr({ x, y, e }) {
  const { sx, sy, unit } = usePlane()
  const s = Math.abs(e) * unit
  const top = Math.max(y, y + e)
  return <rect x={sx(x)} y={sy(top)} width={s} height={s} style={{ fill: C.bad, stroke: C.bad }} fillOpacity={0.15} strokeOpacity={0.5} />
}

// ───────────────────────── 9. Two-knob hill (gradient) ─────────────────────────
function GradientHill({ start = [0, 0], center = [2, -1] }) {
  const [p, setP] = useState({ x: start[0], y: start[1] })
  const [lr, setLr] = useState(0.2)
  const [trail, setTrail] = useState([])
  const [cw, cb] = center
  const L = (w, b) => (w - cw) ** 2 + (b - cb) ** 2
  const gw = 2 * (p.x - cw)
  const gb = 2 * (p.y - cb)
  const k = 0.22
  const flat = Math.hypot(gw, gb) < 0.15
  const move = (q) => { setTrail([]); setP(q) }
  const step = () => {
    setTrail((t) => [...t, p].slice(-30))
    setP({ x: p.x - lr * gw, y: p.y - lr * gb })
  }
  return (
    <VisualCard
      title="A hill with two knobs: w and b"
      hint="Drag the ball anywhere. Orange arrow = the gradient (uphill). Green arrow = the opposite way (downhill). Press **Step downhill**."
      footer="Darker blue = lower loss. The very centre is the bottom, where the gradient is (0, 0)."
    >
      <Plane xmin={-2} xmax={5} ymin={-4} ymax={3} unit={36} maxWidth={360} xLabel="w" yLabel="b" ariaLabel={`Ball at w = ${fmt(p.x)}, b = ${fmt(p.y)}, loss ${fmt(L(p.x, p.y))}`}>
        <Rings cx={cw} cy={cb} />
        {trail.length > 0 && <Trail pts={[...trail, p]} />}
        {!flat && <Arrow x1={p.x} y1={p.y} x2={p.x + gw * k} y2={p.y + gb * k} color={C.accent} width={3} />}
        {!flat && <Arrow x1={p.x} y1={p.y} x2={p.x - gw * k} y2={p.y - gb * k} color={C.good} width={3.5} />}
        <DragPoint x={p.x} y={p.y} onMove={move} snap={0.5} color={C.violet} r={10} />
      </Plane>
      <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
        {[['loss L', fmt(L(p.x, p.y))], ['slope for w', fmt(gw)], ['slope for b', fmt(gb)], ['gradient', `(${fmt(gw)}, ${fmt(gb)})`]].map(([a, b]) => (
          <div key={a} className="rounded-xl bg-ink-100 p-2 dark:bg-ink-800"><p className="muted text-[10px] font-bold uppercase">{a}</p><p className="font-mono text-sm font-bold">{b}</p></div>
        ))}
      </div>
      <Slider label="Learning rate (step size)" value={lr} min={0.05} max={0.6} step={0.05} onChange={setLr} />
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={step} disabled={flat}>⬇️ Step downhill</button>
        <button className="btn-ghost" onClick={() => move({ x: start[0], y: start[1] })}>↺ Reset</button>
      </div>
      <Goal done={flat}>{flat ? 'You reached the bottom! The gradient is (0, 0): flat in every direction.' : 'Each step moves w and b a little bit opposite to their slopes. Keep stepping until the ground is flat.'}</Goal>
    </VisualCard>
  )
}
function Rings({ cx, cy }) {
  const { sx, sy, unit } = usePlane()
  return [6, 5, 4, 3, 2, 1, 0.5].map((r) => <circle key={r} cx={sx(cx)} cy={sy(cy)} r={r * unit} style={{ fill: C.blue, stroke: C.blue }} fillOpacity={0.09} strokeOpacity={0.25} />)
}
function Trail({ pts }) {
  const { sx, sy } = usePlane()
  return <polyline points={pts.map((q) => `${sx(q.x)},${sy(q.y)}`).join(' ')} fill="none" style={{ stroke: C.violet }} strokeWidth={2} strokeDasharray="4 3" />
}

// ───────────────────────── 10. Gradient descent, step by step ─────────────────────────
function DescentSteps({ target = 3, start = 0, lr0 = 0.1 }) {
  const f = (x) => (x - target) ** 2
  const slope = (x) => 2 * (x - target)
  const [lr, setLr] = useState(lr0)
  const [xs, setXs] = useState([start])
  const x = xs[xs.length - 1]
  const off = Math.abs(x - target) > 6
  const done = Math.abs(x - target) < 0.05
  const step = () => setXs((h) => (h.length > 25 ? h : [...h, h[h.length - 1] - lr * slope(h[h.length - 1])]))
  const last = xs.length > 1 ? xs[xs.length - 2] : null
  return (
    <VisualCard title={`Rolling down f(x) = (x − ${target})²`} hint="Pick a learning rate, then press **Take a step**. The table shows the maths for every step.">
      <Plane xmin={-1} xmax={7} ymin={-1} ymax={10} unit={30} maxWidth={340} ariaLabel={`Ball at x = ${fmt(x)} after ${xs.length - 1} steps`}>
        <Seg x1={target} y1={-1} x2={target} y2={10} color={C.good} dashed />
        <Curve fn={f} color={C.muted} width={3} />
        {xs.slice(1).map((v, i) => Math.abs(v - target) < 4.2 && Math.abs(xs[i] - target) < 4.2 && <Arrow key={i} x1={xs[i]} y1={f(xs[i])} x2={v} y2={f(v)} color={C.accent} width={2} opacity={0.5} />)}
        {!off && <Dot x={x} y={Math.min(f(x), 10)} color={C.accent} r={9} />}
      </Plane>
      <Slider label="Learning rate" value={lr} min={0.05} max={1.1} step={0.05} onChange={(v) => { setLr(v); setXs([start]) }} />
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={step} disabled={off || done}>👣 Take a step</button>
        <button className="btn-ghost" onClick={() => setXs([start])}>↺ Reset</button>
      </div>
      {last !== null && (
        <p className="rounded-xl bg-[color:var(--card)] p-3 font-mono text-sm shadow-sm" aria-live="polite">
          slope at x = {fmt(last, 3)} is 2 × ({fmt(last, 3)} − {target}) = <strong>{fmt(slope(last), 3)}</strong><br />
          new x = {fmt(last, 3)} − {fmt(lr)} × ({fmt(slope(last), 3)}) = <strong className="text-brand-600 dark:text-brand-300">{fmt(x, 3)}</strong>
        </p>
      )}
      {xs.length > 1 && (
        <div className="max-h-40 overflow-auto">
          <NumberRow values={xs.map((v) => fmt(v, 2))} labels={xs.map((_, i) => (i === 0 ? 'start' : `step ${i}`))} />
        </div>
      )}
      {off && <p className="text-sm font-bold text-rose-600 dark:text-rose-400">💥 The steps are too big! x jumped right out of the valley. Lower the learning rate.</p>}
      <Goal done={done}>{done ? `At the bottom (x ≈ ${target}) in ${xs.length - 1} steps!` : 'Get the ball to the green line. Can you do it in 5 steps or fewer?'}</Goal>
    </VisualCard>
  )
}

export default {
  functionMachine: FunctionMachine,
  pointWalk: PointWalk,
  plotBuilder: PlotBuilder,
  slopeLine: SlopeLine,
  tangentZoom: TangentZoom,
  powerRule: PowerRule,
  chainGears: ChainGears,
  lossPlayground: LossPlayground,
  gradientHill: GradientHill,
  descentSteps: DescentSteps,
}
