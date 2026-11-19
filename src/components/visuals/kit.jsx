// Shared building blocks for the interactive lesson visuals (see ./index.jsx).
// Colours come from CSS variables so everything works in light and dark mode.
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Inline } from '../Inline'

export const C = {
  accent: 'var(--accent)',
  blue: 'var(--blue)',
  violet: 'var(--violet)',
  good: 'var(--good)',
  bad: 'var(--bad)',
  muted: 'var(--muted)',
  ink: 'var(--ink)',
  grid: 'var(--grid)',
  line: 'var(--line)',
  card: 'var(--card)',
}

/** Round for display: 3.0 → "3", 0.33333 → "0.33". */
export const fmt = (n, d = 2) => {
  if (!Number.isFinite(n)) return n > 0 ? '∞' : n < 0 ? '−∞' : '?'
  const s = (Math.abs(n) < 1e-9 ? 0 : n).toFixed(d)
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s
}

/** Frame every visual uses: title, a "what to do" hint, the picture, and an optional footer. */
export function VisualCard({ title, hint, children, footer }) {
  return (
    <figure className="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20">
      <div className="flex flex-wrap items-center gap-2 border-b border-emerald-200 px-4 py-2.5 dark:border-emerald-900">
        <span className="chip bg-emerald-600 text-white">👀 Look &amp; play</span>
        {title && <span className="text-sm font-extrabold">{title}</span>}
      </div>
      {hint && (
        <p className="px-4 pt-3 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
          👆 <Inline text={hint} />
        </p>
      )}
      <div className="space-y-3 p-4">{children}</div>
      {footer && <figcaption className="border-t border-emerald-200 px-4 py-2.5 text-sm dark:border-emerald-900"><Inline text={footer} /></figcaption>}
    </figure>
  )
}

/** A friendly "you did it" banner for small in-visual goals. */
export function Goal({ done, children }) {
  return (
    <p className={`rounded-xl px-3 py-2 text-sm font-bold ${done ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200'}`}>
      {done ? '🎉 ' : '🎯 '}
      {children}
    </p>
  )
}

/** Labelled range slider. */
export function Slider({ label, value, min, max, step = 1, onChange, format = (v) => fmt(v) }) {
  return (
    <label className="block text-sm font-bold">
      <span className="flex justify-between gap-2">
        <span><Inline text={label} /></span>
        <span className="font-mono">{format(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-1 w-full accent-[#fb5b14]" />
    </label>
  )
}

/** Back / Next / Play controls for step-by-step animations. */
export function Stepper({ step, total, setStep, labels }) {
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    if (step >= total - 1) return setPlaying(false)
    const t = setTimeout(() => setStep(step + 1), 1100)
    return () => clearTimeout(t)
  }, [playing, step, total, setStep])
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="btn-ghost px-2.5" onClick={() => { setPlaying(false); setStep(0) }} disabled={step === 0} aria-label="Restart">⏮</button>
      <button className="btn-ghost" onClick={() => { setPlaying(false); setStep(step - 1) }} disabled={step === 0}>◀ Back</button>
      <button className="btn-primary" onClick={() => { setPlaying(false); setStep(step + 1) }} disabled={step >= total - 1}>Next ▶</button>
      <button className="btn-ghost" onClick={() => setPlaying((p) => !p)} disabled={step >= total - 1}>{playing ? '⏸ Pause' : '⏯ Play'}</button>
      <span className="muted text-xs font-bold">Step {step + 1} of {total}{labels?.[step] ? ` · ${labels[step]}` : ''}</span>
    </div>
  )
}

// ── Coordinate plane ────────────────────────────────────────────────────────

const PlaneCtx = createContext(null)
/** Inside <Plane>: { sx, sy, unit } converts maths coordinates to SVG pixels. */
export const usePlane = () => useContext(PlaneCtx)

/**
 * An SVG grid with axes and numbers. Children draw in maths coordinates via usePlane().
 * Props: xmin, xmax, ymin, ymax, size (px of one unit, default 36), labels (show numbers),
 * xLabel/yLabel, onPointer(point) for clicks, ariaLabel.
 */
export function Plane({ xmin = -5, xmax = 5, ymin = -5, ymax = 5, unit = 36, labels = true, xLabel = 'x', yLabel = 'y', children, ariaLabel, onPointer, maxWidth = 460 }) {
  const svg = useRef(null)
  const pad = 22
  const w = (xmax - xmin) * unit + pad * 2
  const h = (ymax - ymin) * unit + pad * 2
  const sx = (x) => pad + (x - xmin) * unit
  const sy = (y) => pad + (ymax - y) * unit
  const toWorld = (e) => {
    const pt = svg.current.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(svg.current.getScreenCTM().inverse())
    return { x: (p.x - pad) / unit + xmin, y: ymax - (p.y - pad) / unit }
  }
  const xs = []
  for (let x = Math.ceil(xmin); x <= xmax; x++) xs.push(x)
  const ys = []
  for (let y = Math.ceil(ymin); y <= ymax; y++) ys.push(y)
  const ox = Math.min(Math.max(0, xmin), xmax)
  const oy = Math.min(Math.max(0, ymin), ymax)
  return (
    <PlaneCtx.Provider value={{ sx, sy, unit, toWorld, svg, xmin, xmax, ymin, ymax }}>
      <svg
        ref={svg}
        viewBox={`0 0 ${w} ${h}`}
        className="touch-none mx-auto block h-auto w-full select-none rounded-xl"
        style={{ maxWidth, background: C.card }}
        role="img"
        aria-label={ariaLabel}
        onPointerDown={onPointer ? (e) => onPointer(toWorld(e), e) : undefined}
      >
        {xs.map((x) => <line key={`x${x}`} x1={sx(x)} y1={sy(ymin)} x2={sx(x)} y2={sy(ymax)} style={{ stroke: C.grid }} strokeWidth={1} />)}
        {ys.map((y) => <line key={`y${y}`} x1={sx(xmin)} y1={sy(y)} x2={sx(xmax)} y2={sy(y)} style={{ stroke: C.grid }} strokeWidth={1} />)}
        <line x1={sx(xmin)} y1={sy(oy)} x2={sx(xmax)} y2={sy(oy)} style={{ stroke: C.muted }} strokeWidth={1.6} />
        <line x1={sx(ox)} y1={sy(ymin)} x2={sx(ox)} y2={sy(ymax)} style={{ stroke: C.muted }} strokeWidth={1.6} />
        {labels && xs.filter((x) => x !== ox).map((x) => <text key={`lx${x}`} x={sx(x)} y={sy(oy) + 14} fontSize={10} textAnchor="middle" style={{ fill: C.muted }}>{x}</text>)}
        {labels && ys.filter((y) => y !== oy).map((y) => <text key={`ly${y}`} x={sx(ox) - 6} y={sy(y) + 3.5} fontSize={10} textAnchor="end" style={{ fill: C.muted }}>{y}</text>)}
        {labels && <text x={sx(ox) - 6} y={sy(oy) + 14} fontSize={10} textAnchor="end" style={{ fill: C.muted }}>0</text>}
        {xLabel && <text x={sx(xmax) - 2} y={sy(oy) - 6} fontSize={12} fontWeight={800} textAnchor="end" style={{ fill: C.muted }}>{xLabel}</text>}
        {yLabel && <text x={sx(ox) + 6} y={sy(ymax) + 12} fontSize={12} fontWeight={800} style={{ fill: C.muted }}>{yLabel}</text>}
        {children}
      </svg>
    </PlaneCtx.Provider>
  )
}

/** Arrow from (x1, y1) to (x2, y2) in plane coordinates. */
export function Arrow({ x1 = 0, y1 = 0, x2, y2, color = C.accent, width = 3.5, dashed = false, label, opacity = 1 }) {
  const { sx, sy } = usePlane()
  const ax = sx(x1), ay = sy(y1), bx = sx(x2), by = sy(y2)
  const len = Math.hypot(bx - ax, by - ay)
  const ang = Math.atan2(by - ay, bx - ax)
  const head = Math.min(12, len * 0.5)
  const hx = bx - Math.cos(ang) * head * 0.8, hy = by - Math.sin(ang) * head * 0.8
  const p1 = [bx - head * Math.cos(ang - 0.45), by - head * Math.sin(ang - 0.45)]
  const p2 = [bx - head * Math.cos(ang + 0.45), by - head * Math.sin(ang + 0.45)]
  return (
    <g opacity={opacity}>
      {len > 1 && <line x1={ax} y1={ay} x2={hx} y2={hy} style={{ stroke: color }} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? '6 5' : undefined} />}
      {len > 1 && <polygon points={`${bx},${by} ${p1.join(',')} ${p2.join(',')}`} style={{ fill: color }} />}
      {label && <text x={bx + 8} y={by - 8} fontSize={13} fontWeight={800} style={{ fill: color }}>{label}</text>}
    </g>
  )
}

/**
 * A draggable point (mouse, touch and keyboard arrows). Snaps to `snap` (default 1).
 * onMove({x, y}) gets the clamped, snapped position.
 */
export function DragPoint({ x, y, onMove, color = C.accent, label, snap = 1, r = 9, bounds }) {
  const { sx, sy, toWorld, xmin, xmax, ymin, ymax } = usePlane()
  const [drag, setDrag] = useState(false)
  const b = bounds || { xmin, xmax, ymin, ymax }
  const clamp = (p) => ({
    x: Math.max(b.xmin, Math.min(b.xmax, Math.round(p.x / snap) * snap)),
    y: Math.max(b.ymin, Math.min(b.ymax, Math.round(p.y / snap) * snap)),
  })
  const key = (e) => {
    const d = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key]
    if (!d) return
    e.preventDefault()
    onMove(clamp({ x: x + d[0] * snap, y: y + d[1] * snap }))
  }
  return (
    <g>
      <circle cx={sx(x)} cy={sy(y)} r={r + 10} fill="transparent" style={{ cursor: drag ? 'grabbing' : 'grab' }}
        onPointerDown={(e) => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); setDrag(true) }}
        onPointerMove={(e) => drag && onMove(clamp(toWorld(e)))}
        onPointerUp={() => setDrag(false)}
        onPointerCancel={() => setDrag(false)}
      />
      <circle cx={sx(x)} cy={sy(y)} r={r} style={{ fill: color, stroke: C.card, pointerEvents: 'none' }} strokeWidth={3} />
      <circle cx={sx(x)} cy={sy(y)} r={r + 10} fill="transparent" tabIndex={0} role="slider" aria-label={`${label || 'point'} at (${fmt(x)}, ${fmt(y)}). Use arrow keys to move.`} onKeyDown={key} className="outline-none focus:stroke-[3]" style={{ stroke: color, pointerEvents: 'none' }} strokeOpacity={0} />
      {label && <text x={sx(x) + 12} y={sy(y) - 12} fontSize={13} fontWeight={800} style={{ fill: color, pointerEvents: 'none' }}>{label}</text>}
    </g>
  )
}

/** Plot y = fn(x) as a smooth path inside a Plane. */
export function Curve({ fn, color = C.muted, width = 3, from, to, samples = 160, dashed }) {
  const { sx, sy, xmin, xmax, ymin, ymax } = usePlane()
  const a = from ?? xmin, b = to ?? xmax
  let d = ''
  let pen = false
  for (let k = 0; k <= samples; k++) {
    const x = a + ((b - a) * k) / samples
    const y = fn(x)
    if (!Number.isFinite(y) || y < ymin - 50 || y > ymax + 50) { pen = false; continue }
    const yy = Math.max(ymin - 1, Math.min(ymax + 1, y))
    d += `${pen ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(yy).toFixed(1)} `
    pen = true
  }
  return <path d={d} fill="none" style={{ stroke: color }} strokeWidth={width} strokeLinejoin="round" strokeDasharray={dashed ? '6 5' : undefined} clipPath="none" />
}

/** A row of number boxes, like a vector written as a list. */
export function NumberRow({ values, color = 'brand', name, highlight = [], labels }) {
  const tone = { brand: 'border-brand-400 bg-brand-50 dark:bg-brand-900/30', blue: 'border-sky-400 bg-sky-50 dark:bg-sky-900/30', violet: 'border-violet-400 bg-violet-50 dark:bg-violet-900/30', green: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' }[color]
  return (
    <div className="flex items-end gap-1.5">
      {name && <span className="mr-1 self-center font-mono text-sm font-bold">{name} =</span>}
      {values.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <span className={`grid min-h-10 min-w-10 place-items-center rounded-lg border-2 px-2 font-mono text-sm font-bold transition ${tone} ${highlight.includes(i) ? 'scale-110 ring-2 ring-amber-400' : ''}`}>{typeof v === 'number' ? fmt(v) : v}</span>
          {labels && <span className="font-mono text-[10px] font-bold text-ink-500">{labels[i]}</span>}
        </div>
      ))}
    </div>
  )
}
