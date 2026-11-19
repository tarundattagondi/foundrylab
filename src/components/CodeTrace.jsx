import { useEffect, useMemo, useRef, useState } from 'react'
import { runPython } from '../lib/pyodideRunner'
import { buildSteps, frameLabel } from '../lib/traceSteps'
import { Inline } from './Inline'
import Spinner from './Spinner'

const KIND_STYLE = {
  line: 'bg-amber-200/70 dark:bg-amber-500/25',
  finish: 'bg-amber-200/70 dark:bg-amber-500/25',
  jump: 'bg-violet-200/70 dark:bg-violet-500/25',
  call: 'bg-violet-200/70 dark:bg-violet-500/25',
  return: 'bg-sky-200/70 dark:bg-sky-500/25',
  error: 'bg-rose-200/70 dark:bg-rose-500/30',
}

/**
 * Step-by-step code walkthrough ("watch Python think").
 * code: Python source · notes: optional { lineNumber: 'extra explanation' }
 * autoStart: run immediately (used when opened from a button) · onClose: show a close button
 */
export default function CodeTrace({ code, notes = {}, autoStart = false, onClose, title }) {
  const [steps, setSteps] = useState(null)
  const [i, setI] = useState(0)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(null)
  const [playing, setPlaying] = useState(false)
  const root = useRef(null)

  async function start() {
    setBusy(true)
    setFailed(null)
    try {
      const res = await runPython(code, { trace: true })
      if (res.timeout) throw new Error('This code takes too long to run step by step.')
      setSteps(buildSteps(code, res))
      setI(0)
    } catch (e) {
      setFailed(String(e.message || e))
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (autoStart) start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  useEffect(() => {
    if (!playing || !steps) return
    if (i >= steps.length - 1) return setPlaying(false)
    const t = setTimeout(() => setI((n) => Math.min(n + 1, steps.length - 1)), 1100)
    return () => clearTimeout(t)
  }, [playing, i, steps])

  const lines = useMemo(() => code.replace(/\n$/, '').split('\n'), [code])
  const step = steps?.[i]
  const prev = steps && i > 0 ? steps[i - 1] : null

  const onKey = (e) => {
    if (!steps) return
    if (e.key === 'ArrowRight') setI((n) => Math.min(n + 1, steps.length - 1))
    if (e.key === 'ArrowLeft') setI((n) => Math.max(n - 1, 0))
  }

  return (
    <div
      ref={root}
      tabIndex={-1}
      onKeyDown={onKey}
      className="overflow-hidden rounded-2xl border-2 border-violet-300 bg-violet-50/50 outline-none dark:border-violet-800 dark:bg-violet-950/20"
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-violet-200 px-4 py-2.5 dark:border-violet-900">
        <span className="chip bg-violet-600 text-white">🔍 Step by step</span>
        <span className="text-sm font-bold text-violet-900 dark:text-violet-200">{title || 'Watch Python run this code, one line at a time.'}</span>
        {onClose && (
          <button className="btn-ghost ml-auto px-2.5 py-1 text-xs" onClick={onClose} aria-label="Close step-by-step">✕ Close</button>
        )}
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Code with the current line highlighted */}
        <div className="min-w-0 border-b border-violet-200 bg-[color:var(--card)] p-3 dark:border-violet-900 lg:border-b-0 lg:border-r">
          <div className="overflow-x-auto font-mono text-[13px] leading-[1.7]">
            {lines.map((text, n) => {
              const ln = n + 1
              const active = step && step.line === ln
              const was = !active && prev && prev.line === ln
              return (
                <div key={n} className={`flex min-w-max rounded-md ${active ? KIND_STYLE[step.kind] || KIND_STYLE.line : was ? 'bg-ink-100 dark:bg-ink-800/60' : ''}`}>
                  <span className={`w-6 shrink-0 select-none text-center ${active ? 'text-violet-700 dark:text-violet-300' : 'text-transparent'}`} aria-hidden>➜</span>
                  <span className="w-7 shrink-0 select-none pr-2 text-right text-ink-400">{ln}</span>
                  <span className="whitespace-pre pr-3">{text || ' '}</span>
                </div>
              )
            })}
          </div>
          {!steps && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button className="btn bg-violet-600 text-white hover:bg-violet-700" onClick={start} disabled={busy}>
                {busy ? <Spinner /> : '▶'} {busy ? 'Getting ready…' : 'Start step by step'}
              </button>
              {failed && <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{failed}</span>}
            </div>
          )}
        </div>

        {/* Explanation, memory boxes and output */}
        <div className="min-w-0 space-y-3 p-3">
          {!steps ? (
            <p className="muted p-2 text-sm">
              Press <strong>Start</strong>. Then use <strong>Next ▶</strong> to move one step at a time. You'll see which line runs, what each variable holds, and what gets printed.
            </p>
          ) : (
            <>
              <div className="animate-pop rounded-xl bg-[color:var(--card)] p-3 shadow-sm" key={i} aria-live="polite">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                  Step {i + 1} of {steps.length} · {step.title}
                </p>
                {step.line && <p className="mt-1 overflow-x-auto whitespace-pre rounded bg-ink-100 px-2 py-1 font-mono text-[12px] dark:bg-ink-800">{lines[step.line - 1].trim()}</p>}
                <ul className="mt-2 space-y-1 text-[15px]">
                  {step.details.map((d, k) => (
                    <li key={k}><Inline text={d} /></li>
                  ))}
                  {step.line && notes[step.line] && (step.kind === 'line' || step.kind === 'finish' || step.kind === 'jump') && (
                    <li className="rounded-lg bg-amber-50 p-2 text-sm dark:bg-amber-900/20">💬 <Inline text={notes[step.line]} /></li>
                  )}
                </ul>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-ink-500">📦 Memory boxes</p>
                <div className="space-y-2">
                  {step.stack.map((f, fi) => {
                    const vars = Object.entries(f.vars).filter(([, v]) => v.kind === 'value' || fi === 0)
                    return (
                      <div key={fi} className={`rounded-xl border p-2 ${fi > 0 ? 'ml-4 border-violet-300 dark:border-violet-800' : 'border-[color:var(--line)]'}`}>
                        <p className="mb-1.5 text-xs font-extrabold">{frameLabel(f, fi)}</p>
                        {vars.length === 0 ? (
                          <p className="muted text-xs">(no boxes yet)</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {vars.map(([name, v]) => {
                              const hot = fi === step.stack.length - 1 && step.changed.includes(name)
                              return (
                                <div key={name} className="flex max-w-full flex-col items-start">
                                  <span className="rounded-t-md bg-ink-200 px-1.5 font-mono text-[11px] font-bold dark:bg-ink-700">{name}</span>
                                  <span
                                    className={`max-w-[16rem] overflow-x-auto whitespace-pre rounded-b-md rounded-tr-md border-2 px-2 py-1 font-mono text-[13px] transition ${
                                      hot ? 'border-brand-500 bg-brand-50 shadow-[0_0_0_3px_rgba(251,91,20,.2)] dark:bg-brand-900/30' : 'border-ink-200 bg-[color:var(--card)] dark:border-ink-700'
                                    } ${v.kind !== 'value' ? 'italic text-ink-500' : ''}`}
                                  >
                                    {v.repr}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-ink-500">🖨️ Printed so far</p>
                <pre className="max-h-32 overflow-auto whitespace-pre-wrap rounded-xl bg-ink-950 p-2 font-mono text-[12px] text-ink-100">{step.stdout || ' '}</pre>
              </div>
            </>
          )}
        </div>
      </div>

      {steps && (
        <div className="flex flex-wrap items-center gap-2 border-t border-violet-200 px-3 py-2.5 dark:border-violet-900">
          <button className="btn-ghost px-2.5" onClick={() => { setPlaying(false); setI(0) }} disabled={i === 0} aria-label="First step">⏮</button>
          <button className="btn-ghost" onClick={() => { setPlaying(false); setI((n) => Math.max(n - 1, 0)) }} disabled={i === 0}>◀ Back</button>
          <button className="btn bg-violet-600 text-white hover:bg-violet-700" onClick={() => { setPlaying(false); setI((n) => Math.min(n + 1, steps.length - 1)) }} disabled={i >= steps.length - 1}>
            Next ▶
          </button>
          <button className="btn-ghost" onClick={() => setPlaying((p) => !p)} disabled={i >= steps.length - 1}>{playing ? '⏸ Pause' : '⏯ Play'}</button>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={i}
            onChange={(e) => { setPlaying(false); setI(+e.target.value) }}
            className="min-w-24 flex-1 accent-violet-600"
            aria-label="Jump to step"
          />
        </div>
      )}
    </div>
  )
}
