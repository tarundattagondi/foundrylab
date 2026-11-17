import { useState } from 'react'
import { Inline } from './RichText'

/** One ungraded question inside a lesson page. Wrong answers get a gentle nudge. */
export default function QuickCheck({ q, options, answer, explain }) {
  const [wrong, setWrong] = useState([])
  const [right, setRight] = useState(false)
  return (
    <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/60 p-4 dark:border-violet-900 dark:bg-violet-950/30">
      <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-300">🤔 Quick check</p>
      <p className="mb-3 font-bold"><Inline text={q} /></p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => {
          const isRight = right && i === answer
          const isWrong = wrong.includes(i)
          return (
            <button
              key={i}
              onClick={() => (i === answer ? setRight(true) : setWrong((w) => (w.includes(i) ? w : [...w, i])))}
              disabled={right}
              className={`rounded-xl border-2 px-3 py-2 text-left text-sm font-semibold transition ${
                isRight ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : isWrong ? 'border-amber-400 opacity-60' : 'border-[color:var(--line)] bg-[color:var(--card)] hover:border-violet-400'
              }`}
            >
              <Inline text={o} />
            </button>
          )
        })}
      </div>
      {!right && wrong.length > 0 && <p className="mt-2 text-sm font-bold text-amber-700 dark:text-amber-300">Not that one. Try another! Mistakes are how brains learn. 🧠</p>}
      {right && <p className="mt-2 animate-pop text-sm"><strong className="text-emerald-700 dark:text-emerald-300">Yes! 🎉 </strong><Inline text={explain} /></p>}
    </div>
  )
}
