import { useEffect, useState } from 'react'
import { MODULES } from '../data/curriculum'
import { lessonProgress, moduleProgress, useProgress } from '../lib/progress'
import ProgressRing from './ProgressRing'

export default function Sidebar({ route, onNavigate }) {
  const progress = useProgress()
  const [open, setOpen] = useState(() => new Set([route.moduleId || MODULES[0].id]))

  useEffect(() => {
    if (route.moduleId) setOpen((o) => new Set(o).add(route.moduleId))
  }, [route.moduleId])

  const toggle = (id) =>
    setOpen((o) => {
      const n = new Set(o)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto p-3" aria-label="Modules and lessons">
      <a
        href="#/"
        onClick={onNavigate}
        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-extrabold ${route.view === 'home' ? 'bg-brand-500 text-white' : 'hover:bg-ink-100 dark:hover:bg-ink-800'}`}
      >
        <span aria-hidden>🏠</span> Dashboard
      </a>

      <p className="muted mt-3 px-3 text-[11px] font-extrabold uppercase tracking-wider">Modules</p>
      {MODULES.map((m, mi) => {
        const mp = moduleProgress(m.id, progress)
        const isOpen = open.has(m.id)
        return (
          <div key={m.id}>
            <button
              onClick={() => toggle(m.id)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-ink-100 dark:hover:bg-ink-800"
              aria-expanded={isOpen}
            >
              <ProgressRing value={mp.pct} size={34} label={`${Math.round(mp.pct * 100)}% complete`}>
                <span aria-hidden>{m.emoji}</span>
              </ProgressRing>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-extrabold">{mi + 1}. {m.title}</span>
                <span className="muted block text-[11px] font-semibold">{mp.done}/{mp.total} done</span>
              </span>
              <span className={`muted text-xs transition ${isOpen ? 'rotate-90' : ''}`} aria-hidden>▶</span>
            </button>
            {isOpen && (
              <ul className="mb-2 ml-[1.35rem] border-l-2 border-[color:var(--line)] pl-2">
                {m.lessons.map((l) => {
                  const lp = lessonProgress(l, progress)
                  const active = route.lessonId === l.id
                  const icon = lp.done === lp.total ? '✅' : lp.done > 0 ? '◐' : l.checkpoint ? '🏁' : '○'
                  return (
                    <li key={l.id}>
                      <a
                        href={`#/learn/${m.id}/${l.id}`}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] ${
                          active ? 'bg-brand-50 font-extrabold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200' : 'font-semibold hover:bg-ink-100 dark:hover:bg-ink-800'
                        }`}
                      >
                        <span className={`w-5 shrink-0 text-center ${icon === '○' || icon === '◐' ? 'muted' : ''}`} aria-hidden>{icon}</span>
                        <span className="min-w-0 flex-1 truncate">{l.title}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}

      <div className="mt-auto pt-3">
        <a
          href="#/settings"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold ${route.view === 'settings' ? 'bg-ink-100 dark:bg-ink-800' : 'muted hover:bg-ink-100 dark:hover:bg-ink-800'}`}
        >
          <span aria-hidden>⚙️</span> Settings
        </a>
      </div>
    </nav>
  )
}
