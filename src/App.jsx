import { useEffect, useState } from 'react'
import { findLesson } from './data/curriculum'
import { currentStreak, setTheme, useProgress } from './lib/progress'
import Sidebar from './components/Sidebar'
import LessonView from './components/LessonView'
import Home from './components/Home'
import Settings from './components/Settings'
import XPBar from './components/XPBar'
import StreakFlame from './components/StreakFlame'
import Confetti from './components/Confetti'

// Hash routes: #/  ·  #/learn/<module>/<lesson>[?daily=<activity>]  ·  #/settings
function parseHash() {
  const [path, query = ''] = window.location.hash.replace(/^#/, '').split('?')
  const parts = path.split('/').filter(Boolean)
  const params = new URLSearchParams(query)
  if (parts[0] === 'learn' && parts[1] && parts[2]) {
    return { view: 'lesson', moduleId: parts[1], lessonId: parts[2], daily: params.get('daily') }
  }
  if (parts[0] === 'settings') return { view: 'settings' }
  return { view: 'home' }
}

function useRoute() {
  const [route, setRoute] = useState(parseHash)
  useEffect(() => {
    const on = () => setRoute(parseHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

function useTheme(theme) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => document.documentElement.classList.toggle('dark', theme ? theme === 'dark' : mq.matches)
    apply()
    if (theme) return
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])
}

export default function App() {
  const progress = useProgress()
  const route = useRoute()
  const [drawer, setDrawer] = useState(false)
  useTheme(progress.theme)

  const isDark = progress.theme ? progress.theme === 'dark' : document.documentElement.classList.contains('dark')
  const found = route.view === 'lesson' && findLesson(route.moduleId, route.lessonId)

  useEffect(() => {
    document.title = found ? `${found.lesson.title} · FoundryLab` : 'FoundryLab'
  }, [found])

  return (
    <div className="min-h-full">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[70] focus:rounded-lg focus:bg-brand-500 focus:p-2 focus:text-white">
        Skip to content
      </a>
      <header
        className="sticky z-40 border-b border-[color:var(--line)] bg-[color:var(--bg)]/85 backdrop-blur"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="flex h-16 items-center gap-3 px-4">
          <button className="btn-ghost px-2.5 lg:hidden" onClick={() => setDrawer(true)} aria-label="Open navigation">☰</button>
          <a href="#/" className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-sm shadow-brand-500/40" aria-hidden>⚒</span>
            <span className="hidden sm:inline">Foundry<span className="text-brand-500">Lab</span></span>
          </a>
          <div className="ml-auto flex items-center gap-3 sm:gap-5">
            <StreakFlame count={currentStreak(progress)} />
            <XPBar xp={progress.xp} />
            <button
              className="btn-ghost px-2.5"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-[color:var(--line)] lg:block">
          <Sidebar route={route} />
        </aside>

        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
            <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
            <div className="absolute inset-y-0 left-0 w-[85vw] max-w-xs bg-[color:var(--bg)] shadow-xl" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
              <div className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-3">
                <span className="font-black">Foundry<span className="text-brand-500">Lab</span></span>
                <button className="btn-ghost px-2.5" onClick={() => setDrawer(false)} aria-label="Close navigation">✕</button>
              </div>
              <div className="h-[calc(100%-3.5rem)]">
                <Sidebar route={route} onNavigate={() => setDrawer(false)} />
              </div>
            </div>
          </div>
        )}

        <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10">
          {route.view === 'home' && <Home />}
          {route.view === 'settings' && <Settings />}
          {route.view === 'lesson' &&
            (found ? (
              <LessonView key={`${found.lesson.id}-${route.daily || ''}`} mod={found.mod} lesson={found.lesson} dailyId={route.daily} />
            ) : (
              <div className="mx-auto max-w-md py-20 text-center">
                <p className="text-5xl" aria-hidden>🧭</p>
                <h1 className="mt-3 text-2xl font-black">Lesson not found</h1>
                <p className="muted mt-1">That link might be from an older version.</p>
                <a className="btn-primary mt-4" href="#/">Back to the dashboard</a>
              </div>
            ))}
        </main>
      </div>

      <Confetti />
    </div>
  )
}
