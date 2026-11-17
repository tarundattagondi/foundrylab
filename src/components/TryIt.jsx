import { useState } from 'react'
import CodeEditor from './CodeEditor'
import useDark from './useDark'
import { runPython, warmUp, explainError } from '../lib/pyodideRunner'
import { Inline } from './RichText'
import Spinner from './Spinner'

/** A small, ungraded code playground inside a lesson page. Change it, run it, learn. */
export default function TryIt({ code, note }) {
  const dark = useDark()
  const [value, setValue] = useState(code)
  const [out, setOut] = useState(null)
  const [busy, setBusy] = useState(false)

  async function run() {
    if (busy) return
    setBusy(true)
    try {
      setOut(await runPython(value))
    } catch (e) {
      setOut({ stdout: '', error: { type: 'EngineError', traceback: String(e.message || e) } })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/60 p-3 dark:border-sky-800 dark:bg-sky-950/30" onFocus={() => warmUp().catch(() => {})}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="chip bg-sky-500 text-white">▶ Try it yourself</span>
        {note && <span className="text-sm font-semibold text-sky-900 dark:text-sky-200"><Inline text={note} /></span>}
      </div>
      <CodeEditor value={value} onChange={setValue} dark={dark} onRun={run} minHeight="60px" label="Try-it code editor" />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button className="btn bg-sky-600 text-white hover:bg-sky-700" onClick={run} disabled={busy}>
          {busy ? <Spinner /> : '▶'} Run
        </button>
        {value !== code && (
          <button className="btn-ghost" onClick={() => { setValue(code); setOut(null) }}>↺ Put it back</button>
        )}
        {busy && <span className="muted text-xs font-bold">(the first run wakes up Python — a few seconds)</span>}
      </div>
      {out && (
        <div className="mt-2 rounded-xl bg-ink-950 p-3 font-mono text-[13px] text-ink-100" aria-live="polite">
          <p className="mb-1 font-sans text-[11px] font-extrabold uppercase tracking-wider text-ink-400">The computer says:</p>
          {out.timeout && <p className="font-sans text-amber-300">⏱️ That ran too long, so we stopped it. Is there a loop that never ends?</p>}
          {out.stdout && <pre className="whitespace-pre-wrap break-words">{out.stdout}</pre>}
          {!out.timeout && !out.stdout && !out.error && <p className="font-sans text-ink-400">(It ran, but nothing was printed. Use print(...) to show things!)</p>}
          {out.error && (
            <>
              <p className="mb-1 font-sans font-bold text-amber-300">🧭 {explainError(out.error.type)}</p>
              <pre className="whitespace-pre-wrap break-words text-rose-300">{out.error.traceback}</pre>
            </>
          )}
        </div>
      )}
    </div>
  )
}
