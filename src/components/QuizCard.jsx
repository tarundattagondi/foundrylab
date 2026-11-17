import { useState } from 'react'
import { Inline, CodeBlock } from './RichText'
import { completeActivity, recordQuiz, useProgress, markDailyDone, today } from '../lib/progress'
import { XP } from '../data/curriculum'

const WRONG = [
  'Not quite. Have another look. 🔍',
  'Good guess! Try a different one.',
  'Almost. Think about what the code actually does.',
]

export default function QuizCard({ quiz, daily = false }) {
  const progress = useProgress()
  const done = Boolean(progress.completed[quiz.id])
  const best = progress.quizScores[quiz.id]

  const [idx, setIdx] = useState(0)
  const [wrong, setWrong] = useState([]) // wrong option indexes for this question
  const [solved, setSolved] = useState(false)
  const [firstTry, setFirstTry] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = quiz.questions[idx]
  const total = quiz.questions.length

  function pick(i) {
    if (solved || wrong.includes(i)) return
    if (i === q.answer) {
      setSolved(true)
      if (wrong.length === 0) setFirstTry((n) => n + 1)
    } else {
      setWrong((w) => [...w, i])
    }
  }

  function next() {
    if (idx + 1 < total) {
      setIdx(idx + 1)
      setWrong([])
      setSolved(false)
      return
    }
    setFinished(true)
    recordQuiz(quiz.id, firstTry, total)
    const perfect = firstTry === total
    const badges = perfect ? ['perfect-quiz'] : []
    const dailyBonus = daily && progress.dailyDone !== today()
    if (dailyBonus) {
      badges.push('daily')
      markDailyDone()
    }
    completeActivity(quiz.id, {
      badges,
      bonusXp: dailyBonus ? XP.daily : 0,
      message: perfect ? 'Perfect score! Every answer right first try. 💯' : `Quiz done! ${firstTry}/${total} on the first try. Great effort! 🧠`,
    })
  }

  function restart() {
    setIdx(0)
    setWrong([])
    setSolved(false)
    setFirstTry(0)
    setFinished(false)
  }

  if (finished) {
    const perfect = firstTry === total
    return (
      <div className="space-y-3 text-center">
        <div className="text-5xl" aria-hidden>{perfect ? '💯' : '🧠'}</div>
        <p className="text-xl font-black">{firstTry}/{total} right on the first try</p>
        <p className="muted">{perfect ? 'Flawless. You clearly get this.' : 'And you found every right answer in the end, and that counts.'}</p>
        <button className="btn-ghost" onClick={restart}>Take it again</button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="muted text-sm font-bold">Question {idx + 1} of {total}</span>
        <div className="flex gap-2">
          <span className="chip bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{quiz.xp} XP</span>
          {done && <span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">✓ Best {best?.best ?? '–'}/{best?.total ?? total}</span>}
        </div>
      </div>
      <div className="flex gap-1" aria-hidden>
        {quiz.questions.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < idx || (i === idx && solved) ? 'bg-brand-500' : 'bg-ink-100 dark:bg-ink-800'}`} />
        ))}
      </div>

      {q.code && <CodeBlock code={q.code} />}
      <p className="text-lg font-extrabold leading-snug"><Inline text={q.q} /></p>

      <div className="grid gap-2" role="radiogroup">
        {q.options.map((opt, i) => {
          const isWrong = wrong.includes(i)
          const isRight = solved && i === q.answer
          return (
            <button
              key={i}
              role="radio"
              aria-checked={isRight}
              onClick={() => pick(i)}
              disabled={solved && !isRight}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${
                isRight
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                  : isWrong
                    ? 'border-amber-400 bg-amber-50 opacity-70 dark:bg-amber-900/20'
                    : 'border-[color:var(--line)] hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20'
              }`}
            >
              <span className="mr-2 font-black text-brand-500">{String.fromCharCode(65 + i)}</span>
              <Inline text={opt} />
            </button>
          )
        })}
      </div>

      {!solved && wrong.length > 0 && (
        <p className="text-sm font-bold text-amber-700 dark:text-amber-300" aria-live="polite">{WRONG[(wrong.length - 1) % WRONG.length]}</p>
      )}
      {solved && (
        <div className="animate-pop space-y-3 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/20" aria-live="polite">
          <p className="text-sm"><strong>{wrong.length === 0 ? 'Yes! ' : 'There it is. '}</strong><Inline text={q.explain} /></p>
          <button className="btn-primary" onClick={next}>{idx + 1 < total ? 'Next question →' : 'Finish quiz 🎉'}</button>
        </div>
      )}
    </div>
  )
}
