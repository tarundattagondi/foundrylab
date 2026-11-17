import { useRef, useState } from 'react'

const R = 5 // the plane spans -R..R on both axes

/**
 * A 2D grid with draggable vector arrows (mouse + touch via pointer events).
 * vectors: [{ x, y, color, label }]; onChange(index, {x, y}) gets snapped values.
 */
export default function VectorPlane({ vectors, onChange, snap = 0.5, children, ariaLabel }) {
  const svg = useRef(null)
  const [drag, setDrag] = useState(null)

  const toPlane = (e) => {
    const pt = svg.current.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(svg.current.getScreenCTM().inverse())
    const clamp = (v) => Math.max(-R, Math.min(R, Math.round(v / snap) * snap))
    return { x: clamp(p.x), y: clamp(-p.y) }
  }

  const down = (e) => {
    const p = toPlane(e)
    let best = -1
    let bestD = 1.2
    vectors.forEach((v, i) => {
      const d = Math.hypot(v.x - p.x, v.y - p.y)
      if (d < bestD) (bestD = d), (best = i)
    })
    if (best === -1) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag(best)
    onChange(best, p)
  }
  const move = (e) => drag !== null && onChange(drag, toPlane(e))
  const up = () => setDrag(null)

  // Keyboard support: focus an arrow handle and use the arrow keys.
  const key = (i) => (e) => {
    const d = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key]
    if (!d) return
    e.preventDefault()
    const v = vectors[i]
    const c = (n) => Math.max(-R, Math.min(R, n))
    onChange(i, { x: c(v.x + d[0] * snap), y: c(v.y + d[1] * snap) })
  }

  const ticks = []
  for (let i = -R; i <= R; i++) ticks.push(i)

  return (
    <svg
      ref={svg}
      viewBox={`${-R - 0.3} ${-R - 0.3} ${2 * R + 0.6} ${2 * R + 0.6}`}
      className="touch-none mx-auto block aspect-square w-full max-w-[420px] cursor-crosshair select-none rounded-xl bg-[color:var(--card)]"
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {vectors.map((v, i) => (
          <marker key={i} id={`head-${i}-${v.color.replace(/\W/g, '')}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" style={{ fill: v.color }} />
          </marker>
        ))}
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={t} y1={-R} x2={t} y2={R} style={{ stroke: 'var(--grid)' }} strokeWidth={t === 0 ? 0.05 : 0.025} />
          <line x1={-R} y1={t} x2={R} y2={t} style={{ stroke: 'var(--grid)' }} strokeWidth={t === 0 ? 0.05 : 0.025} />
        </g>
      ))}
      <line x1={-R} y1={0} x2={R} y2={0} style={{ stroke: 'var(--muted)' }} strokeWidth={0.04} />
      <line x1={0} y1={-R} x2={0} y2={R} style={{ stroke: 'var(--muted)' }} strokeWidth={0.04} />
      {children}
      {vectors.map((v, i) => (
        <g key={i}>
          <line x1={0} y1={0} x2={v.x} y2={-v.y} style={{ stroke: v.color }} strokeWidth={0.12} strokeLinecap="round" markerEnd={`url(#head-${i}-${v.color.replace(/\W/g, '')})`} />
          <circle
            cx={v.x}
            cy={-v.y}
            r={0.38}
            style={{ fill: v.color, stroke: v.color }}
            fillOpacity={drag === i ? 0.5 : 0.22}
            strokeWidth={0.06}
            className="cursor-grab outline-none focus:stroke-[0.14]"
            tabIndex={0}
            role="slider"
            aria-label={`${v.label}: (${v.x}, ${v.y}). Use arrow keys to move.`}
            onKeyDown={key(i)}
          />
          <text x={v.x + 0.45} y={-v.y - 0.45} fontSize={0.55} fontWeight={800} style={{ fill: v.color }}>{v.label}</text>
        </g>
      ))}
    </svg>
  )
}

export const fmt = (n, d = 2) => (Math.abs(n) < 1e-9 ? 0 : n).toFixed(d).replace(/\.?0+$/, '') || '0'
