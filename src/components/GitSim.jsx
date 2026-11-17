import { useEffect, useRef, useState } from 'react'
import { exec, initState, normalize } from '../lib/gitSim'
import { completeActivity, useProgress, markDailyDone, today } from '../lib/progress'
import { XP } from '../data/curriculum'

const KIND = {
  out: 'text-ink-100',
  err: 'text-rose-300',
  good: 'text-emerald-300',
  warn: 'text-amber-300',
  note: 'text-sky-300 italic',
  cmd: 'text-white font-semibold',
  win: 'text-emerald-300 font-bold',
}

const STEP_CHEERS = ['Nice!', 'Yes!', 'Exactly.', 'Smooth.', 'Perfect.']

export default function GitSim({ sim, daily = false }) {
  const progress = useProgress()
  const done = Boolean(progress.completed[sim.id])
  const [state, setState] = useState(() => initState(sim.setup))
  const [step, setStep] = useState(0)
  const [lines, setLines] = useState(() => [{ text: sim.intro, kind: 'note' }, { text: 'Type help to see commands, or hint if you get stuck.', kind: 'note' }])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [hIdx, setHIdx] = useState(-1)
  const [showHint, setShowHint] = useState(false)
  const scroller = useRef(null)
  const inputRef = useRef(null)

  const finished = step >= sim.steps.length

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [lines])

  function prompt() {
    const where = state.initialized ? ` (${state.branch}${state.merging ? '|MERGING' : ''})` : ''
    return `you@foundry ~/project${where} $`
  }

  function submit(e) {
    e.preventDefault()
    const raw = input
    setInput('')
    setHIdx(-1)
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 50))
    const cmd = normalize(raw)
    const echo = { text: `${prompt()} ${raw}`, kind: 'cmd' }

    if (cmd === 'hint') {
      setLines((l) => [...l, echo, { text: finished ? 'All done — nothing left to hint!' : `💡 Try: ${sim.steps[step].hint}`, kind: 'warn' }])
      return
    }
    const r = exec(state, raw)
    if (r.clear) {
      setLines([])
      setState(r.state)
      return
    }
    let next = step
    // Forgiving: one command may satisfy several consecutive steps.
    while (next < sim.steps.length && sim.steps[next].check(r.state, cmd)) next++
    const extra = []
    if (next > step && !finished) {
      extra.push({ text: `✓ ${STEP_CHEERS[step % STEP_CHEERS.length]} Step ${next} of ${sim.steps.length} done.`, kind: 'win' })
      setShowHint(false)
    }
    if (next >= sim.steps.length && !finished) {
      extra.push({ text: '🎉 Challenge complete! You just did what every developer does daily.', kind: 'win' })
      const dailyBonus = daily && progress.dailyDone !== today()
      if (dailyBonus) markDailyDone()
      completeActivity(sim.id, {
        badges: dailyBonus ? ['daily'] : [],
        bonusXp: dailyBonus ? XP.daily : 0,
        message: dailyBonus ? 'Daily challenge done! Git muscles: flexed. 💪' : 'Git challenge complete! 🌿',
      })
    }
    setState(r.state)
    setStep(next)
    setLines((l) => [...l, echo, ...r.lines, ...extra])
  }

  function onKey(e) {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = Math.min(hIdx + 1, history.length - 1)
      setHIdx(i)
      setInput(history[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = hIdx - 1
      setHIdx(Math.max(i, -1))
      setInput(i >= 0 ? history[i] : '')
    }
  }

  function reset() {
    setState(initState(sim.setup))
    setStep(0)
    setLines([{ text: sim.intro, kind: 'note' }])
    setShowHint(false)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
      <div className="order-2 min-w-0 lg:order-1">
        <div
          className="overflow-hidden rounded-xl border border-ink-800 bg-[#12121f] shadow-inner"
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
          <div className="flex items-center gap-1.5 border-b border-ink-800 px-3 py-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs font-semibold text-ink-400">terminal — sandbox, nothing here touches your real files</span>
          </div>
          <div ref={scroller} className="h-72 overflow-y-auto px-3 py-2 font-mono text-[13px] leading-relaxed" aria-live="polite">
            {lines.map((l, i) => (
              <div key={i} className={`whitespace-pre-wrap break-words ${KIND[l.kind] || KIND.out}`}>{l.text || ' '}</div>
            ))}
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 border-t border-ink-800 px-3 py-2 font-mono text-[13px]">
            <span className="hidden shrink-0 text-brand-300 sm:inline">{prompt()}</span>
            <span className="shrink-0 text-brand-300 sm:hidden">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-ink-500"
              placeholder={finished ? 'challenge complete — keep playing if you like' : 'type a command…'}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
          </form>
        </div>
      </div>

      <div className="order-1 space-y-3 lg:order-2">
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{sim.xp} XP</span>
          {done && <span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">✓ Done</span>}
        </div>
        <ol className="space-y-1.5">
          {sim.steps.map((st, i) => (
            <li
              key={i}
              className={`flex gap-2 rounded-lg px-2 py-1.5 text-sm ${
                i === step ? 'bg-brand-50 font-bold dark:bg-brand-900/20' : i < step ? 'muted line-through decoration-1' : 'muted'
              }`}
            >
              <span aria-hidden>{i < step ? '✅' : i === step ? '👉' : '○'}</span>
              <span>{st.prompt}</span>
            </li>
          ))}
        </ol>
        {!finished && (
          <div>
            {showHint ? (
              <p className="animate-pop rounded-lg bg-amber-50 p-2 font-mono text-xs text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">{sim.steps[step].hint}</p>
            ) : (
              <button className="btn-ghost w-full" onClick={() => setShowHint(true)}>💡 Show hint</button>
            )}
          </div>
        )}
        <button className="btn-ghost w-full" onClick={reset}>↺ Start over</button>
      </div>
    </div>
  )
}
