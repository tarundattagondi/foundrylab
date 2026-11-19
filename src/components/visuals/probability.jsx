// Interactive visuals for the Probability & Stats module. Export a map of { name: Component }.
// Each component receives the block's props (see ./index.jsx).
import { useEffect, useMemo, useRef, useState } from 'react'
import { VisualCard, Slider, Stepper, Goal, fmt, C } from './kit'

const pct = (p, d = 1) => `${fmt(p * 100, d)}%`
const RED = '#ef4444'
const BLUE = '#3b82f6'
const DICE = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

function Btn({ children, onClick, active, disabled, title }) {
  return (
    <button type="button" title={title} className={`${active ? 'btn-primary' : 'btn-ghost'} px-3 py-1.5`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

/** Convert a pointer event to the SVG's own x coordinate. */
function svgPoint(svg, e) {
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  return pt.matrixTransform(svg.getScreenCTM().inverse())
}

/** Nearest kid-friendly fraction (bottom number 1-10) for display, like "about 1/3". */
function nearFraction(p) {
  let best = [0, 1]
  let err = Infinity
  for (const d of [1, 2, 3, 4, 5, 6, 8, 10]) {
    const n = Math.round(p * d)
    const e = Math.abs(p - n / d)
    if (e < err - 1e-9) (err = e), (best = [n, d])
  }
  return `${err < 0.005 ? '' : 'about '}${best[0]}/${best[1]}`
}

function gauss(mu, sigma) {
  let u = 0
  while (u === 0) u = Math.random()
  const v = Math.random()
  return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

// ── 1. The 0-to-1 chance line ───────────────────────────────────────────────

const CHANCE_EVENTS = [
  { emoji: '🎲', label: 'Roll a 7 on one normal dice', p: 0, why: 'A dice only has 1 to 6. A 7 can never happen.' },
  { emoji: '♥️', label: 'Pick a heart from a deck of cards', p: 0.25, why: '13 hearts out of 52 cards = 1/4.' },
  { emoji: '🪙', label: 'A coin lands on heads', p: 0.5, why: '1 good side out of 2 sides = 1/2.' },
  { emoji: '🎯', label: 'Roll 1, 2, 3, 4 or 5 on a dice', p: 5 / 6, why: '5 good faces out of 6 = 5/6.' },
  { emoji: '🌅', label: 'Tomorrow comes after today', p: 1, why: 'This always happens. It is certain.' },
]

function chanceWord(p) {
  if (p <= 0.001) return 'Impossible'
  if (p < 0.2) return 'Very unlikely'
  if (p < 0.45) return 'Unlikely'
  if (p <= 0.55) return 'Even chance'
  if (p < 0.8) return 'Likely'
  if (p < 0.999) return 'Very likely'
  return 'Certain'
}

function ChanceLine({ events = CHANCE_EVENTS }) {
  const [guess, setGuess] = useState(0.5)
  const [sel, setSel] = useState(0)
  const [shown, setShown] = useState({})
  const [drag, setDrag] = useState(false)
  const svg = useRef(null)
  const X0 = 24, X1 = 336, Y = 70
  const sx = (p) => X0 + p * (X1 - X0)
  const move = (e) => {
    const x = svgPoint(svg.current, e).x
    setGuess(Math.round(Math.max(0, Math.min(1, (x - X0) / (X1 - X0))) * 100) / 100)
  }
  const ev = events[sel]
  const revealed = shown[sel] !== undefined
  const off = Math.abs(shown[sel] - ev.p)
  const allDone = events.every((_, i) => shown[i] !== undefined)

  return (
    <VisualCard
      title="The chance line: from impossible to certain"
      hint="Pick an event, **drag the orange marker** to where you think it belongs, then press **Check my guess**."
      footer="Every probability lives somewhere on this line. **0** means impossible, **1** means certain, and **0.5** is right in the middle."
    >
      <div className="flex flex-wrap gap-2">
        {events.map((e, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-xl border-2 px-2.5 py-1.5 text-left text-xs font-bold transition ${i === sel ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-[color:var(--line)] bg-[color:var(--card)]'}`}
          >
            {e.emoji} {e.label} {shown[i] !== undefined && '✓'}
          </button>
        ))}
      </div>
      <svg
        ref={svg}
        viewBox="0 0 360 120"
        className="touch-none mx-auto block h-auto w-full max-w-[520px] select-none"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); move(e) }}
        onPointerMove={(e) => drag && move(e)}
        onPointerUp={() => setDrag(false)}
        onPointerCancel={() => setDrag(false)}
        role="slider"
        aria-label={`Your guess: ${guess}`}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={guess}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') setGuess((g) => Math.min(1, Math.round((g + 0.05) * 100) / 100))
          if (e.key === 'ArrowLeft') setGuess((g) => Math.max(0, Math.round((g - 0.05) * 100) / 100))
        }}
      >
        <defs>
          <linearGradient id="chanceGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <rect x={X0} y={Y - 6} width={X1 - X0} height={12} rx={6} fill="url(#chanceGrad)" />
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={sx(t)} x2={sx(t)} y1={Y + 8} y2={Y + 14} style={{ stroke: C.muted }} strokeWidth={1.5} />
            <text x={sx(t)} y={Y + 27} fontSize={11} fontWeight={700} textAnchor="middle" style={{ fill: C.muted }}>{t}</text>
          </g>
        ))}
        <text x={X0} y={Y + 44} fontSize={10} style={{ fill: C.muted }}>impossible</text>
        <text x={X1} y={Y + 44} fontSize={10} textAnchor="end" style={{ fill: C.muted }}>certain</text>
        {Object.entries(shown).map(([i]) => (
          <text key={i} x={sx(events[i].p)} y={Y + 5} fontSize={16} textAnchor="middle">{events[i].emoji}</text>
        ))}
        <g style={{ cursor: 'grab' }}>
          <line x1={sx(guess)} x2={sx(guess)} y1={22} y2={Y - 8} style={{ stroke: C.accent }} strokeWidth={3} />
          <circle cx={sx(guess)} cy={18} r={11} style={{ fill: C.accent }} />
          <text x={sx(guess)} y={22} fontSize={10} fontWeight={800} textAnchor="middle" fill="#fff">?</text>
        </g>
      </svg>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[['Decimal', fmt(guess)], ['Fraction', nearFraction(guess)], ['Percent', pct(guess, 0)]].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-[color:var(--card)] p-2">
            <p className="muted text-[10px] font-extrabold uppercase">{k}</p>
            <p className="font-mono text-sm font-bold">{v}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-bold">Your marker says: <span className="text-brand-600 dark:text-brand-300">{chanceWord(guess)}</span></p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn-primary" onClick={() => setShown((s) => ({ ...s, [sel]: guess }))}>Check my guess</button>
        {revealed && (
          <span className="text-sm font-semibold">
            {ev.emoji} Real answer: <strong>{fmt(ev.p)}</strong> ({chanceWord(ev.p)}). {ev.why} {off <= 0.1 ? '🎉 Spot on!' : off <= 0.25 ? '👍 Close!' : '🤔 Not quite, but now you know!'}
          </span>
        )}
      </div>
      {allDone && <Goal done>You placed every event on the chance line!</Goal>}
    </VisualCard>
  )
}

// ── 2. Pick the faces you want: wanted ÷ total ──────────────────────────────

function DiceChance({ start = [6] }) {
  const [want, setWant] = useState(new Set(start))
  const toggle = (f) => setWant((w) => { const n = new Set(w); n.has(f) ? n.delete(f) : n.add(f); return n })
  const k = want.size
  const p = k / 6
  const presets = [['a 6', [6]], ['an even number', [2, 4, 6]], ['bigger than 4', [5, 6]], ['anything', [1, 2, 3, 4, 5, 6]], ['nothing', []]]
  const R = 60, cx = 70, cy = 70
  const slice = (i) => {
    const a0 = (i / 6) * 2 * Math.PI - Math.PI / 2
    const a1 = ((i + 1) / 6) * 2 * Math.PI - Math.PI / 2
    return `M${cx},${cy} L${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 0 1 ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} Z`
  }
  return (
    <VisualCard
      title="Counting chances with a dice"
      hint="**Tap the faces** you want to roll. The chance updates as you go."
      footer="The recipe never changes: **ways you want ÷ all the ways**. A dice has 6 faces, so the bottom number is always 6."
    >
      <div className="flex flex-wrap justify-center gap-2">
        {DICE.map((d, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i + 1)}
            aria-pressed={want.has(i + 1)}
            className={`grid h-14 w-14 place-items-center rounded-xl border-2 text-4xl leading-none transition ${want.has(i + 1) ? 'scale-105 border-brand-500 bg-brand-100 dark:bg-brand-900/40' : 'border-[color:var(--line)] bg-[color:var(--card)] opacity-60'}`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 text-xs">
        {presets.map(([label, faces]) => (
          <button key={label} type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => setWant(new Set(faces))}>Chance of {label}</button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 140 140" className="h-32 w-32 select-none" aria-hidden>
          {DICE.map((_, i) => (
            <path key={i} d={slice(i)} style={{ fill: want.has(i + 1) ? C.accent : C.line, stroke: C.card }} strokeWidth={2} />
          ))}
        </svg>
        <div className="space-y-1 text-[15px]">
          <p>Faces I want: <strong>{k}</strong> {k ? `(${[...want].sort().join(', ')})` : ''}</p>
          <p>All the faces: <strong>6</strong></p>
          <p className="font-mono text-base font-bold">{k} ÷ 6 = {fmt(p)} = {pct(p, 0)}</p>
          <p className="text-sm font-bold text-brand-600 dark:text-brand-300">{chanceWord(p)}</p>
        </div>
      </div>
    </VisualCard>
  )
}

// ── 3. Coin flipper: the law of large numbers ───────────────────────────────

function CoinFlipper() {
  const [flips, setFlips] = useState([])
  const [spin, setSpin] = useState(0)
  const MAX = 20000
  const flip = (n) => {
    setFlips((f) => [...f, ...Array.from({ length: n }, () => (Math.random() < 0.5 ? 1 : 0))].slice(-MAX))
    setSpin((s) => s + 1)
  }
  const N = flips.length
  const heads = useMemo(() => flips.reduce((a, b) => a + b, 0), [flips])
  const frac = N ? heads / N : 0
  const last = flips[N - 1]

  const W = 340, H = 140, L = 34, R = 10, T = 10, B = 26
  const path = useMemo(() => {
    if (!N) return ''
    const maxX = Math.max(10, N)
    const lx = (i) => L + (Math.log10(i) / Math.log10(maxX)) * (W - L - R)
    const ly = (f) => T + (1 - f) * (H - T - B)
    const idx = new Set([1])
    for (let k = 0; k <= 200; k++) idx.add(Math.max(1, Math.round(Math.pow(maxX, k / 200))))
    let run = 0
    let d = ''
    const want = [...idx].filter((i) => i <= N).sort((a, b) => a - b)
    let w = 0
    for (let i = 1; i <= N && w < want.length; i++) {
      run += flips[i - 1]
      if (i === want[w]) {
        d += `${w ? 'L' : 'M'}${lx(i).toFixed(1)},${ly(run / i).toFixed(1)} `
        w++
      }
    }
    return d
  }, [flips, N])

  const msg = !N
    ? 'Press a button to flip!'
    : N < 20
      ? 'With only a few flips, the percentage jumps around a lot. That is randomness!'
      : N < 1000
        ? 'More flips… see the line calming down?'
        : 'Thousands of flips: the line hugs 50%. That is the law of large numbers!'

  return (
    <VisualCard
      title="Flip a coin, again and again"
      hint="Flip **1**, **10** or **100** coins at a time and watch the line."
      footer="Each flip is a surprise, but **lots** of flips together land close to the true chance, 50%."
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-4 border-amber-500 bg-amber-300 text-2xl font-black text-amber-900 shadow-md"
          style={{ transform: `rotateY(${spin * 360}deg)`, transition: 'transform .6s ease-out' }}
          aria-label={last === undefined ? 'coin' : last ? 'heads' : 'tails'}
        >
          {last === undefined ? '🪙' : last ? 'H' : 'T'}
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={() => flip(1)}>Flip 1</Btn>
          <Btn onClick={() => flip(10)}>Flip 10</Btn>
          <Btn onClick={() => flip(100)} active>Flip 100</Btn>
          <Btn onClick={() => flip(1000)}>Flip 1,000</Btn>
          <Btn onClick={() => { setFlips([]); setSpin(0) }} disabled={!N}>↺ Reset</Btn>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-[color:var(--card)] p-2"><p className="muted text-[10px] font-extrabold uppercase">Heads</p><p className="font-mono font-bold">{heads}</p></div>
        <div className="rounded-xl bg-[color:var(--card)] p-2"><p className="muted text-[10px] font-extrabold uppercase">Tails</p><p className="font-mono font-bold">{N - heads}</p></div>
        <div className="rounded-xl bg-[color:var(--card)] p-2"><p className="muted text-[10px] font-extrabold uppercase">% heads</p><p className="font-mono font-bold">{N ? pct(frac) : '–'}</p></div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full select-none max-w-[520px] rounded-xl" style={{ background: C.card }} role="img" aria-label={`Percent of heads after ${N} flips: ${pct(frac)}`}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={L} x2={W - R} y1={T + (1 - f) * (H - T - B)} y2={T + (1 - f) * (H - T - B)} style={{ stroke: f === 0.5 ? C.good : C.grid }} strokeWidth={f === 0.5 ? 2 : 1} strokeDasharray={f === 0.5 ? '6 4' : undefined} />
            <text x={L - 5} y={T + (1 - f) * (H - T - B) + 4} fontSize={10} textAnchor="end" style={{ fill: C.muted }}>{f * 100}%</text>
          </g>
        ))}
        <path d={path} fill="none" style={{ stroke: C.accent }} strokeWidth={2.5} strokeLinejoin="round" />
        <text x={L} y={H - 6} fontSize={10} style={{ fill: C.muted }}>1 flip</text>
        <text x={W - R} y={H - 6} fontSize={10} textAnchor="end" style={{ fill: C.muted }}>{Math.max(10, N).toLocaleString()} flips</text>
      </svg>
      <p className="text-sm font-semibold">{msg}</p>
    </VisualCard>
  )
}

// ── 4. Dice roller with a histogram ─────────────────────────────────────────

const WAYS = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]

function DiceRoller({ dice = 1, allowToggle = true }) {
  const [n, setN] = useState(dice)
  const [rolls, setRolls] = useState([])
  const [last, setLast] = useState([])
  const lo = n, hi = 6 * n
  const totals = []
  for (let t = lo; t <= hi; t++) totals.push(t)
  const counts = useMemo(() => {
    const c = Object.fromEntries(totals.map((t) => [t, 0]))
    rolls.forEach((r) => (c[r] = (c[r] || 0) + 1))
    return c
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolls, n])
  const roll = (k) => {
    let faces = []
    const add = []
    for (let i = 0; i < k; i++) {
      faces = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 6))
      add.push(faces.reduce((a, b) => a + b, 0))
    }
    setLast(faces)
    setRolls((r) => [...r, ...add].slice(-50000))
  }
  const N = rolls.length
  const expected = (t) => (n === 1 ? N / 6 : (N * WAYS[t - 2]) / 36)
  const top = Math.max(1, ...totals.map((t) => Math.max(counts[t], expected(t))))
  const maxT = totals.reduce((a, t) => (counts[t] > counts[a] ? t : a), totals[0])

  return (
    <VisualCard
      title={n === 1 ? 'Roll a dice, watch the bars' : 'Roll two dice and add them'}
      hint="Press **Roll** to roll once, or roll lots at once. Each bar counts how often that result happened."
      footer={
        n === 1
          ? 'With one dice every face is equally likely, so after lots of rolls the bars come out **flat**.'
          : 'Two dice make a **hill**: 7 can be made 6 different ways, but 2 and 12 only 1 way each. The dashed lines show what the bars should grow toward.'
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 text-5xl leading-none" aria-live="polite">{(last.length ? last : Array(n).fill(0)).map((f, i) => <span key={i + '-' + N} className="animate-pop">{f ? DICE[f - 1] : '🎲'}</span>)}</div>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={() => roll(1)} active>Roll</Btn>
          <Btn onClick={() => roll(10)}>Roll 10</Btn>
          <Btn onClick={() => roll(100)}>Roll 100</Btn>
          <Btn onClick={() => roll(1000)}>Roll 1,000</Btn>
          <Btn onClick={() => { setRolls([]); setLast([]) }} disabled={!N}>↺</Btn>
        </div>
      </div>
      {allowToggle && (
        <div className="flex gap-2 text-sm">
          <Btn active={n === 1} onClick={() => { setN(1); setRolls([]); setLast([]) }}>1 dice</Btn>
          <Btn active={n === 2} onClick={() => { setN(2); setRolls([]); setLast([]) }}>2 dice (add them)</Btn>
        </div>
      )}
      <div className="rounded-xl bg-[color:var(--card)] p-2">
        <div className="flex h-40 items-end gap-[3px]">
          {totals.map((t) => (
            <div key={t} className="relative flex h-full min-w-0 flex-1 flex-col justify-end">
              <span className="mb-0.5 text-center font-mono text-[9px] font-bold sm:text-[10px]">{counts[t] || ''}</span>
              <div className={`rounded-t-md transition-all duration-300 ${t === maxT && N ? 'bg-brand-500' : 'bg-brand-300 dark:bg-brand-700'}`} style={{ height: `${(counts[t] / top) * 100}%` }} />
              {N > 0 && <div className="absolute inset-x-0 border-t-2 border-dashed border-emerald-500" style={{ bottom: `${(expected(t) / top) * 100}%` }} />}
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-[3px]">
          {totals.map((t) => <span key={t} className="min-w-0 flex-1 text-center font-mono text-[10px] font-bold">{t}</span>)}
        </div>
        {n === 2 && (
          <div className="mt-0.5 flex gap-[3px]">
            {totals.map((t) => <span key={t} className="muted min-w-0 flex-1 text-center font-mono text-[9px]">{WAYS[t - 2]}w</span>)}
          </div>
        )}
      </div>
      <p className="text-sm font-semibold">
        {N ? `${N.toLocaleString()} rolls so far. The tallest bar is ${maxT}.` : 'No rolls yet. Roll the dice!'} {n === 2 && <span className="muted">(“w” = how many ways to make that total)</span>}
      </p>
    </VisualCard>
  )
}

// ── 5. Marble bag: probability and "given that…" ────────────────────────────

const DEFAULT_MARBLES = [
  ...Array(3).fill({ size: 'big', color: 'red' }),
  { size: 'big', color: 'blue' },
  ...Array(2).fill({ size: 'small', color: 'red' }),
  ...Array(4).fill({ size: 'small', color: 'blue' }),
]

function MarbleBag({ marbles = DEFAULT_MARBLES, startGiven = 'all' }) {
  const [given, setGiven] = useState(startGiven)
  const [target, setTarget] = useState('red')
  const [picked, setPicked] = useState(null)
  const [draws, setDraws] = useState({ hit: 0, all: 0 })
  const order = useMemo(() => {
    const idx = marbles.map((_, i) => i)
    // A fixed shuffle so the bag looks mixed but never jumps around.
    return idx.sort((a, b) => ((a * 7 + 3) % marbles.length) - ((b * 7 + 3) % marbles.length))
  }, [marbles])
  const inGroup = (m) => given === 'all' || m.size === given
  const group = marbles.filter(inGroup)
  const hits = group.filter((m) => m.color === target)
  const p = group.length ? hits.length / group.length : 0
  const pos = order.map((mi, k) => ({ mi, x: 52 + (k % 5) * 58, y: 66 + Math.floor(k / 5) * 52 }))

  const draw = () => {
    const choices = marbles.map((m, i) => i).filter((i) => inGroup(marbles[i]))
    const i = choices[Math.floor(Math.random() * choices.length)]
    setPicked(i)
    setDraws((d) => ({ hit: d.hit + (marbles[i].color === target ? 1 : 0), all: d.all + 1 }))
  }
  const reset = (fn) => { fn(); setPicked(null); setDraws({ hit: 0, all: 0 }) }
  const label = given === 'all' ? `P(${target})` : `P(${target} | ${given})`

  return (
    <VisualCard
      title="The marble bag"
      hint="Choose a **clue**, then a **colour**. Marbles that don't fit the clue fade away. Press **Grab a marble** to test it!"
      footer="The trick for **given that…**: first shrink the group to only the marbles that match the clue, then count inside that smaller group."
    >
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="self-center font-bold">Clue:</span>
        {[['all', 'No clue'], ['big', 'It is BIG'], ['small', 'It is small']].map(([v, l]) => (
          <Btn key={v} active={given === v} onClick={() => reset(() => setGiven(v))}>{l}</Btn>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="self-center font-bold">I want:</span>
        <Btn active={target === 'red'} onClick={() => reset(() => setTarget('red'))}>🔴 red</Btn>
        <Btn active={target === 'blue'} onClick={() => reset(() => setTarget('blue'))}>🔵 blue</Btn>
      </div>
      <svg viewBox="0 0 340 190" className="mx-auto block h-auto w-full select-none max-w-[460px]" role="img" aria-label={`${label} = ${hits.length} out of ${group.length}`}>
        <path d="M30,30 Q20,20 40,18 L300,18 Q320,20 310,30 L322,160 Q324,182 300,182 L40,182 Q16,182 18,160 Z" style={{ fill: C.card, stroke: C.muted }} strokeWidth={2.5} />
        <text x={170} y={14} fontSize={11} textAnchor="middle" style={{ fill: C.muted }}>the bag</text>
        {pos.map(({ mi, x, y }) => {
          const m = marbles[mi]
          const on = inGroup(m)
          const r = m.size === 'big' ? 19 : 12
          return (
            <g key={mi} opacity={on ? 1 : 0.15}>
              <circle cx={x} cy={y} r={r} fill={m.color === 'red' ? RED : BLUE} stroke={on && m.color === target ? '#facc15' : 'transparent'} strokeWidth={4} />
              <circle cx={x - r / 3} cy={y - r / 3} r={r / 4} fill="#fff" opacity={0.5} />
              {picked === mi && <circle cx={x} cy={y} r={r + 7} fill="none" style={{ stroke: C.accent }} strokeWidth={3} strokeDasharray="5 3"><animate attributeName="r" values={`${r + 4};${r + 10};${r + 4}`} dur="0.8s" repeatCount="2" /></circle>}
            </g>
          )
        })}
      </svg>
      <div className="rounded-xl bg-[color:var(--card)] p-3 text-[15px]">
        <p>Marbles in the group{given !== 'all' ? ` (only ${given} ones)` : ''}: <strong>{group.length}</strong></p>
        <p>Of those, {target}: <strong>{hits.length}</strong></p>
        <p className="mt-1 font-mono text-base font-bold">{label} = {hits.length} ÷ {group.length} = {fmt(p)} ({pct(p, 0)})</p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p * 100}%`, background: target === 'red' ? RED : BLUE }} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn-primary" onClick={draw}>🤚 Grab a marble</button>
        {picked !== null && (
          <span className="text-sm font-semibold">
            You grabbed a {marbles[picked].size} {marbles[picked].color === 'red' ? '🔴 red' : '🔵 blue'} marble! So far {draws.hit} of {draws.all} grabs were {target} ({pct(draws.hit / draws.all, 0)}).
          </span>
        )}
      </div>
    </VisualCard>
  )
}

// ── 6. Next-word predictor (bigrams) ────────────────────────────────────────

const STORY = 'the cat sat on the mat. the cat ran to the dog. the dog sat on the mat. the cat sat down.'

function NextWord({ text = STORY, start = 'the' }) {
  const { counts, vocab } = useMemo(() => {
    const toks = text.toLowerCase().match(/[a-z']+|\./g) || []
    const c = {}
    for (let i = 0; i < toks.length - 1; i++) {
      if (toks[i] === '.') continue
      c[toks[i]] ||= {}
      c[toks[i]][toks[i + 1]] = (c[toks[i]][toks[i + 1]] || 0) + 1
    }
    return { counts: c, vocab: Object.keys(c) }
  }, [text])
  const [word, setWord] = useState(vocab.includes(start) ? start : vocab[0])
  const [sentence, setSentence] = useState([])
  const [writing, setWriting] = useState(null) // 'random' | 'best' | null
  const followers = Object.entries(counts[word] || {}).sort((a, b) => b[1] - a[1])
  const total = followers.reduce((a, [, n]) => a + n, 0)

  useEffect(() => {
    if (!writing) return
    const lastW = sentence[sentence.length - 1]?.word
    if (lastW === '.' || sentence.length >= 10 || (lastW && !counts[lastW])) return setWriting(null)
    const t = setTimeout(() => {
      const from = lastW || start
      if (!sentence.length) return setSentence([{ word: from, p: null }])
      const f = Object.entries(counts[from] || {})
      const tot = f.reduce((a, [, n]) => a + n, 0)
      let pick = f[0]
      if (writing === 'best') pick = f.reduce((a, b) => (b[1] > a[1] ? b : a))
      else {
        let r = Math.random() * tot
        for (const e of f) { r -= e[1]; if (r <= 0) { pick = e; break } }
      }
      setWord(from)
      setSentence((s) => [...s, { word: pick[0], p: pick[1] / tot, from }])
    }, 800)
    return () => clearTimeout(t)
  }, [writing, sentence, counts, start])

  return (
    <VisualCard
      title="Autocomplete brain: what comes next?"
      hint="**Tap a word** to see which words followed it in the story. Then let the computer **write a sentence** one word at a time."
      footer="Each choice is a **conditional probability**: the chance of the next word, **given** the word before it. That's next-word prediction!"
    >
      <p className="rounded-xl bg-[color:var(--card)] p-2 font-mono text-[13px] leading-relaxed">📖 {text}</p>
      <div className="flex flex-wrap gap-1.5">
        {vocab.map((v) => (
          <button key={v} type="button" onClick={() => setWord(v)} className={`rounded-lg border-2 px-2 py-0.5 font-mono text-sm font-bold ${v === word ? 'border-brand-500 bg-brand-100 dark:bg-brand-900/40' : 'border-[color:var(--line)] bg-[color:var(--card)]'}`}>{v}</button>
        ))}
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-bold">After “{word}” the story had {total} next words:</p>
        {followers.map(([w, n]) => (
          <div key={w} className="grid grid-cols-[4.5rem_minmax(0,1fr)_6.5rem] items-center gap-2 text-sm">
            <span className="truncate text-right font-mono font-bold">{w === '.' ? '(end)' : w}</span>
            <div className="h-5 overflow-hidden rounded-md bg-ink-100 dark:bg-ink-800"><div className="h-full rounded-md bg-brand-500 transition-all" style={{ width: `${(n / total) * 100}%` }} /></div>
            <span className="font-mono text-xs">{n}/{total} = {pct(n / total, 0)}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" disabled={!!writing} onClick={() => { setSentence([]); setWriting('random') }}>✍️ Write a sentence (spin)</button>
        <button type="button" className="btn-ghost" disabled={!!writing} onClick={() => { setSentence([]); setWriting('best') }}>Always pick the favourite</button>
      </div>
      {sentence.length > 0 && (
        <div className="flex flex-wrap items-end gap-1.5" aria-live="polite">
          {sentence.map((s, i) => (
            <span key={i} className="animate-pop flex flex-col items-center">
              <span className="rounded-lg bg-violet-100 px-2 py-1 font-mono text-sm font-bold dark:bg-violet-900/40">{s.word === '.' ? '.' : s.word}</span>
              <span className="muted font-mono text-[10px]">{s.p === null ? 'start' : pct(s.p, 0)}</span>
            </span>
          ))}
        </div>
      )}
    </VisualCard>
  )
}

// ── 7. Histogram builder → bell curve ───────────────────────────────────────

function HistogramBuilder({ mean: m0 = 50, spread: s0 = 10 }) {
  const [mu, setMu] = useState(m0)
  const [sigma, setSigma] = useState(s0)
  const [samples, setSamples] = useState([])
  const [lastS, setLastS] = useState(null)
  const BW = 5
  const bins = Array.from({ length: 20 }, (_, i) => i * BW)
  const counts = useMemo(() => {
    const c = Array(20).fill(0)
    samples.forEach((v) => (c[Math.min(19, Math.max(0, Math.floor(v / BW)))] += 1))
    return c
  }, [samples])
  const add = (k) => {
    const s = Array.from({ length: k }, () => Math.max(0, Math.min(99.9, gauss(mu, sigma))))
    setLastS(s[s.length - 1])
    setSamples((x) => [...x, ...s].slice(-20000))
  }
  const N = samples.length
  const pdf = (x) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI))
  const top = Math.max(1, ...counts, N * BW * pdf(mu))
  const W = 340, H = 170, L = 10, R = 10, T = 10, B = 22
  const bx = (v) => L + (v / 100) * (W - L - R)
  const by = (c) => H - B - (c / top) * (H - T - B)
  let curve = ''
  for (let x = 0; x <= 100; x += 1) curve += `${x ? 'L' : 'M'}${bx(x).toFixed(1)},${by(N * BW * pdf(x)).toFixed(1)} `
  const sMean = N ? samples.reduce((a, b) => a + b, 0) / N : 0
  const sStd = N ? Math.sqrt(samples.reduce((a, b) => a + (b - sMean) ** 2, 0) / N) : 0

  return (
    <VisualCard
      title="Build a histogram, find the bell"
      hint="Add random measurements (like the heights of kids). Watch the bars pile up into a **bell shape**. Change the sliders to move or stretch the bell."
      footer="Most results land near the **middle** (the mean). Very small or very big ones are rare. The orange curve is the bell the bars are growing into."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="Middle (mean `μ`)" value={mu} min={20} max={80} onChange={(v) => { setMu(v); setSamples([]); setLastS(null) }} />
        <Slider label="Spread (std `σ`)" value={sigma} min={3} max={20} onChange={(v) => { setSigma(v); setSamples([]); setLastS(null) }} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => add(1)}>+1</Btn>
        <Btn onClick={() => add(10)}>+10</Btn>
        <Btn onClick={() => add(100)} active>+100</Btn>
        <Btn onClick={() => add(1000)}>+1,000</Btn>
        <Btn onClick={() => { setSamples([]); setLastS(null) }} disabled={!N}>↺ Clear</Btn>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full select-none max-w-[520px] rounded-xl" style={{ background: C.card }} role="img" aria-label={`${N} samples`}>
        {counts.map((c, i) => (
          <rect key={i} x={bx(bins[i]) + 1} y={by(c)} width={bx(BW) - bx(0) - 2} height={H - B - by(c)} rx={2} style={{ fill: C.blue, transition: 'y .3s, height .3s' }} opacity={0.75} />
        ))}
        {N > 0 && <path d={curve} fill="none" style={{ stroke: C.accent }} strokeWidth={2.5} />}
        <line x1={bx(mu)} x2={bx(mu)} y1={T} y2={H - B} style={{ stroke: C.good }} strokeDasharray="4 3" strokeWidth={1.5} />
        {lastS !== null && <circle cx={bx(lastS)} cy={T + 6} r={5} style={{ fill: C.accent }} className="animate-pop" />}
        {[0, 20, 40, 60, 80, 100].map((v) => <text key={v} x={bx(v)} y={H - 6} fontSize={10} textAnchor="middle" style={{ fill: C.muted }}>{v}</text>)}
      </svg>
      <p className="text-sm font-semibold">
        {N ? `${N.toLocaleString()} measurements. Their mean is ${fmt(sMean, 1)} and their spread (std) is ${fmt(sStd, 1)}. Close to the sliders (${mu} and ${sigma})!` : 'No measurements yet. Press +100 to start.'}
        {lastS !== null && ` Last one: ${fmt(lastS, 1)}.`}
      </p>
    </VisualCard>
  )
}

// ── 8. Mean as a balance point, plus spread ─────────────────────────────────

function MeanBalance({ values = [2, 4, 6, 8], showSpread = false, presets }) {
  const [vals, setVals] = useState(values)
  const [spread, setSpread] = useState(showSpread)
  const [drag, setDrag] = useState(null)
  const svg = useRef(null)
  const W = 340, X0 = 20, X1 = 320, Y = 120
  const sx = (v) => X0 + (v / 10) * (X1 - X0)
  const N = vals.length
  const sum = vals.reduce((a, b) => a + b, 0)
  const mean = N ? sum / N : 0
  const dists = vals.map((v) => v - mean)
  const sq = dists.map((d) => d * d)
  const variance = N ? sq.reduce((a, b) => a + b, 0) / N : 0
  const std = Math.sqrt(variance)
  const stackY = vals.map((v, i) => vals.slice(0, i).filter((w) => w === v).length)
  const P = presets || [
    { label: 'Close together', values: [4, 5, 5, 6] },
    { label: 'Spread out', values: [1, 2, 8, 9] },
    { label: 'Sweets', values: [2, 4, 6, 8] },
  ]
  const move = (e) => {
    if (drag === null) return
    const x = svgPoint(svg.current, e).x
    const v = Math.max(0, Math.min(10, Math.round(((x - X0) / (X1 - X0)) * 10)))
    setVals((vs) => vs.map((w, i) => (i === drag ? v : w)))
  }
  const H = spread ? Y + 74 + N * 14 : 170

  return (
    <VisualCard
      title="The mean is the balance point"
      hint="**Drag the dots** left and right. The triangle always slides to the spot where the line would balance, like a seesaw."
      footer={spread ? 'The coloured lines show how far each dot is from the mean. **Variance** = the average of those distances squared. **Standard deviation** = √variance.' : 'The **mean** is the fair-share number: add everything up, then divide by how many there are.'}
    >
      <div className="flex flex-wrap gap-2">
        {P.map((p) => <Btn key={p.label} onClick={() => setVals(p.values)}>{p.label}</Btn>)}
        <Btn onClick={() => setVals((v) => (v.length < 8 ? [...v, 5] : v))} disabled={N >= 8}>+ dot</Btn>
        <Btn onClick={() => setVals((v) => v.slice(0, -1))} disabled={N <= 2}>− dot</Btn>
        <Btn active={spread} onClick={() => setSpread((s) => !s)}>{spread ? 'Hide spread' : 'Show spread'}</Btn>
      </div>
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className="touch-none mx-auto block h-auto w-full max-w-[520px] select-none rounded-xl"
        style={{ background: C.card }}
        onPointerMove={move}
        onPointerUp={() => setDrag(null)}
        onPointerCancel={() => setDrag(null)}
        role="img"
        aria-label={`Mean ${fmt(mean)}`}
      >
        <line x1={X0} x2={X1} y1={Y} y2={Y} style={{ stroke: C.ink }} strokeWidth={4} strokeLinecap="round" />
        {Array.from({ length: 11 }, (_, v) => (
          <text key={v} x={sx(v)} y={Y + 34} fontSize={11} textAnchor="middle" style={{ fill: C.muted }}>{v}</text>
        ))}
        <g style={{ transform: `translateX(${sx(mean)}px)`, transition: drag === null ? 'transform .35s ease' : 'none' }}>
          <polygon points={`0,${Y + 3} -13,${Y + 22} 13,${Y + 22}`} style={{ fill: C.good }} />
          <text x={0} y={Y + 48} fontSize={12} fontWeight={800} textAnchor="middle" style={{ fill: C.good }}>mean {fmt(mean)}</text>
        </g>
        {vals.map((v, i) => {
          const cy = Y - 14 - stackY[i] * 22
          return (
            <g key={i}>
              <circle cx={sx(v)} cy={cy} r={20} fill="transparent" style={{ cursor: 'grab' }}
                onPointerDown={(e) => { e.currentTarget.ownerSVGElement.setPointerCapture(e.pointerId); setDrag(i) }} />
              <circle cx={sx(v)} cy={cy} r={10} style={{ fill: C.accent, stroke: C.card, pointerEvents: 'none' }} strokeWidth={2.5} />
              <text x={sx(v)} y={cy + 4} fontSize={10} fontWeight={800} textAnchor="middle" fill="#fff" style={{ pointerEvents: 'none' }}>{v}</text>
            </g>
          )
        })}
        {spread && dists.map((d, i) => {
          const y = Y + 66 + i * 14
          return (
            <g key={i}>
              <line x1={sx(mean)} x2={sx(vals[i])} y1={y} y2={y} style={{ stroke: d < 0 ? C.blue : C.violet }} strokeWidth={3} strokeLinecap="round" />
              <circle cx={sx(vals[i])} cy={y} r={3.5} style={{ fill: C.accent }} />
              <text x={Math.max(sx(mean), sx(vals[i])) + 6} y={y + 4} fontSize={10} style={{ fill: C.muted }}>{d >= 0 ? '+' : ''}{fmt(d)}</text>
            </g>
          )
        })}
        {spread && <line x1={sx(mean)} x2={sx(mean)} y1={Y + 56} y2={Y + 70 + N * 14} style={{ stroke: C.good }} strokeDasharray="3 3" />}
      </svg>
      <div className="space-y-1 rounded-xl bg-[color:var(--card)] p-3 font-mono text-[13px]">
        <p>add up: {vals.join(' + ')} = <strong>{sum}</strong></p>
        <p>share: {sum} ÷ {N} = <strong className="text-emerald-600 dark:text-emerald-400">mean {fmt(mean)}</strong></p>
        {spread && (
          <>
            <p>distances: {dists.map((d) => fmt(d)).join(', ')}</p>
            <p>squared: {sq.map((d) => fmt(d)).join(', ')}</p>
            <p>variance: ({sq.map((d) => fmt(d)).join(' + ')}) ÷ {N} = <strong>{fmt(variance)}</strong></p>
            <p>std: √{fmt(variance)} = <strong className="text-violet-600 dark:text-violet-400">{fmt(std)}</strong></p>
          </>
        )}
      </div>
    </VisualCard>
  )
}

// ── 9. Normalization: squash numbers onto the same scale ────────────────────

const FRUITS = [
  { emoji: '🍒', name: 'cherry', weight: 8, sweet: 9 },
  { emoji: '🍎', name: 'apple', weight: 150, sweet: 6 },
  { emoji: '🍍', name: 'pineapple', weight: 1500, sweet: 7 },
  { emoji: '🍉', name: 'watermelon', weight: 5000, sweet: 8 },
]

function NormalizeSquash({ items = FRUITS }) {
  const [mode, setMode] = useState('raw')
  const scale = (key) => {
    const xs = items.map((it) => it[key])
    const lo = Math.min(...xs), hi = Math.max(...xs)
    const m = xs.reduce((a, b) => a + b, 0) / xs.length
    const s = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length) || 1
    return xs.map((x) => (mode === 'raw' ? x : mode === 'minmax' ? (x - lo) / (hi - lo || 1) : (x - m) / s))
  }
  const rows = [
    { key: 'weight', label: 'Weight (grams)', vals: scale('weight') },
    { key: 'sweet', label: 'Sweetness (1 to 10)', vals: scale('sweet') },
  ]
  const dom = mode === 'raw' ? [0, 5000] : mode === 'minmax' ? [0, 1] : [-2, 2]
  const ticks = mode === 'raw' ? [0, 1000, 2000, 3000, 4000, 5000] : mode === 'minmax' ? [0, 0.25, 0.5, 0.75, 1] : [-2, -1, 0, 1, 2]
  const W = 340, X0 = 22, X1 = 318
  const sx = (v) => X0 + ((v - dom[0]) / (dom[1] - dom[0])) * (X1 - X0)
  const explain = {
    raw: 'On one shared ruler, the weights stretch all the way to 5000 but the sweetness numbers are all squashed near 0. Sweetness looks unimportant, just because its numbers are small!',
    minmax: 'Min-max: smallest → 0, biggest → 1, everything else in between. Now both rows use the same 0-to-1 ruler and are easy to compare.',
    z: 'Z-score: the average goes to 0, and each number shows how many standard deviations above (+) or below (−) average it is.',
  }[mode]

  return (
    <VisualCard
      title="Apples and watermelons on one ruler"
      hint="Switch between **Original**, **Min-max** and **Z-score** and watch the fruit slide."
      footer="Normalizing doesn't change the **order** of the fruit. It just puts every row on the same scale so no number shouts louder than another."
    >
      <div className="flex flex-wrap gap-2">
        <Btn active={mode === 'raw'} onClick={() => setMode('raw')}>Original</Btn>
        <Btn active={mode === 'minmax'} onClick={() => setMode('minmax')}>Min-max (0 to 1)</Btn>
        <Btn active={mode === 'z'} onClick={() => setMode('z')}>Z-score (centre 0)</Btn>
      </div>
      <svg viewBox={`0 0 ${W} 190`} className="mx-auto block h-auto w-full select-none max-w-[520px] rounded-xl" style={{ background: C.card }} role="img" aria-label={`Fruit numbers, ${mode} mode`}>
        {rows.map((r, ri) => {
          const y = 52 + ri * 80
          return (
            <g key={r.key}>
              <text x={X0} y={y - 28} fontSize={11} fontWeight={800} style={{ fill: C.ink }}>{r.label}</text>
              <line x1={X0} x2={X1} y1={y} y2={y} style={{ stroke: C.muted }} strokeWidth={2} />
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={sx(t)} x2={sx(t)} y1={y - 4} y2={y + 4} style={{ stroke: C.muted }} />
                  <text x={sx(t)} y={y + 17} fontSize={9} textAnchor="middle" style={{ fill: C.muted }}>{t}</text>
                </g>
              ))}
              {items.map((it, i) => (
                <g key={it.name} style={{ transform: `translate(${sx(r.vals[i])}px, ${y - 12 - (i % 2) * 2}px)`, transition: 'transform .9s cubic-bezier(.2,.8,.2,1)' }}>
                  <text x={0} y={0} fontSize={18} textAnchor="middle">{it.emoji}</text>
                </g>
              ))}
            </g>
          )
        })}
      </svg>
      <p className="text-sm font-semibold">{explain}</p>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--line)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-100 dark:bg-ink-800">
            <tr><th className="px-2 py-1">Fruit</th><th className="px-2 py-1">Weight</th><th className="px-2 py-1">Sweetness</th></tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.name} className="border-t border-[color:var(--line)] font-mono">
                <td className="px-2 py-1 font-sans">{it.emoji} {it.name}</td>
                <td className="px-2 py-1">{fmt(rows[0].vals[i], 2)}</td>
                <td className="px-2 py-1">{fmt(rows[1].vals[i], 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VisualCard>
  )
}

// ── 10. Softmax, one step at a time ─────────────────────────────────────────

function SoftmaxSteps({ words = ['mat', 'floor', 'moon'], scores = [3, 2, -1] }) {
  const [sc, setSc] = useState(scores)
  const [step, setStep] = useState(0)
  const exps = sc.map((s) => Math.exp(s))
  const total = exps.reduce((a, b) => a + b, 0)
  const probs = exps.map((e) => e / total)
  const maxAbs = Math.max(1, ...sc.map(Math.abs))
  const maxExp = Math.max(...exps)
  const COLORS = [C.accent, C.blue, C.violet, C.good, C.bad]
  const text = [
    'Step 1: the raw **scores**. Some can be negative, and they don\'t add up to 1. Not probabilities yet!',
    `Step 2: **exp** each score. Every bar is now positive, and the biggest score grows the most. Total = ${exps.map((e) => fmt(e)).join(' + ')} = **${fmt(total)}**.`,
    `Step 3: **divide** each by the total ${fmt(total)}. Now they are probabilities that add up to **100%**.`,
  ][step]

  return (
    <VisualCard
      title="Softmax: scores → probabilities"
      hint="Move the **score sliders**, then press **Next ▶** to watch softmax work in 3 steps."
      footer="Softmax never changes the order: the biggest score always gets the biggest chance."
    >
      <div className="grid gap-2 sm:grid-cols-3">
        {words.map((w, i) => (
          <Slider key={w} label={`score of "${w}"`} value={sc[i]} min={-3} max={5} step={0.5} onChange={(v) => setSc((s) => s.map((x, j) => (j === i ? v : x)))} />
        ))}
      </div>
      <Stepper step={step} total={3} setStep={setStep} labels={['scores', 'exp', 'divide']} />
      <div className="space-y-2 rounded-xl bg-[color:var(--card)] p-3">
        {words.map((w, i) => {
          const val = step === 0 ? sc[i] : step === 1 ? exps[i] : probs[i]
          const shown = step === 0 ? fmt(sc[i]) : step === 1 ? `e^${fmt(sc[i])} = ${fmt(exps[i])}` : `${fmt(exps[i])} ÷ ${fmt(total)} = ${pct(probs[i])}`
          return (
            <div key={w} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[3.5rem_minmax(0,1fr)_10rem]">
              <span className="text-right font-mono text-sm font-bold">{w}</span>
              <div className="relative h-6 rounded-md bg-ink-100 dark:bg-ink-800">
                {step === 0 ? (
                  <>
                    <div className="absolute inset-y-0 left-1/2 w-px bg-ink-400" />
                    <div
                      className="absolute inset-y-0 rounded-md transition-all duration-500"
                      style={{ background: COLORS[i % 5], left: val >= 0 ? '50%' : `${50 - (Math.abs(val) / maxAbs) * 50}%`, width: `${(Math.abs(val) / maxAbs) * 50}%` }}
                    />
                  </>
                ) : (
                  <div className="h-full rounded-md transition-all duration-500" style={{ background: COLORS[i % 5], width: `${(step === 1 ? val / maxExp : val) * 100}%` }} />
                )}
              </div>
              <span className="col-span-2 font-mono text-xs sm:col-span-1">{shown}</span>
            </div>
          )
        })}
        {step === 2 && <p className="text-right font-mono text-xs font-bold">total: {probs.map((p) => pct(p)).join(' + ')} = 100%</p>}
      </div>
      <p className="text-sm font-semibold" aria-live="polite">{text.replace(/\*\*/g, '')}</p>
    </VisualCard>
  )
}

// ── 11. Spinner wheel: sampling (and temperature) ───────────────────────────

function SpinnerWheel({ words = ['mat', 'floor', 'moon'], probs = [0.7, 0.25, 0.05], showTemp = false }) {
  const [T, setT] = useState(1)
  const [rot, setRot] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [tally, setTally] = useState({})
  const p = useMemo(() => {
    const w = probs.map((x) => Math.pow(x, 1 / T))
    const s = w.reduce((a, b) => a + b, 0)
    return w.map((x) => x / s)
  }, [probs, T])
  const COLORS = ['#fb5b14', '#3b82f6', '#a855f7', '#22c55e', '#eab308', '#ec4899']
  const cx = 110, cy = 110, R = 95
  let acc = 0
  const slices = p.map((q, i) => {
    const a0 = acc * 360, a1 = (acc + q) * 360
    acc += q
    return { i, a0, a1 }
  })
  const pt = (deg, r = R) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)]
  const spin = () => {
    if (spinning) return
    let r = Math.random(), pick = 0
    for (let i = 0; i < p.length; i++) { r -= p[i]; if (r <= 0) { pick = i; break } pick = i }
    const s = slices[pick]
    const target = s.a0 + (s.a1 - s.a0) * (0.2 + Math.random() * 0.6)
    const next = rot + 1440 + ((((-target - rot) % 360) + 360) % 360)
    setRot(next)
    setSpinning(true)
    setTimeout(() => {
      setSpinning(false)
      setResult(words[pick])
      setTally((t) => ({ ...t, [words[pick]]: (t[words[pick]] || 0) + 1 }))
    }, 2100)
  }
  const spins = Object.values(tally).reduce((a, b) => a + b, 0)

  return (
    <VisualCard
      title="The word spinner"
      hint={`Press **Spin!** Each word's slice is as big as its probability.${showTemp ? ' Then move the **temperature** slider and spin again.' : ''}`}
      footer={showTemp ? 'Low temperature makes the favourite slice huge (predictable). High temperature makes the slices more equal (creative).' : 'Picking at random, where bigger slices win more often, is called **sampling**. That\'s how a chatbot picks each word.'}
    >
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 220 230" className="h-auto w-56 max-w-full select-none" role="img" aria-label={result ? `Landed on ${result}` : 'Spinner wheel'}>
          <polygon points={`${cx - 10},4 ${cx + 10},4 ${cx},24`} style={{ fill: C.ink }} />
          <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${cx}px ${cy + 10}px`, transition: spinning ? 'transform 2s cubic-bezier(.15,.75,.2,1)' : 'none' }}>
            <g transform="translate(0,10)">
              {slices.map(({ i, a0, a1 }) => {
                const [x0, y0] = pt(a0), [x1, y1] = pt(a1)
                const large = a1 - a0 > 180 ? 1 : 0
                const mid = (a0 + a1) / 2
                const [lx, ly] = pt(mid, R * 0.62)
                return (
                  <g key={i}>
                    {p[i] > 0.999 ? <circle cx={cx} cy={cy} r={R} fill={COLORS[i % 6]} /> : <path d={`M${cx},${cy} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z`} fill={COLORS[i % 6]} stroke="#fff" strokeWidth={2} />}
                    {p[i] > 0.06 && <text x={lx} y={ly + 4} fontSize={12} fontWeight={800} textAnchor="middle" fill="#fff">{words[i]}</text>}
                  </g>
                )
              })}
              <circle cx={cx} cy={cy} r={9} style={{ fill: C.card, stroke: C.ink }} strokeWidth={2} />
            </g>
          </g>
        </svg>
        <div className="min-w-[10rem] space-y-1 text-sm">
          {words.map((w, i) => (
            <p key={w} className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: COLORS[i % 6] }} />
              <span className="font-mono font-bold">{w}</span>
              <span className="muted font-mono">{pct(p[i], 0)}</span>
              {spins > 0 && <span className="font-mono text-xs">· landed {tally[w] || 0}×</span>}
            </p>
          ))}
        </div>
      </div>
      {showTemp && <Slider label="Temperature" value={T} min={0.2} max={3} step={0.1} onChange={(v) => { setT(v); setTally({}); setResult(null) }} format={(v) => v.toFixed(1)} />}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn-primary" onClick={spin} disabled={spinning}>{spinning ? 'Spinning…' : '🎡 Spin!'}</button>
        {result && !spinning && <span className="text-sm font-bold" aria-live="polite">It landed on “{result}”! ({spins} spin{spins === 1 ? '' : 's'} so far)</span>}
      </div>
    </VisualCard>
  )
}

// ── 12. Confusion grid: accuracy, precision & recall ────────────────────────

const ANIMALS = [
  ['🐱', 1, 0.95], ['🐶', 0, 0.4], ['🐱', 1, 0.9], ['🦊', 0, 0.65], ['🐰', 0, 0.2],
  ['🐱', 1, 0.7], ['🐻', 0, 0.1], ['🐯', 0, 0.8], ['🐱', 1, 0.55], ['🐭', 0, 0.15],
  ['🐼', 0, 0.05], ['🐱', 1, 0.35], ['🐨', 0, 0.25], ['🐱', 1, 0.85], ['🐸', 0, 0.02],
  ['🐹', 0, 0.45], ['🐱', 1, 0.6], ['🐮', 0, 0.08], ['🐱', 1, 0.25], ['🦁', 0, 0.5],
]

function ConfusionGrid({ items = ANIMALS }) {
  const [th, setTh] = useState(0.5)
  const cells = items.map(([emoji, real, score]) => {
    const said = score >= th ? 1 : 0
    const kind = real && said ? 'TP' : !real && said ? 'FP' : real && !said ? 'FN' : 'TN'
    return { emoji, real, score, said, kind }
  })
  const n = (k) => cells.filter((c) => c.kind === k).length
  const TP = n('TP'), FP = n('FP'), FN = n('FN'), TN = n('TN')
  const acc = (TP + TN) / cells.length
  const prec = TP + FP ? TP / (TP + FP) : 0
  const rec = TP + FN ? TP / (TP + FN) : 0
  const STYLE = {
    TP: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
    TN: 'border-emerald-300 bg-[color:var(--card)] dark:border-emerald-800',
    FP: 'border-rose-500 bg-rose-50 dark:bg-rose-900/30',
    FN: 'border-amber-500 bg-amber-50 dark:bg-amber-900/30',
  }

  return (
    <VisualCard
      title="Grade the cat-spotting robot"
      hint="The robot gives every photo a **cat score**. Slide the **threshold**: photos with a score at or above it get called “cat!”."
      footer="Raising the threshold makes the robot more careful (higher **precision**, fewer false alarms) but it misses more cats (lower **recall**). Lowering it does the opposite."
    >
      <Slider label="Threshold: say “cat” if score ≥" value={th} min={0} max={1.05} step={0.05} onChange={setTh} format={(v) => (v > 1 ? 'never' : v.toFixed(2))} />
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => setTh(1.05)}>😴 Lazy robot (never says cat)</Btn>
        <Btn onClick={() => setTh(0)}>📣 Shouty robot (always says cat)</Btn>
        <Btn onClick={() => setTh(0.5)}>Normal</Btn>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
        {cells.map((c, i) => (
          <div key={i} className={`flex flex-col items-center rounded-xl border-2 p-1 transition ${STYLE[c.kind]}`} title={`${c.real ? 'really a cat' : 'not a cat'}, score ${c.score}`}>
            <span className="text-2xl leading-none">{c.emoji}</span>
            <span className="font-mono text-[10px]">{c.score.toFixed(2)}</span>
            <span className="text-[10px] font-extrabold">{c.said ? 'said cat' : 'said no'}</span>
            <span className="text-[10px] font-black">{c.kind}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-center text-sm sm:grid-cols-4">
        {[['TP', TP, 'found a cat ✅'], ['FN', FN, 'missed a cat ❌'], ['FP', FP, 'false alarm ❌'], ['TN', TN, 'correctly said no ✅']].map(([k, v, l]) => (
          <div key={k} className={`rounded-xl border-2 p-2 ${STYLE[k]}`}>
            <p className="font-mono text-lg font-black">{v}</p>
            <p className="text-[11px] font-bold">{k}: {l}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1 rounded-xl bg-[color:var(--card)] p-3 font-mono text-[13px]">
        <p>accuracy = ({TP} + {TN}) ÷ {cells.length} = <strong>{pct(acc, 0)}</strong></p>
        <p>precision = {TP} ÷ ({TP} + {FP}) = <strong>{TP + FP ? pct(prec, 0) : '0% (no "cat" answers)'}</strong></p>
        <p>recall = {TP} ÷ ({TP} + {FN}) = <strong>{pct(rec, 0)}</strong></p>
      </div>
      {th > 1 && <Goal done={false}>The lazy robot still gets {pct(acc, 0)} accuracy, but its recall is 0%: it never finds a single cat!</Goal>}
    </VisualCard>
  )
}

export default {
  chanceLine: ChanceLine,
  diceChance: DiceChance,
  coinFlipper: CoinFlipper,
  diceRoller: DiceRoller,
  marbleBag: MarbleBag,
  nextWord: NextWord,
  histogramBuilder: HistogramBuilder,
  meanBalance: MeanBalance,
  normalizeSquash: NormalizeSquash,
  softmaxSteps: SoftmaxSteps,
  spinnerWheel: SpinnerWheel,
  confusionGrid: ConfusionGrid,
}
