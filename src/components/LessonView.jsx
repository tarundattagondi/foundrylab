import { useEffect, useRef, useState } from 'react'
import { MODULES } from '../data/curriculum'
import { setLastLesson, useProgress, lessonProgress, completeLearn } from '../lib/progress'
import { Blocks } from './RichText'
import ProgressBar from './ProgressBar'
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

  const learned = Boolean(progress.learned?.[lesson.id])
  const anyDone = lesson.activities.some((a) => progress.completed[a.id])
  const [practice, setPractice] = useState(false)
  const showPractice = practice || learned || anyDone || Boolean(dailyId)
  const practiceRef = useRef(null)

  function finishLearning() {
    completeLearn(lesson.id)
    setPractice(true)
    setTimeout(() => practiceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

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
          ⏱ ~{lesson.minutes} min · {lesson.learn?.length || 1} short pages · {lp.done}/{lp.total} practice done
        </p>
      </header>

      <LearnStepper lesson={lesson} learned={learned} onFinish={finishLearning} />

      <div ref={practiceRef} className="scroll-mt-24">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-black">
          <span aria-hidden>🎯</span> Practice time
        </h2>
        {!showPractice && (
          <div className="card flex flex-col items-center gap-3 p-6 text-center">
            <p className="text-4xl" aria-hidden>📚</p>
            <p className="font-bold">Read the lesson pages above first. The practice will make way more sense!</p>
            <button className="btn-ghost text-sm" onClick={() => setPractice(true)}>I already know this, skip to practice</button>
          </div>
        )}
      </div>

      {showPractice && lesson.activities.map((act, i) => {
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
                ☀️ Daily challenge: solve it again from scratch for bonus XP!
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

function LearnStepper({ lesson, learned, onFinish }) {
  const pages = lesson.learn || [{ title: lesson.title, blocks: lesson.theory || [] }]
  const [i, setI] = useState(0)
  const top = useRef(null)
  const page = pages[i]
  const last = i === pages.length - 1

  const go = (n) => {
    setI(n)
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section ref={top} className="card scroll-mt-24 overflow-hidden" aria-label="Lesson pages">
      <div className="border-b border-[color:var(--line)] px-5 py-3 sm:px-6">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs font-extrabold">
          <span className="uppercase tracking-wider text-brand-600 dark:text-brand-300">📖 Learn · page {i + 1} of {pages.length}</span>
          {learned && <span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">✓ Read</span>}
        </div>
        <ProgressBar value={(i + 1) / pages.length} label="Lesson progress" />
        <div className="mt-2 flex flex-wrap gap-1" role="tablist" aria-label="Pages">
          {pages.map((p, n) => (
            <button
              key={n}
              role="tab"
              aria-selected={n === i}
              title={p.title}
              onClick={() => go(n)}
              className={`h-2.5 rounded-full transition-all ${n === i ? 'w-6 bg-brand-500' : n < i ? 'w-2.5 bg-brand-300 dark:bg-brand-700' : 'w-2.5 bg-ink-200 dark:bg-ink-700'}`}
            />
          ))}
        </div>
      </div>
      <div key={i} className="animate-pop space-y-4 p-5 sm:p-6">
        <h2 className="text-2xl font-black tracking-tight">{page.title}</h2>
        <Blocks blocks={page.blocks} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-[color:var(--line)] px-5 py-3 sm:px-6">
        <button className="btn-ghost" onClick={() => go(i - 1)} disabled={i === 0}>← Back</button>
        {last ? (
          <button className="btn-good" onClick={onFinish}>{learned ? 'Go to practice 🎯' : "I've got it! Let's practice 🎯"}</button>
        ) : (
          <button className="btn-primary" onClick={() => go(i + 1)}>Next →</button>
        )}
      </div>
    </section>
  )
}
