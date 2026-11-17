import { useEffect, useMemo, useState } from 'react'
import VizShell from './VizShell'
import useGoal from './useGoal'

const TOKENS = [
  { t: 'mat', logit: 3.2 },
  { t: 'floor', logit: 2.5 },
  { t: 'sofa', logit: 2.1 },
  { t: 'roof', logit: 1.2 },
  { t: 'moon', logit: 0.3 },
  { t: 'banana', logit: -0.5 },
]

function softmax(logits, T) {
  const z = logits.map((l) => l / T)
  const max = Math.max(...z)
  const e = z.map((v) => Math.exp(v - max))
  const s = e.reduce((a, b) => a + b, 0)
  return e.map((v) => v / s)
}

function sample(probs) {
  let r = Math.random()
  for (let i = 0; i < probs.length; i++) {
    r -= probs[i]
    if (r <= 0) return i
  }
  return probs.length - 1
}

export default function TemperatureViz({ activity }) {
  const [done, achieve] = useGoal(activity, 'You felt temperature: low = focused, high = wild. 🌡️')
  const [T, setT] = useState(1)
  const [samples, setSamples] = useState([])
  const [hitLow, setHitLow] = useState(false)
  const [hitHigh, setHitHigh] = useState(false)
  const probs = useMemo(() => softmax(TOKENS.map((x) => x.logit), T), [T])
  const top = Math.max(...probs)

  useEffect(() => {
    if (top >= 0.9) setHitLow(true)
    if (top <= 0.3) setHitHigh(true)
  }, [top])
  useEffect(() => {
    if (hitLow && hitHigh) achieve()
  }, [hitLow, hitHigh, achieve])

  const mood = T < 0.5 ? 'Focused & predictable' : T < 1.3 ? 'Balanced' : T < 2 ? 'Creative' : 'Chaotic gremlin mode'

  return (
    <VizShell goal="Make the model confident (top token ≥ 90%), then adventurous (top token ≤ 30%)." done={done} xp={activity.xp}>
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        <span className={`chip ${hitLow ? 'bg-emerald-600 text-white' : 'bg-ink-100 dark:bg-ink-800'}`}>{hitLow ? '✓' : '○'} confident ≥ 90%</span>
        <span className={`chip ${hitHigh ? 'bg-emerald-600 text-white' : 'bg-ink-100 dark:bg-ink-800'}`}>{hitHigh ? '✓' : '○'} adventurous ≤ 30%</span>
      </div>
      <p className="font-mono text-sm">
        Prompt: <span className="font-bold">"The cat sat on the ___"</span>
      </p>

      <div className="space-y-2" role="list" aria-label="Next-token probabilities">
        {TOKENS.map((tok, i) => (
          <div key={tok.t} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-2" role="listitem">
            <span className="truncate text-right font-mono text-sm font-bold">{tok.t}</span>
            <div className="h-6 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800">
              <div
                className={`h-full rounded-lg transition-all duration-300 ${i === 0 ? 'bg-brand-500' : 'bg-brand-300 dark:bg-brand-700'}`}
                style={{ width: `${probs[i] * 100}%` }}
              />
            </div>
            <span className="text-right font-mono text-sm tabular-nums">{(probs[i] * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <label className="block text-sm font-bold">
        Temperature: <span className="font-mono">{T.toFixed(2)}</span> <span className="muted font-semibold">— {mood}</span>
        <input type="range" min={0.1} max={3} step={0.05} value={T} onChange={(e) => setT(+e.target.value)} className="mt-1 w-full accent-[#fb5b14]" />
        <span className="muted flex justify-between text-[10px] font-bold"><span>0.1 sharp</span><span>1.0 as trained</span><span>3.0 flat</span></span>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button className="btn-primary" onClick={() => setSamples((s) => [TOKENS[sample(probs)].t, ...s].slice(0, 16))}>🎲 Sample a token</button>
        <button className="btn-ghost" onClick={() => setSamples((s) => [...Array.from({ length: 10 }, () => TOKENS[sample(probs)].t), ...s].slice(0, 16))}>Sample ×10</button>
        {samples.length > 0 && <button className="btn-ghost" onClick={() => setSamples([])}>Clear</button>}
      </div>
      {samples.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-live="polite">
          {samples.map((s, i) => (
            <span key={i} className={`chip font-mono ${s === 'mat' ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200' : 'bg-ink-100 dark:bg-ink-800'}`}>{s}</span>
          ))}
        </div>
      )}
      <p className="muted text-xs">p = softmax(logits / T). Dividing by a small T stretches the gaps between scores; a big T squashes them together.</p>
    </VizShell>
  )
}
