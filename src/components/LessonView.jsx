import { useEffect } from 'react'
import { MODULES } from '../data/curriculum'
import { setLastLesson, useProgress, lessonProgress } from '../lib/progress'
import { Theory } from './RichText'
import CodeLab from './CodeLab'
import QuizCard from './QuizCard'
import GitSim from './GitSim'
import DotProductViz from './DotProductViz'
import MatrixShapeViz from './MatrixShapeViz'
import GradientDescentViz from './GradientDescentViz'
import VectorSimilarityViz from './VectorSimilarityViz'
import TemperatureViz from './TemperatureViz'

const VIZ = { DotProductViz, MatrixShapeViz, GradientDescentViz, VectorSimilarityViz, TemperatureViz }
const TYPE = {
  code: { icon: '🧪', label: 'Code lab' },
  quiz: { icon: '❓', label: 'Quiz' },
  git: { icon: '⌨️', label: 'Terminal challenge' },
  viz: { icon: '🎡', label: 'Playground' },
}

function neighbours(mod, lesson) {
  const flat = MODULES.flatMap((m) => m.lessons.map((l) => ({ m, l })))
  const i = flat.findIndex((x) => x.l.id === lesson.id)
  return { prev: flat[i - 1], next: flat[i + 1] }
}

export default function LessonView({ mod, lesson, dailyId }) {
  const progress = useProgress()
  const lp = lessonProgress(lesson, progress)
  const { prev, next } = neighbours(mod, lesson)

  useEffect(() => {
    setLastLesson(mod.id, lesson.id)
    window.scrollTo({ top: 0 })
  }, [mod.id, lesson.id])

  useEffect(() => {
    if (dailyId) document.getElementById(`act-${dailyId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [dailyId])

  return (
    <article className="mx-auto max-w-5xl space-y-5 pb-16">
      <header className="space-y-2">
        <p className="muted text-sm font-bold">
          <a href="#/" className="hover:underline">Dashboard</a> / {mod.emoji} {mod.title}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{lesson.title}</h1>
          {lesson.checkpoint && <span className="chip bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">🏁 Checkpoint</span>}
        </div>
        <p className="muted text-sm font-semibold">
          ⏱ ~{lesson.minutes} min · {lp.done}/{lp.total} activities done
        </p>
      </header>

      <section className="card p-5 sm:p-6" aria-label="Lesson">
        <Theory blocks={lesson.theory} />
      </section>

      {lesson.activities.map((act, i) => {
        const t = TYPE[act.type]
        const isDaily = act.id === dailyId
        const done = Boolean(progress.completed[act.id])
        const Viz = act.type === 'viz' ? VIZ[act.component] : null
        return (
          <section
            key={`${act.id}-${isDaily ? 'daily' : 'normal'}`}
            id={`act-${act.id}`}
            className={`card scroll-mt-24 p-5 sm:p-6 ${isDaily ? 'ring-2 ring-amber-400' : ''}`}
          >
            {isDaily && (
              <p className="mb-3 rounded-lg bg-amber-50 p-2 text-sm font-bold text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
                ☀️ Daily challenge — solve it again from scratch for bonus XP!
              </p>
            )}
            <div className="mb-4 flex items-center gap-3">
              <span className={`grid h-9 w-9 place-items-center rounded-xl text-lg ${done ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-ink-100 dark:bg-ink-800'}`} aria-hidden>
                {done ? '✅' : t.icon}
              </span>
              <div>
                <p className="muted text-[11px] font-extrabold uppercase tracking-wider">{t.label} {i + 1}</p>
                <h2 className="text-lg font-black leading-tight">{act.title}</h2>
              </div>
            </div>
            {act.type === 'code' && <CodeLab lab={act} daily={isDaily} />}
            {act.type === 'quiz' && <QuizCard quiz={act} daily={isDaily} />}
            {act.type === 'git' && <GitSim sim={act} daily={isDaily} />}
            {Viz && <Viz activity={act} />}
          </section>
        )
      })}

      <nav className="flex flex-col gap-3 sm:flex-row sm:justify-between" aria-label="Lesson navigation">
        {prev ? (
          <a className="btn-ghost justify-start" href={`#/learn/${prev.m.id}/${prev.l.id}`}>← {prev.l.title}</a>
        ) : <span />}
        {next ? (
          <a className="btn-primary justify-end" href={`#/learn/${next.m.id}/${next.l.id}`}>
            {next.m.id !== mod.id ? `Next module: ${next.m.title}` : next.l.title} →
          </a>
        ) : (
          <a className="btn-primary" href="#/">🎓 Back to the dashboard</a>
        )}
      </nav>
    </article>
  )
}
