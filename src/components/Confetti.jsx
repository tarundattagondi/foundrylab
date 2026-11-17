import { useEffect, useRef, useState } from 'react'
import { onCelebrate } from '../lib/events'

const CHEERS = [
  'Nailed it! 🎉',
  'Look at you go! 🚀',
  'Clean pass. Chef\'s kiss. 👌',
  'Your future model thanks you. 🤖',
  'That\'s the stuff! ⚡',
  'Gradient: pointing straight at greatness. 📈',
  'Another one forged in the Foundry. 🔥',
]

const COLORS = ['#fb5b14', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6']

function burst(canvas, big) {
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const w = (canvas.width = window.innerWidth * dpr)
  const h = (canvas.height = window.innerHeight * dpr)
  const n = big ? 260 : 120
  const parts = Array.from({ length: n }, () => ({
    x: w / 2 + (Math.random() - 0.5) * w * 0.3,
    y: h * 0.35,
    vx: (Math.random() - 0.5) * 22 * dpr,
    vy: (-Math.random() * 18 - 6) * dpr,
    s: (Math.random() * 6 + 4) * dpr,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.4,
    c: COLORS[(Math.random() * COLORS.length) | 0],
  }))
  let frame = 0
  let raf
  const tick = () => {
    ctx.clearRect(0, 0, w, h)
    parts.forEach((p) => {
      p.vy += 0.5 * dpr
      p.vx *= 0.99
      p.x += p.vx
      p.y += p.vy
      p.r += p.vr
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)
      ctx.fillStyle = p.c
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2)
      ctx.restore()
    })
    frame++
    if (frame < 150) raf = requestAnimationFrame(tick)
    else ctx.clearRect(0, 0, w, h)
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

export default function Confetti() {
  const canvasRef = useRef(null)
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    let stop = () => {}
    let timer
    const off = onCelebrate((p) => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!reduced && canvasRef.current) {
        stop()
        stop = burst(canvasRef.current, Boolean(p.moduleDone))
      }
      if (p.moduleDone) setModal(p)
      setToast({ ...p, cheer: p.message || CHEERS[(Math.random() * CHEERS.length) | 0], key: Date.now() })
      clearTimeout(timer)
      timer = setTimeout(() => setToast(null), 4200)
    })
    return () => {
      off()
      stop()
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[60] h-full w-full" aria-hidden />

      {toast && (
        <div
          key={toast.key}
          role="status"
          className="card fixed inset-x-4 z-[61] mx-auto max-w-sm animate-pop p-4 sm:inset-x-auto sm:right-6"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)' }}
        >
          <p className="font-extrabold">{toast.cheer}</p>
          <div className="mt-1 flex flex-wrap gap-2 text-sm">
            {toast.xpGained > 0 && <span className="chip bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">+{toast.xpGained} XP</span>}
            {toast.levelUp && <span className="chip bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Level {toast.levelUp.level}: {toast.levelUp.title}!</span>}
            {toast.newBadges?.map((b) => (
              <span key={b.id} className="chip bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">{b.emoji} {b.name}</span>
            ))}
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[62] grid place-items-center bg-black/40 p-4" onClick={() => setModal(null)}>
          <div className="card w-full max-w-md animate-pop p-6 text-center" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="text-6xl" aria-hidden>{modal.moduleDone.badge.emoji}</div>
            <h2 className="mt-3 text-2xl font-black">Module complete!</h2>
            <p className="muted mt-1">
              You finished <strong className="text-[color:var(--ink)]">{modal.moduleDone.title}</strong> and earned the{' '}
              <strong className="text-[color:var(--ink)]">{modal.moduleDone.badge.name}</strong> badge.
            </p>
            <p className="mt-3 text-sm">Every expert started exactly where you are. Keep forging. 🔥</p>
            <button className="btn-primary mt-5" onClick={() => setModal(null)}>Onward!</button>
          </div>
        </div>
      )}
    </>
  )
}
