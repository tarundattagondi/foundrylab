// Tiny pub/sub so any component can trigger celebrations (confetti, toasts).
const listeners = new Set()

export function onCelebrate(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function celebrate(payload) {
  listeners.forEach((fn) => fn(payload))
}
