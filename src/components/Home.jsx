import { MODULES, findLesson, ALL_ACTIVITIES } from '../data/curriculum'
import { currentStreak, dailyChallenge, levelInfo, moduleProgress, overallProgress, useProgress, today } from '../lib/progress'
import ProgressBar from './ProgressBar'
import ProgressRing from './ProgressRing'
import StreakFlame from './StreakFlame'
import BadgeShelf from './BadgeShelf'

function firstOpen(mod, progress) {
  return mod.lessons.find((l) => l.activities.some((a) => !progress.completed[a.id])) || mod.lessons[0]
}

const TYPE_LABEL = { code: 'Code lab', quiz: 'Quiz', git: 'Terminal challenge' }

export default function Home() {
  const progress = useProgress()
  const overall = overallProgress(progress)
  const streak = currentStreak(progress)
  const lvl = levelInfo(progress.xp)
  const daily = dailyChallenge(progress)
  const resume = progress.lastLesson && findLesson(progress.lastLesson.moduleId, progress.lastLesson.lessonId)
  const fresh = overall.done === 0
  const labsDone = ALL_ACTIVITIES.filter((a) => (a.type === 'code' || a.type === 'git') && progress.completed[a.id]).length

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      <section className="card relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-400/20 blur-3xl" aria-hidden />
        <p className="text-sm font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-300">{fresh ? 'Welcome to the Foundry' : 'Welcome back'}</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
          {fresh ? 'Learn the foundations of GenAI by doing.' : `Ready to forge, ${lvl.title}?`}
        </h1>
        <p className="muted mt-2 max-w-2xl">
          {fresh
            ? 'Bite-sized lessons, real Python running right in your browser, and playgrounds you can drag around. No installs, no sign-up.'
            : `You've completed ${overall.done} of ${overall.total} activities. Every one makes the next easier.`}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {resume && !fresh ? (
            <a className="btn-primary" href={`#/learn/${resume.mod.id}/${resume.lesson.id}`}>▶ Resume: {resume.lesson.title}</a>
          ) : (
            <a className="btn-primary" href={`#/learn/${MODULES[0].id}/${MODULES[0].lessons[0].id}`}>▶ Start with Python</a>
          )}
        </div>
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-sm font-bold">
            <span>Overall progress</span>
            <span className="tabular-nums">{Math.round(overall.pct * 100)}%</span>
          </div>
          <ProgressBar value={overall.pct} label="Overall progress" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="muted text-xs font-extrabold uppercase tracking-wider">Streak</p>
          <div className="mt-2"><StreakFlame count={streak} /></div>
          <p className="muted mt-2 text-sm">
            {streak === 0 ? 'Complete any activity today to light the flame.' : progress.streak.lastActive === today() ? 'Done for today — see you tomorrow! 🌙' : 'Keep it alive — do one thing today.'}
          </p>
        </div>
        <div className="card p-5">
          <p className="muted text-xs font-extrabold uppercase tracking-wider">Level</p>
          <p className="mt-2 text-2xl font-black">Lv {lvl.level} · {lvl.title}</p>
          <ProgressBar className="mt-2" value={lvl.into / lvl.next} color="bg-gradient-to-r from-brand-400 to-amber-400" label="Progress to next level" />
          <p className="muted mt-2 text-sm">{progress.xp} XP total · {lvl.next - lvl.into} to next level</p>
        </div>
        <div className="card p-5">
          <p className="muted text-xs font-extrabold uppercase tracking-wider">Labs passed</p>
          <p className="mt-2 text-2xl font-black tabular-nums">{labsDone}</p>
          <p className="muted mt-2 text-sm">{labsDone >= 10 ? 'A true lab regular. 🧪' : `${10 - labsDone} more for the Lab Regular badge.`}</p>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl" aria-hidden>☀️</span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black">Daily challenge</h2>
            {daily ? (
              <p className="muted text-sm">
                {TYPE_LABEL[daily.activity.type]} from {MODULES.find((m) => m.id === daily.activity.moduleId).title}: <strong className="text-[color:var(--ink)]">{daily.activity.title}</strong>. Redo it from scratch to keep your skills warm.
              </p>
            ) : (
              <p className="muted text-sm">Finish your first lab and a daily refresher will appear here every day.</p>
            )}
          </div>
          {daily && (daily.done ? (
            <span className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">✓ Done today</span>
          ) : (
            <a className="btn-primary" href={`#/learn/${daily.activity.moduleId}/${daily.activity.lessonId}?daily=${daily.activity.id}`}>Take it · +{daily.bonus} XP</a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-black">Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => {
            const mp = moduleProgress(m.id, progress)
            const target = firstOpen(m, progress)
            return (
              <a key={m.id} href={`#/learn/${m.id}/${target.id}`} className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <ProgressRing value={mp.pct} size={52} stroke={5} label={`${Math.round(mp.pct * 100)}%`}>
                    <span className="text-xl" aria-hidden>{m.emoji}</span>
                  </ProgressRing>
                  <span className="muted text-xs font-bold">Module {i + 1}</span>
                </div>
                <h3 className="mt-3 text-lg font-black">{m.title}</h3>
                <p className="muted mt-1 flex-1 text-sm">{m.tagline}</p>
                <div className="mt-4 flex items-center justify-between text-sm font-bold">
                  <span className="tabular-nums">{mp.done}/{mp.total} done</span>
                  <span className="text-brand-600 group-hover:underline dark:text-brand-300">
                    {mp.pct === 1 ? 'Review' : mp.done ? 'Continue' : 'Start'} →
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="mb-1 text-xl font-black">Badge shelf</h2>
        <BadgeShelf earned={progress.badges} />
      </section>
    </div>
  )
}
