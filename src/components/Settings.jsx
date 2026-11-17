import { useState } from 'react'
import { resetProgress, setTheme, useProgress, overallProgress } from '../lib/progress'
import usePyStatus from './usePyStatus'

function storageWorks() {
  try {
    localStorage.setItem('foundrylab:test', '1')
    localStorage.removeItem('foundrylab:test')
    return true
  } catch {
    return false
  }
}

export default function Settings() {
  const progress = useProgress()
  const py = usePyStatus()
  const [confirming, setConfirming] = useState(false)
  const [wiped, setWiped] = useState(false)
  const overall = overallProgress(progress)

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-16">
      <h1 className="text-3xl font-black">Settings</h1>

      <section className="card p-5">
        <h2 className="font-black">Theme</h2>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Theme">
          {[
            ['light', '☀️ Light'],
            ['dark', '🌙 Dark'],
            [null, '💻 System'],
          ].map(([val, label]) => (
            <button
              key={label}
              role="radio"
              aria-checked={progress.theme === val}
              onClick={() => setTheme(val)}
              className={progress.theme === val ? 'btn-primary' : 'btn-ghost'}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-black">About this browser</h2>
        <ul className="muted mt-2 space-y-1 text-sm">
          <li>Progress saving: {storageWorks() ? '✅ on (localStorage)' : '⚠️ blocked, so progress lasts until you close the tab'}</li>
          <li>Python engine: {py.state === 'ready' ? '✅ warmed up' : py.state === 'loading' ? '⏳ loading…' : py.state === 'error' ? '⚠️ failed to load' : '💤 loads when you open your first code lab'}</li>
          <li>Everything runs locally. No accounts, no servers, no tracking.</li>
        </ul>
      </section>

      <section className="card border-rose-200 p-5 dark:border-rose-900">
        <h2 className="font-black">Reset progress</h2>
        <p className="muted mt-1 text-sm">Clears XP, streak, badges, completed labs, quiz scores and saved code. Your theme is kept.</p>
        {wiped && <p className="mt-3 text-sm font-bold text-emerald-700 dark:text-emerald-300">Fresh start! Everything's reset. 🌱</p>}
        {!confirming ? (
          <button className="btn-ghost mt-3 text-rose-600 dark:text-rose-400" onClick={() => { setConfirming(true); setWiped(false) }}>
            Reset progress…
          </button>
        ) : (
          <div className="mt-3 animate-pop rounded-xl border border-rose-300 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-900/20">
            <p className="text-sm font-bold">
              Are you sure? You'll lose {progress.xp} XP and {overall.done} completed activit{overall.done === 1 ? 'y' : 'ies'}. This can't be undone.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="btn bg-rose-600 text-white hover:bg-rose-700"
                onClick={() => {
                  resetProgress()
                  setConfirming(false)
                  setWiped(true)
                }}
              >
                Yes, reset everything
              </button>
              <button className="btn-ghost" onClick={() => setConfirming(false)} autoFocus>Keep my progress</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
