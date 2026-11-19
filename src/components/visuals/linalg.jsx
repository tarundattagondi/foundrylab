// Interactive visuals for the Linear Algebra module. Export a map of { name: Component }.
// Each component receives the block's props, e.g. { visual: 'coordGrid', target: [3, 2] }.
import { useEffect, useMemo, useState } from 'react'
import { Inline } from '../Inline'
import { VisualCard, Goal, Slider, Stepper, Plane, usePlane, Arrow, DragPoint, NumberRow, fmt, C } from './kit'

// ── small helpers ───────────────────────────────────────────────────────────

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

/** "3 to the right, then 2 up" for a point/vector. */
function walkWords([x, y], { ew = false } = {}) {
  const parts = []
  if (x) parts.push(`${plural(Math.abs(x), ew ? 'step' : 'square')} ${x > 0 ? (ew ? 'east' : 'to the right') : ew ? 'west' : 'to the left'}`)
  if (y) parts.push(`${plural(Math.abs(y), ew ? 'step' : 'square')} ${y > 0 ? (ew ? 'north' : 'up') : ew ? 'south' : 'down'}`)
  if (!parts.length) return ew ? 'stay right where you are (no walking at all)' : 'stay at the start: this IS the origin'
  return parts.join(', then ')
}

/** Text drawn in plane coordinates. */
function Label({ x, y, children, color = C.muted, size = 12, anchor = 'middle', dy = 0, dx = 0, weight = 800 }) {
  const { sx, sy } = usePlane()
  return (
    <text x={sx(x) + dx} y={sy(y) + dy} fontSize={size} fontWeight={weight} textAnchor={anchor} style={{ fill: color, pointerEvents: 'none' }}>
      {children}
    </text>
  )
}

/** Label placed beside the middle of a segment, pushed sideways so it never sits on an arrow tip. */
function MidLabel({ x1 = 0, y1 = 0, x2, y2, children, color, side = 1 }) {
  const { sx, sy } = usePlane()
  const ax = sx(x1), ay = sy(y1), bx = sx(x2), by = sy(y2)
  const len = Math.hypot(bx - ax, by - ay) || 1
  const nx = (-(by - ay) / len) * 14 * side, ny = ((bx - ax) / len) * 14 * side
  return (
    <text x={(ax + bx) / 2 + nx} y={(ay + by) / 2 + ny + 4} fontSize={13} fontWeight={900} textAnchor="middle" style={{ fill: color, pointerEvents: 'none', paintOrder: 'stroke', stroke: C.card }} strokeWidth={4}>
      {children}
    </text>
  )
}

function Seg({ x1, y1, x2, y2, color = C.muted, width = 2, dashed = true }) {
  const { sx, sy } = usePlane()
  return <line x1={sx(x1)} y1={sy(y1)} x2={sx(x2)} y2={sy(y2)} style={{ stroke: color }} strokeWidth={width} strokeDasharray={dashed ? '6 5' : undefined} strokeLinecap="round" />
}

/** Animate a number from 0 → 1 whenever `key` changes to a truthy value. */
function useTween(on, ms = 700) {
  const [t, setT] = useState(on ? 1 : 0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const from = t
    const to = on ? 1 : 0
    const tick = (now) => {
      const k = Math.min(1, (now - start) / ms)
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
      setT(from + (to - from) * e)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on])
  return t
}

const Big = ({ children }) => <p className="text-center font-mono text-2xl font-black tabular-nums">{children}</p>
const Readout = ({ children }) => <div className="rounded-xl bg-[color:var(--card)] p-3 text-[15px] leading-relaxed shadow-sm">{children}</div>
const X = ({ children }) => <span className="font-black text-brand-600 dark:text-brand-300">{children}</span>
const Y = ({ children }) => <span className="font-black text-sky-600 dark:text-sky-300">{children}</span>

// ── 1. coordGrid: the treasure map ──────────────────────────────────────────

function CoordGrid({ start = [3, 2], target, range = 5, emoji = '💰', walk = true, title = 'The treasure map' }) {
  const [p, setP] = useState({ x: start[0], y: start[1] })
  const hit = target && p.x === target[0] && p.y === target[1]
  const move = (q) => setP({ x: Math.max(-range, Math.min(range, Math.round(q.x))), y: Math.max(-range, Math.min(range, Math.round(q.y))) })
  return (
    <VisualCard title={title} hint="Drag the treasure (or tap any crossing on the grid). Watch the two numbers change." footer="The **first** number says how far to go across (x). The **second** says how far to go up (y).">
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        <Plane xmin={-range} xmax={range} ymin={-range} ymax={range} onPointer={move} ariaLabel={`Treasure at (${p.x}, ${p.y})`}>
          {target && <Label x={target[0]} y={target[1]} size={20} dy={7}>❌</Label>}
          {walk && p.x !== 0 && <Seg x1={0} y1={0} x2={p.x} y2={0} color={C.accent} width={4} />}
          {walk && p.y !== 0 && <Seg x1={p.x} y1={0} x2={p.x} y2={p.y} color={C.blue} width={4} />}
          {walk && p.x !== 0 && <Label x={p.x / 2} y={0} dy={p.y >= 0 ? -8 : 18} color={C.accent}>{Math.abs(p.x)} {p.x > 0 ? '→' : '←'}</Label>}
          {walk && p.y !== 0 && <Label x={p.x} y={p.y / 2} dx={p.x >= 0 ? 8 : -8} anchor={p.x >= 0 ? 'start' : 'end'} color={C.blue}>{Math.abs(p.y)} {p.y > 0 ? '↑' : '↓'}</Label>}
          <Label x={0} y={0} dx={-6} dy={-6} anchor="end" size={11}>start</Label>
          <DragPoint x={p.x} y={p.y} onMove={setP} label={`(${p.x}, ${p.y})`} />
          <Label x={p.x} y={p.y} size={18} dy={-14}>{emoji}</Label>
        </Plane>
        <div className="space-y-3">
          <Big>
            (<X>{p.x}</X>, <Y>{p.y}</Y>)
          </Big>
          <Readout>
            Start at <strong>(0, 0)</strong>. Go <X>{walkWords([p.x, 0]).replace('stay at the start: this IS the origin', 'nowhere across')}</X>, then <Y>{walkWords([0, p.y]).replace('stay at the start: this IS the origin', 'nowhere up or down')}</Y>.
          </Readout>
          <p className="text-sm">
            <X>x = {p.x}</X> {p.x > 0 ? '(positive → right)' : p.x < 0 ? '(negative → left)' : '(zero → no sideways move)'}
            <br />
            <Y>y = {p.y}</Y> {p.y > 0 ? '(positive → up)' : p.y < 0 ? '(negative → down)' : '(zero → no up/down move)'}
          </p>
          {target && <Goal done={hit}>{hit ? `You found the spot (${target[0]}, ${target[1]})!` : `Challenge: move the treasure to the ❌ at (${target[0]}, ${target[1]}).`}</Goal>}
        </div>
      </div>
    </VisualCard>
  )
}

// ── 2. vectorArrow: an arrow is a list of numbers ───────────────────────────

function VectorArrow({ start = [3, 2], range = 5, showOpposite = false, names = ['east', 'north'] }) {
  const [v, setV] = useState({ x: start[0], y: start[1] })
  const [opp, setOpp] = useState(false)
  return (
    <VisualCard title="An arrow is just a list of numbers" hint="Drag the arrow's tip. The list of numbers changes with it." footer="The arrow always starts at the origin. Its tip lands exactly on the point **(x, y)**, so the list **[x, y]** describes the arrow completely.">
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        <Plane xmin={-range} xmax={range} ymin={-range} ymax={range} ariaLabel={`Vector [${v.x}, ${v.y}]`}>
          {v.x !== 0 && <Seg x1={0} y1={0} x2={v.x} y2={0} color={C.accent} width={1.5} />}
          {v.y !== 0 && <Seg x1={v.x} y1={0} x2={v.x} y2={v.y} color={C.blue} width={1.5} />}
          {opp && <Arrow x2={-v.x} y2={-v.y} color={C.violet} dashed label="opposite" />}
          <Arrow x2={v.x} y2={v.y} color={C.accent} label="v" />
          <DragPoint x={v.x} y={v.y} onMove={setV} label="" r={8} />
        </Plane>
        <div className="space-y-3">
          <div className="flex justify-center">
            <NumberRow name="v" values={[v.x, v.y]} labels={names} />
          </div>
          <Readout>
            This arrow means: walk <strong>{walkWords([v.x, v.y], { ew: true })}</strong>.
          </Readout>
          {showOpposite && (
            <>
              <button className="btn-ghost w-full" onClick={() => setOpp((o) => !o)}>{opp ? 'Hide' : 'Show'} the opposite arrow</button>
              {opp && (
                <div className="flex justify-center">
                  <NumberRow name="-v" color="violet" values={[-v.x, -v.y]} />
                </div>
              )}
              {opp && <p className="text-sm">Every number flipped its sign. Same length, pointing the other way!</p>}
            </>
          )}
        </div>
      </div>
    </VisualCard>
  )
}

// ── 3. vectorAdd: walk a, then walk b ───────────────────────────────────────

function VectorAdd({ a: a0 = [3, 1], b: b0 = [1, 2] }) {
  const [a, setA] = useState({ x: a0[0], y: a0[1] })
  const [b, setB] = useState({ x: b0[0], y: b0[1] })
  const [step, setStep] = useState(0)
  const t = useTween(step >= 1)
  const bx0 = a.x * t, by0 = a.y * t // where arrow b starts (slides to the tip of a)
  const sum = { x: a.x + b.x, y: a.y + b.y }
  const labels = ['two separate walks', 'slide b to the end of a', 'the shortcut a + b']
  return (
    <VisualCard title="Adding arrows: walk one, then the other" hint="Press **Next** to slide arrow **b** to the end of arrow **a**. You can drag both tips too." footer="To add vectors, add the **matching** numbers: first with first, second with second.">
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        <Plane xmin={-3} xmax={7} ymin={-3} ymax={6} unit={34} ariaLabel={`a = [${a.x}, ${a.y}], b = [${b.x}, ${b.y}], a + b = [${sum.x}, ${sum.y}]`}>
          {step >= 2 && <Arrow x2={sum.x} y2={sum.y} color={C.good} width={4.5} />}
          <Arrow x2={a.x} y2={a.y} color={C.accent} />
          <Arrow x1={bx0} y1={by0} x2={bx0 + b.x} y2={by0 + b.y} color={C.blue} />
          {step >= 2 && <MidLabel x2={sum.x} y2={sum.y} color={C.good} side={-1}>a + b</MidLabel>}
          <MidLabel x2={a.x} y2={a.y} color={C.accent} side={1}>a</MidLabel>
          <MidLabel x1={bx0} y1={by0} x2={bx0 + b.x} y2={by0 + b.y} color={C.blue} side={1}>b</MidLabel>
          <DragPoint x={a.x} y={a.y} onMove={setA} r={7} />
          <DragPoint x={bx0 + b.x} y={by0 + b.y} color={C.blue} r={7}
            onMove={(q) => setB({ x: Math.round(q.x - bx0), y: Math.round(q.y - by0) })} />
        </Plane>
        <div className="space-y-2">
          <NumberRow name="a" values={[a.x, a.y]} />
          <NumberRow name="b" color="blue" values={[b.x, b.y]} />
          {step >= 2 ? (
            <>
              <NumberRow name="a+b" color="green" values={[sum.x, sum.y]} />
              <p className="text-sm">
                {a.x} + {b.x} = <strong>{sum.x}</strong> and {a.y} + {b.y} = <strong>{sum.y}</strong>
              </p>
            </>
          ) : (
            <p className="muted text-sm">{step === 0 ? 'Two walks, both starting at home.' : 'Arrow b now starts where a ends: first walk a, then walk b.'}</p>
          )}
        </div>
      </div>
      <Stepper step={step} total={3} setStep={setStep} labels={labels} />
      {step >= 2 && <Goal done>The green shortcut lands exactly where the two walks end: [{sum.x}, {sum.y}].</Goal>}
    </VisualCard>
  )
}

// ── 4. vectorScale: stretch, shrink, flip ───────────────────────────────────

function VectorScale({ v: v0 = [2, 1], k: k0 = 2 }) {
  const [v, setV] = useState({ x: v0[0], y: v0[1] })
  const [k, setK] = useState(k0)
  const kv = { x: k * v.x, y: k * v.y }
  const what = k === 0 ? 'squashed to nothing (length 0)!' : k < 0 ? `flipped around to point the other way${Math.abs(k) !== 1 ? ` and made ${Math.abs(k) > 1 ? 'longer' : 'shorter'}` : ''}.` : k === 1 ? 'exactly the same as before.' : k > 1 ? `stretched ${fmt(k)} times longer.` : `shrunk to ${fmt(k)} of its length.`
  return (
    <VisualCard title="Scaling: stretch, shrink or flip" hint="Slide **k** to stretch the arrow. Try 0.5, 0 and -1. You can also drag the grey arrow's tip." footer="Scaling multiplies **every** number in the vector by the same number k.">
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        <Plane xmin={-7} xmax={7} ymin={-5} ymax={5} unit={28} ariaLabel={`${fmt(k)} times [${v.x}, ${v.y}] is [${fmt(kv.x)}, ${fmt(kv.y)}]`}>
          <Arrow x2={kv.x} y2={kv.y} color={C.accent} width={5} label={`${fmt(k)}v`} />
          <Arrow x2={v.x} y2={v.y} color={C.muted} width={2.5} label="v" />
          <DragPoint x={v.x} y={v.y} onMove={setV} color={C.muted} r={6} bounds={{ xmin: -3, xmax: 3, ymin: -3, ymax: 3 }} />
        </Plane>
        <div className="space-y-2">
          <Slider label="k (the scalar)" value={k} min={-2} max={3} step={0.5} onChange={setK} />
          <NumberRow name="v" color="blue" values={[v.x, v.y]} />
          <NumberRow name={`${fmt(k)}v`} values={[kv.x, kv.y]} />
          <p className="text-sm">
            {fmt(k)} × {v.x} = <strong>{fmt(kv.x)}</strong>, and {fmt(k)} × {v.y} = <strong>{fmt(kv.y)}</strong>
          </p>
          <Readout>The arrow got {what}</Readout>
        </div>
      </div>
    </VisualCard>
  )
}

// ── 5. vectorLength: Pythagoras live ────────────────────────────────────────

function VectorLength({ v: v0 = [3, 4], goal = 5 }) {
  const [v, setV] = useState({ x: v0[0], y: v0[1] })
  const sq = v.x * v.x + v.y * v.y
  const len = Math.sqrt(sq)
  const whole = Number.isInteger(len)
  const other = goal && whole && len === goal && !(v.x === v0[0] && v.y === v0[1])
  return (
    <VisualCard title="How long is the arrow?" hint="Drag the arrow's tip. The triangle and the maths update by themselves." footer="**Across² + Up² = Length²**, then a square root undoes the squaring.">
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
        <Plane xmin={-6} xmax={6} ymin={-6} ymax={6} unit={30} ariaLabel={`Vector [${v.x}, ${v.y}] has length ${fmt(len)}`}>
          {v.x !== 0 && <Seg x1={0} y1={0} x2={v.x} y2={0} color={C.accent} width={3} dashed={false} />}
          {v.y !== 0 && <Seg x1={v.x} y1={0} x2={v.x} y2={v.y} color={C.blue} width={3} dashed={false} />}
          {v.x !== 0 && v.y !== 0 && <RightAngle x={v.x} y={0} dx={-Math.sign(v.x)} dy={Math.sign(v.y)} />}
          {v.x !== 0 && <Label x={v.x / 2} y={0} dy={v.y >= 0 ? -7 : 16} color={C.accent}>across {Math.abs(v.x)}</Label>}
          {v.y !== 0 && <Label x={v.x} y={v.y / 2} dx={v.x >= 0 ? 7 : -7} anchor={v.x >= 0 ? 'start' : 'end'} color={C.blue}>up {Math.abs(v.y)}</Label>}
          <Arrow x2={v.x} y2={v.y} color={C.good} width={4} />
          <Label x={v.x / 2} y={v.y / 2} dx={v.x * v.y >= 0 ? -8 : 8} dy={-6} anchor={v.x * v.y >= 0 ? 'end' : 'start'} color={C.good} size={13}>🐦 {fmt(len)}</Label>
          <DragPoint x={v.x} y={v.y} onMove={setV} color={C.good} r={7} />
        </Plane>
        <div className="space-y-2 text-[15px]">
          <ol className="space-y-1.5">
            <li>1. Across = <X>{Math.abs(v.x)}</X>, squared: {Math.abs(v.x)} × {Math.abs(v.x)} = <strong>{v.x * v.x}</strong></li>
            <li>2. Up = <Y>{Math.abs(v.y)}</Y>, squared: {Math.abs(v.y)} × {Math.abs(v.y)} = <strong>{v.y * v.y}</strong></li>
            <li>3. Add them: {v.x * v.x} + {v.y * v.y} = <strong>{sq}</strong></li>
            <li>4. Square root: √{sq} = <strong className="text-emerald-700 dark:text-emerald-300">{fmt(len)}</strong>{!whole && ' (not a whole number, that is fine!)'}</li>
          </ol>
          {goal && <Goal done={other}>{other ? `Yes! [${v.x}, ${v.y}] also has length ${goal}.` : `Challenge: find a DIFFERENT arrow with length exactly ${goal}.`}</Goal>}
        </div>
      </div>
    </VisualCard>
  )
}

function RightAngle({ x, y, dx, dy }) {
  const { sx, sy, unit } = usePlane()
  const s = 0.35 * unit
  const px = sx(x), py = sy(y)
  return <path d={`M${px + dx * s},${py} L${px + dx * s},${py - dy * s} L${px},${py - dy * s}`} fill="none" style={{ stroke: C.muted }} strokeWidth={1.5} />
}

// ── 6. dotSteps: multiply pairs, then add ───────────────────────────────────

function NumInput({ value, onChange, tone }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value === '' || e.target.value === '-' ? 0 : +e.target.value)}
      className={`h-11 w-14 rounded-lg border-2 bg-[color:var(--card)] text-center font-mono text-sm font-bold ${tone}`}
      aria-label="number"
    />
  )
}

function DotSteps({ a: a0 = [1, 2], b: b0 = [3, 4] }) {
  const [a, setA] = useState(a0)
  const [b, setB] = useState(b0)
  const [step, setStep] = useState(0)
  const n = a.length
  const prods = a.map((x, i) => x * b[i])
  const total = prods.reduce((s, p) => s + p, 0)
  const total_steps = n + 2
  const shownProds = Math.min(Math.max(step, 0), n)
  const verdict = total > 0 ? ['Positive: the arrows mostly **agree** (point the same way). 🎉', 'text-emerald-700 dark:text-emerald-300'] : total < 0 ? ['Negative: the arrows **disagree** (point opposite ways). 😠', 'text-rose-700 dark:text-rose-300'] : ['Zero: the arrows are at a **right angle**, unrelated. 🤷', 'text-sky-700 dark:text-sky-300']
  const labels = ['line up the pairs', ...a.map((_, i) => `multiply pair ${i + 1}`), 'add them up']
  const set = (arr, setArr, i) => (v) => { const c = [...arr]; c[i] = v; setArr(c); setStep(0) }
  return (
    <VisualCard title="The dot product, one step at a time" hint="Type your own numbers into the boxes, then press **Next** to watch the recipe." footer="Recipe: **multiply each matching pair, then add all the answers.** The result is ONE number.">
      <div className="overflow-x-auto">
        <div className="inline-grid gap-x-2 gap-y-1" style={{ gridTemplateColumns: `auto repeat(${n}, auto) auto` }}>
          <span className="self-center pr-1 font-mono font-bold">a</span>
          {a.map((x, i) => <NumInput key={i} value={x} onChange={set(a, setA, i)} tone="border-brand-400" />)}
          <span />
          <span className="self-center pr-1 font-mono font-bold">b</span>
          {b.map((x, i) => <NumInput key={i} value={x} onChange={set(b, setB, i)} tone="border-sky-400" />)}
          <span />
          <span className="self-center pr-1 text-xs font-bold">×</span>
          {prods.map((p, i) => (
            <span key={i} className={`grid h-11 w-14 place-items-center rounded-lg border-2 font-mono text-sm font-bold transition ${i < shownProds ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/30' : 'border-dashed border-[color:var(--line)] text-transparent'} ${i === step - 1 ? 'scale-110 ring-2 ring-amber-400' : ''}`}>
              {fmt(p)}
            </span>
          ))}
          <span />
        </div>
      </div>
      <div className="min-h-[4.5rem] rounded-xl bg-[color:var(--card)] p-3 text-[15px] shadow-sm" aria-live="polite">
        {step === 0 && <p>Each number in <strong>a</strong> has a partner in <strong>b</strong> right below it. We will multiply each pair.</p>}
        {step >= 1 && step <= n && (
          <p>
            Pair {step}: {a[step - 1]} × {b[step - 1]} = <strong>{fmt(prods[step - 1])}</strong>
          </p>
        )}
        {step === n + 1 && (
          <>
            <p>
              Add them up: {prods.map((p) => (p < 0 ? `(${fmt(p)})` : fmt(p))).join(' + ')} = <strong className="text-xl">{fmt(total)}</strong>
            </p>
            <p className={`mt-1 font-bold ${verdict[1]}`}><Inline text={verdict[0]} /></p>
          </>
        )}
      </div>
      <Stepper step={step} total={total_steps} setStep={setStep} labels={labels} />
    </VisualCard>
  )
}

// ── 7. matrixGrid: rows, columns and M[row, col] ────────────────────────────

const ROW_TONES = ['bg-brand-100 dark:bg-brand-900/40', 'bg-sky-100 dark:bg-sky-900/40', 'bg-violet-100 dark:bg-violet-900/40', 'bg-emerald-100 dark:bg-emerald-900/40', 'bg-amber-100 dark:bg-amber-900/40']

function MatrixGrid({ rows = [[1, 2, 3], [4, 5, 6]], name = 'M', rowNames, colNames, ask }) {
  const [sel, setSel] = useState(null)
  const R = rows.length, Cn = rows[0].length
  const hit = ask && sel && sel[0] === ask[0] && sel[1] === ask[1]
  return (
    <VisualCard title={`Matrix ${name}: a table of numbers`} hint="Tap (or hover over) any box to see its row, its column and how to grab it in Python." footer={`Shape = **(rows, columns)** = **(${R}, ${Cn})**. Rows go across, columns go down. Counting starts at **0**.`}>
      <div className="overflow-x-auto">
        <table className="mx-auto border-separate border-spacing-1 font-mono text-sm">
          <thead>
            <tr>
              <th />
              {rows[0].map((_, c) => (
                <th key={c} className={`rounded-md px-2 py-1 text-xs ${sel && sel[1] === c ? 'bg-sky-200 dark:bg-sky-800' : 'text-ink-500'}`}>{colNames ? colNames[c] : `col ${c}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                <th className={`rounded-md px-2 py-1 text-right text-xs ${sel && sel[0] === ri ? 'bg-brand-200 dark:bg-brand-800' : 'text-ink-500'}`}>{rowNames ? rowNames[ri] : `row ${ri}`}</th>
                {r.map((v, ci) => {
                  const on = sel && sel[0] === ri && sel[1] === ci
                  const inLine = sel && (sel[0] === ri || sel[1] === ci)
                  return (
                    <td key={ci} className="p-0">
                      <button
                        onMouseEnter={() => setSel([ri, ci])}
                        onFocus={() => setSel([ri, ci])}
                        onClick={() => setSel([ri, ci])}
                        className={`h-11 min-w-11 rounded-lg border-2 px-2 text-base font-bold transition ${on ? 'scale-110 border-amber-500 bg-amber-200 dark:bg-amber-700' : inLine ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/30' : 'border-[color:var(--line)] bg-[color:var(--card)]'}`}
                        aria-label={`${name}[${ri}, ${ci}] = ${v}`}
                      >
                        {v}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Readout>
        {sel ? (
          <>
            <span className="font-mono font-bold">{name}[{sel[0]}, {sel[1]}] = {rows[sel[0]][sel[1]]}</span>
            <br />
            Row {sel[0]}{rowNames ? ` (${rowNames[sel[0]]})` : ''}, column {sel[1]}{colNames ? ` (${colNames[sel[1]]})` : ''}. Row number first, then column number.
          </>
        ) : (
          <>This matrix has <strong>{R} rows</strong> and <strong>{Cn} columns</strong>, so its shape is <strong>({R}, {Cn})</strong>. Tap a box!</>
        )}
      </Readout>
      {ask && <Goal done={hit}>{hit ? `Yes! ${name}[${ask[0]}, ${ask[1]}] is ${rows[ask[0]][ask[1]]}.` : `Challenge: tap the box ${name}[${ask[0]}, ${ask[1]}].`}</Goal>}
    </VisualCard>
  )
}

// ── 8. matmulSteps: row × column, one box at a time ─────────────────────────

function MatTable({ m, name, hlRow, hlCol, filled, tone = 'brand', rowNames, colNames, current }) {
  const hl = { brand: 'bg-brand-200 border-brand-500 dark:bg-brand-800', blue: 'bg-sky-200 border-sky-500 dark:bg-sky-800', green: 'bg-emerald-200 border-emerald-500 dark:bg-emerald-800' }[tone]
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-sm font-bold">{name} <span className="muted text-xs">({m.length}, {m[0].length})</span></span>
      <table className="border-separate border-spacing-1 font-mono text-sm">
        {colNames && (
          <thead>
            <tr>{rowNames && <th />}{colNames.map((c) => <th key={c} className="px-1 text-[10px] text-ink-500">{c}</th>)}</tr>
          </thead>
        )}
        <tbody>
          {m.map((r, ri) => (
            <tr key={ri}>
              {rowNames && <th className="pr-1 text-right text-[10px] text-ink-500">{rowNames[ri]}</th>}
              {r.map((v, ci) => {
                const on = ri === hlRow || ci === hlCol
                const show = !filled || filled(ri, ci)
                const cur = current && current[0] === ri && current[1] === ci
                return (
                  <td key={ci} className={`h-10 min-w-10 rounded-lg border-2 px-1.5 text-center font-bold transition ${cur ? 'scale-110 border-amber-500 bg-amber-200 dark:bg-amber-700' : on ? hl : 'border-[color:var(--line)] bg-[color:var(--card)]'}`}>
                    {show ? fmt(v) : '?'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MatmulSteps({ A = [[2, 1], [0, 3]], B = [[5], [10]], nameA = 'A', nameB = 'B', rowNames, midNames, colNames, story }) {
  const m = A.length, n = A[0].length, p = B[0].length
  const fits = n === B.length
  const cells = []
  for (let i = 0; i < m; i++) for (let j = 0; j < p; j++) cells.push([i, j])
  const Cm = fits ? A.map((r) => B[0].map((_, j) => r.reduce((s, a, k) => s + a * B[k][j], 0))) : []
  const [step, setStep] = useState(0)
  const cur = step >= 1 && step <= cells.length ? cells[step - 1] : null
  const done = step > cells.length
  const filledUpTo = done ? cells.length : step - 1
  const isFilled = (i, j) => cells.findIndex(([a, b]) => a === i && b === j) < filledUpTo + (cur ? 1 : 0)
  const labels = ['check the shapes', ...cells.map(([i, j]) => `box [${i}, ${j}]`), 'all done']
  return (
    <VisualCard title={`${nameA} @ ${nameB}: rows times columns`} hint="Press **Next**. Each step fills ONE box of the answer: a row from the left matrix meets a column from the right one." footer="Every box of the answer is a **dot product**: one row of the first matrix with one column of the second.">
      <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-auto">
        <MatTable m={A} name={nameA} hlRow={cur?.[0]} rowNames={rowNames} colNames={midNames} />
        <span className="text-2xl font-black">@</span>
        <MatTable m={B} name={nameB} hlCol={cur?.[1]} tone="blue" rowNames={midNames} colNames={colNames} />
        {fits && (
          <>
            <span className="text-2xl font-black">=</span>
            <MatTable m={Cm} name="answer" tone="green" filled={isFilled} current={cur} rowNames={rowNames} colNames={colNames} />
          </>
        )}
      </div>
      <div className="min-h-[4rem] rounded-xl bg-[color:var(--card)] p-3 text-[15px] shadow-sm" aria-live="polite">
        {!fits && <p className="font-bold text-rose-700 dark:text-rose-300">❌ Can't multiply: {nameA} has {n} columns but {nameB} has {B.length} rows. The inside numbers must match.</p>}
        {fits && step === 0 && (
          <p>
            Shapes: ({m}, <strong>{n}</strong>) @ (<strong>{n}</strong>, {p}). The inside numbers match ✅, so the answer will have shape <strong>({m}, {p})</strong>: {m} row{m > 1 ? 's' : ''}, {p} column{p > 1 ? 's' : ''}.
            {story && <><br />{story}</>}
          </p>
        )}
        {fits && cur && (
          <p>
            Row {cur[0]}{rowNames ? ` (${rowNames[cur[0]]})` : ''} of {nameA} · column {cur[1]}{colNames ? ` (${colNames[cur[1]]})` : ''} of {nameB}:
            <br />
            <span className="font-mono">{A[cur[0]].map((a, k) => `${a}×${B[k][cur[1]]}`).join(' + ')} = <strong>{fmt(Cm[cur[0]][cur[1]])}</strong></span>
          </p>
        )}
        {fits && done && <p>🎉 Every box is filled. ({m}, {n}) @ ({n}, {p}) → ({m}, {p}): the inside {n}s "cancel", the outside numbers make the shape.</p>}
      </div>
      {fits && <Stepper step={step} total={cells.length + 2} setStep={setStep} labels={labels} />}
    </VisualCard>
  )
}

// ── 9. transposeFlip: rows become columns ───────────────────────────────────

const FLIP_TONES = ['border-brand-400 bg-brand-100 dark:bg-brand-900/50', 'border-sky-400 bg-sky-100 dark:bg-sky-900/50', 'border-violet-400 bg-violet-100 dark:bg-violet-900/50', 'border-emerald-400 bg-emerald-100 dark:bg-emerald-900/50']

function TransposeFlip({ M = [[1, 2, 3], [4, 5, 6]] }) {
  const [flipped, setFlipped] = useState(false)
  const R = M.length, Cn = M[0].length
  const size = 48, gap = 6
  const rows = flipped ? Cn : R, cols = flipped ? R : Cn
  const n = Math.max(R, Cn)
  return (
    <VisualCard title="Transpose: flip rows into columns" hint="Press **Flip!** and watch each coloured row turn into a column." footer="The number at row r, column c moves to row c, column r. The shape swaps too.">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="relative" style={{ width: n * (size + gap), height: n * (size + gap) }} aria-label={flipped ? 'Transposed matrix' : 'Original matrix'}>
          {M.flatMap((r, ri) =>
            r.map((v, ci) => {
              const [rr, cc] = flipped ? [ci, ri] : [ri, ci]
              return (
                <div
                  key={`${ri}-${ci}`}
                  className={`absolute grid place-items-center rounded-lg border-2 font-mono text-lg font-black transition-all duration-700 ease-in-out ${FLIP_TONES[ri % FLIP_TONES.length]}`}
                  style={{ width: size, height: size, left: cc * (size + gap), top: rr * (size + gap) }}
                >
                  {v}
                </div>
              )
            }),
          )}
        </div>
        <div className="space-y-2 text-center">
          <p className="font-mono text-xl font-black">{flipped ? 'A.T' : 'A'}</p>
          <p className="text-sm">shape <strong className="font-mono">({rows}, {cols})</strong></p>
          <button className="btn-primary" onClick={() => setFlipped((f) => !f)}>{flipped ? '↩ Flip back' : '🔄 Flip!'}</button>
        </div>
      </div>
      <Readout>
        {flipped
          ? M.map((r, ri) => `Row ${ri} [${r.join(', ')}] is now column ${ri}.`).join(' ')
          : `A has ${R} rows and ${Cn} columns: shape (${R}, ${Cn}). Each colour is one row.`}
      </Readout>
    </VisualCard>
  )
}

// ── 10. glueVsAdd: lists glue, arrays add ───────────────────────────────────

function GlueVsAdd({ a = [1, 2], b = [3, 4] }) {
  const [mode, setMode] = useState('list')
  return (
    <VisualCard title="Python lists glue, NumPy arrays add" hint="Switch between **list +** and **array +** to see the difference." footer="With plain lists, `+` sticks the lists together. With NumPy arrays, `+` adds the matching numbers, which is what we want for vectors!">
      <div className="flex flex-wrap gap-2">
        <button className={mode === 'list' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMode('list')}>list +</button>
        <button className={mode === 'array' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMode('array')}>array +</button>
      </div>
      <p className="font-mono text-sm">{mode === 'list' ? `[${a}] + [${b}]` : `np.array([${a}]) + np.array([${b}])`}</p>
      {mode === 'list' ? (
        <div className="flex flex-wrap items-end gap-3">
          <NumberRow values={a} />
          <span className="pb-2 text-xl font-black">+</span>
          <NumberRow values={b} color="blue" />
          <span className="pb-2 text-xl font-black">=</span>
          <div className="flex gap-1.5">
            <NumberRow values={a} />
            <NumberRow values={b} color="blue" />
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <NumberRow values={a} labels={a.map((_, i) => `position ${i}`)} />
          <NumberRow values={b} color="blue" />
          <div className="w-fit border-t-2 border-[color:var(--ink)] pt-1">
            <NumberRow values={a.map((x, i) => x + b[i])} color="green" />
          </div>
        </div>
      )}
      <Readout>
        {mode === 'list'
          ? `The lists were glued end to end: ${a.length} + ${b.length} = ${a.length + b.length} boxes. No maths happened!`
          : `Each position was added: ${a.map((x, i) => `${x} + ${b[i]} = ${x + b[i]}`).join(', ')}.`}
      </Readout>
    </VisualCard>
  )
}

// ── 11. embeddingMap: words as arrows ───────────────────────────────────────

const WORDS = [
  { w: 'cat', x: 4, y: 1.6, e: '🐱' },
  { w: 'kitten', x: 2.9, y: 2.0, e: '🐈' },
  { w: 'dog', x: 3.5, y: 3.2, e: '🐶' },
  { w: 'puppy', x: 2.2, y: 3.4, e: '🐕' },
  { w: 'car', x: -1, y: 4.2, e: '🚗' },
  { w: 'truck', x: -1.6, y: 3.8, e: '🚚' },
  { w: 'banana', x: 1.7, y: -3.2, e: '🍌' },
  { w: 'apple', x: 2.6, y: -2.6, e: '🍎' },
]

function EmbeddingMap({ words = WORDS, pick = ['cat', 'kitten'] }) {
  const [sel, setSel] = useState(pick)
  const ws = useMemo(() => Object.fromEntries(words.map((w) => [w.w, w])), [words])
  const [p, q] = sel.map((s) => ws[s])
  const dot = p && q ? p.x * q.x + p.y * q.y : 0
  const lp = p ? Math.hypot(p.x, p.y) : 1, lq = q ? Math.hypot(q.x, q.y) : 1
  const cos = p && q ? dot / (lp * lq) : 0
  const angle = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI
  const verdict = cos > 0.9 ? 'very similar meaning' : cos > 0.5 ? 'somewhat related' : cos > -0.3 ? 'not related' : 'opposite-ish'
  const tap = (w) => setSel((s) => (s.includes(w) ? s : [s[1], w]))
  return (
    <VisualCard title="Words as arrows (a tiny embedding map)" hint="Tap two words. The narrower the angle between their arrows, the more similar their meanings." footer="Real AI uses arrows with hundreds of numbers, not 2, but the idea is the same: **similar meaning = similar direction**.">
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        <Plane xmin={-5} xmax={5} ymin={-4} ymax={5} unit={32} labels={false} xLabel="" yLabel="" ariaLabel={`${sel[0]} and ${sel[1]}: cosine similarity ${fmt(cos)}`}>
          {words.map((w) => {
            const on = sel.includes(w.w)
            return on ? null : <Arrow key={w.w} x2={w.x} y2={w.y} color={C.muted} width={1.5} opacity={0.35} />
          })}
          {p && <Arrow x2={p.x} y2={p.y} color={C.accent} width={4} />}
          {q && <Arrow x2={q.x} y2={q.y} color={C.violet} width={4} />}
          {words.map((w) => (
            <WordDot key={w.w} w={w} on={sel.includes(w.w)} color={w.w === sel[0] ? C.accent : C.violet} onTap={() => tap(w.w)} />
          ))}
        </Plane>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {words.map((w) => (
              <button key={w.w} onClick={() => tap(w.w)} className={`chip border ${sel.includes(w.w) ? 'border-brand-500 bg-brand-100 dark:bg-brand-900/40' : 'border-[color:var(--line)]'}`}>{w.e} {w.w}</button>
            ))}
          </div>
          <div className="rounded-xl bg-[color:var(--card)] p-3 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{sel[0]} vs {sel[1]}</p>
            <p className="font-mono text-3xl font-black">{fmt(cos)}</p>
            <p className="text-sm">angle ≈ {fmt(angle, 0)}° · <strong>{verdict}</strong></p>
          </div>
          {cos < -0.3 && <p className="muted text-xs">On a flat map with only 2 numbers there isn't room for every word to have its own direction, so some unrelated words end up pointing apart. Real embeddings have hundreds of directions to spread out in!</p>}
        </div>
      </div>
    </VisualCard>
  )
}

function WordDot({ w, on, color, onTap }) {
  const { sx, sy } = usePlane()
  return (
    <g onPointerDown={(e) => { e.stopPropagation(); onTap() }} style={{ cursor: 'pointer' }} role="button" aria-label={w.w}>
      <circle cx={sx(w.x)} cy={sy(w.y)} r={16} fill="transparent" />
      <text x={sx(w.x)} y={sy(w.y) + 6} fontSize={on ? 20 : 16} textAnchor="middle">{w.e}</text>
      <text x={sx(w.x)} y={sy(w.y) + 22} fontSize={11} fontWeight={on ? 900 : 600} textAnchor="middle" style={{ fill: on ? color : C.muted }}>{w.w}</text>
    </g>
  )
}

export default {
  coordGrid: CoordGrid,
  vectorArrow: VectorArrow,
  vectorAdd: VectorAdd,
  vectorScale: VectorScale,
  vectorLength: VectorLength,
  dotSteps: DotSteps,
  matrixGrid: MatrixGrid,
  matmulSteps: MatmulSteps,
  transposeFlip: TransposeFlip,
  glueVsAdd: GlueVsAdd,
  embeddingMap: EmbeddingMap,
}
