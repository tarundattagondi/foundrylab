import { useEffect, useRef, useState } from 'react'
import CodeEditor from './CodeEditor'
import { Inline } from './RichText'
import Spinner from './Spinner'
import usePyStatus from './usePyStatus'
import useDark from './useDark'
import { runPython, warmUp, explainError } from '../lib/pyodideRunner'
import { completeActivity, getDraft, saveDraft, useProgress, markDailyDone, today } from '../lib/progress'
import { XP } from '../data/curriculum'

const NUDGES = [
  "Not yet, but that's how learning works. Check the first orange test.",
  'Close! Read the message on the first failing test. It tells you exactly what was expected.',
  "Every great model was trained on lots of errors. You're doing the same. 💪",
]

export default function CodeLab({ lab, daily = false }) {
  const progress = useProgress()
  const dark = useDark()
  const py = usePyStatus()
  const done = Boolean(progress.completed[lab.id])

  const [code, setCode] = useState(() => (daily ? lab.starter : getDraft(lab.id) ?? lab.starter))
  const [busy, setBusy] = useState(null) // 'run' | 'check' | null
  const [output, setOutput] = useState(null) // { stdout, error, timeout }
  const [tests, setTests] = useState(null)
  const [fails, setFails] = useState(0)
  const [hints, setHints] = useState(0)
  const [solutionOpen, setSolutionOpen] = useState(false)
  const [passedNow, setPassedNow] = useState(false)
  const saveTimer = useRef()

  // Lazily start Pyodide the first time any code lab appears on screen.
  useEffect(() => {
    warmUp().catch(() => {})
  }, [])

  const onChange = (v) => {
    setCode(v)
    if (daily) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveDraft(lab.id, v), 400)
  }

  async function execute(check) {
    if (busy) return
    setBusy(check ? 'check' : 'run')
    try {
      const res = await runPython(code, { tests: check ? lab.tests : [], check })
      setOutput(res)
      if (!check) return
      if (res.timeout) {
        setTests(null)
        setFails((f) => f + 1)
        return
      }
      setTests(res.tests)
      const allPass = res.tests.length > 0 && res.tests.every((t) => t.passed)
      if (allPass) {
        setPassedNow(true)
        const badges = hints === 0 && !solutionOpen ? ['no-hints'] : []
        const dailyBonus = daily && progress.dailyDone !== today()
        if (dailyBonus) {
          badges.push('daily')
          markDailyDone()
        }
        completeActivity(lab.id, {
          badges,
          bonusXp: dailyBonus ? XP.daily : 0,
          message: dailyBonus ? 'Daily challenge crushed! Skills: still warm. ☀️' : undefined,
        })
      } else {
        setPassedNow(false)
        setFails((f) => f + 1)
      }
    } catch (e) {
      setOutput({ stdout: '', error: { type: 'EngineError', message: String(e.message || e), traceback: String(e.message || e) } })
    } finally {
      setBusy(null)
    }
  }

  const hintsExhausted = hints >= lab.hints.length
  const canShowSolution = fails >= 2 || hintsExhausted
  const passCount = tests ? tests.filter((t) => t.passed).length : 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-relaxed"><Inline text={lab.task} /></p>
          {lab.steps && (
            <div className="mt-3 rounded-xl bg-ink-100 p-3 dark:bg-ink-800">
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-300">What to do</p>
              <ol className="space-y-1.5 text-sm">
                {lab.steps.map((st, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500 text-[11px] font-black text-white">{i + 1}</span>
                    <span><Inline text={st} /></span>
                  </li>
                ))}
              </ol>
              <p className="muted mt-2 text-xs">Write your code in the box below, press <strong>Run</strong> to test it, then <strong>Check</strong> to see if you got it. Stuck? Press <strong>Hint</strong>, that's what it's for!</p>
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          {lab.numpy && <span className="chip bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">NumPy</span>}
          <span className="chip bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{lab.xp} XP</span>
          {done && <span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">✓ Done</span>}
        </div>
      </div>

      <EngineBanner py={py} />

      <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0 space-y-3">
          <CodeEditor value={code} onChange={onChange} dark={dark} onRun={() => execute(false)} onCheck={() => execute(true)} label={`Editor for ${lab.title}`} />
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={() => execute(false)} disabled={!!busy} title="Ctrl/Cmd + Enter">
              {busy === 'run' ? <Spinner /> : '▶'} Run
            </button>
            <button className="btn-primary" onClick={() => execute(true)} disabled={!!busy} title="Shift + Ctrl/Cmd + Enter">
              {busy === 'check' ? <Spinner /> : '✓'} Check
            </button>
            <button className="btn-ghost" onClick={() => setHints((h) => Math.min(h + 1, lab.hints.length))} disabled={hintsExhausted}>
              💡 Hint {hints}/{lab.hints.length}
            </button>
            <button
              className="btn-ghost"
              onClick={() => setSolutionOpen((o) => !o)}
              disabled={!canShowSolution}
              title={canShowSolution ? '' : 'Unlocks after 2 checks or all hints'}
            >
              🔑 {solutionOpen ? 'Hide' : 'Show'} solution
            </button>
            <button className="btn-ghost ml-auto" onClick={() => { onChange(lab.starter); setOutput(null); setTests(null) }} title="Reset to starter code">
              ↺ Reset
            </button>
          </div>

          {hints > 0 && (
            <ol className="space-y-2">
              {lab.hints.slice(0, hints).map((h, i) => (
                <li key={i} className="animate-pop rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-900/20">
                  <span className="mr-1 font-extrabold">Hint {i + 1}:</span> <Inline text={h} />
                </li>
              ))}
            </ol>
          )}

          {solutionOpen && (
            <div className="animate-pop space-y-2 rounded-xl border border-[color:var(--line)] p-3">
              <p className="text-sm font-bold">Reference solution: read it, then try typing it yourself. That's how it sticks.</p>
              <pre className="overflow-x-auto rounded-lg bg-ink-950 p-3 font-mono text-[13px] text-ink-100"><code>{lab.solution}</code></pre>
              <button className="btn-ghost" onClick={() => onChange(lab.solution)}>Copy into editor</button>
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-3">
          <OutputPanel output={output} busy={busy} />
          {tests && (
            <div className="card p-4" aria-live="polite">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-extrabold">Tests</h4>
                <span className="muted text-sm font-bold">{passCount}/{tests.length} passing</span>
              </div>
              <ul className="space-y-2">
                {tests.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span aria-hidden>{t.passed ? '✅' : '🟠'}</span>
                    <div className="min-w-0">
                      <p className="font-bold">{t.name}</p>
                      {!t.passed && t.message && <p className="muted break-words">{t.message}</p>}
                    </div>
                  </li>
                ))}
              </ul>
              {passedNow ? (
                <p className="mt-3 rounded-lg bg-emerald-50 p-2 text-sm font-bold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  All tests pass. You just wrote real, working Python. 🎉
                </p>
              ) : (
                <p className="mt-3 text-sm font-semibold text-amber-700 dark:text-amber-300">{NUDGES[(fails - 1 + NUDGES.length) % NUDGES.length]}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EngineBanner({ py }) {
  if (py.state === 'loading')
    return (
      <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm font-bold text-brand-800 dark:border-brand-900 dark:bg-brand-900/20 dark:text-brand-200">
        <Spinner /> {py.message || 'Warming up the Python engine…'} <span className="muted font-semibold">(only slow the first time)</span>
      </div>
    )
  if (py.state === 'error')
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-800 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-200">
        {py.message}
        <button className="btn-ghost py-1" onClick={() => warmUp().catch(() => {})}>Retry</button>
      </div>
    )
  return null
}

function OutputPanel({ output, busy }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-2">
        <h4 className="text-sm font-extrabold">Output</h4>
        {busy && <span className="muted text-xs font-bold">running…</span>}
      </div>
      <div className="max-h-80 overflow-auto p-4 font-mono text-[13px]">
        {!output && <p className="muted font-sans text-sm">Press <strong>Run</strong> to see what your code prints, or <strong>Check</strong> to grade it.</p>}
        {output?.timeout && (
          <p className="font-sans text-sm font-bold text-amber-700 dark:text-amber-300">
            ⏱️ Your code ran for more than 8 seconds, so we stopped it. Is there a loop that never ends?
          </p>
        )}
        {output?.stdout && <pre className="whitespace-pre-wrap break-words">{output.stdout}</pre>}
        {output && !output.timeout && !output.stdout && !output.error && <p className="muted font-sans text-sm">(Ran fine, nothing was printed.)</p>}
        {output?.error && (
          <div className="mt-2 space-y-2">
            <p className="rounded-lg bg-amber-50 p-2 font-sans text-sm font-bold text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
              🧭 In plain English{output.error.line ? ` (line ${output.error.line})` : ''}: {explainError(output.error.type)}
            </p>
            <pre className="whitespace-pre-wrap break-words text-rose-600 dark:text-rose-300">{output.error.traceback}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

