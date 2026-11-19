// Main-thread API for running Python. Pyodide is loaded lazily, exactly once,
// inside a worker, and stays warm for every lab after that.

const RUN_TIMEOUT_MS = 8000

let worker = null
let nextId = 1
const pending = new Map()
let readyPromise = null

let status = { state: 'idle', message: '' } // idle | loading | ready | error
const listeners = new Set()

function setStatus(state, message = '') {
  status = { state, message }
  listeners.forEach((l) => l(status))
}

export function getStatus() {
  return status
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function ensureWorker() {
  if (worker) return worker
  worker = new Worker(new URL('./pyWorker.js', import.meta.url), { type: 'module' })
  worker.onmessage = (e) => {
    const { id } = e.data
    const p = pending.get(id)
    if (!p) return
    pending.delete(id)
    e.data.ok ? p.resolve(e.data.result) : p.reject(new Error(e.data.error))
  }
  worker.onerror = (e) => {
    const err = new Error(e.message || 'The Python engine crashed.')
    pending.forEach((p) => p.reject(err))
    pending.clear()
    resetWorker()
    setStatus('error', 'Could not start the Python engine. Check your connection and try again.')
  }
  return worker
}

function resetWorker() {
  if (worker) worker.terminate()
  worker = null
  readyPromise = null
}

function send(msg) {
  const w = ensureWorker()
  const id = nextId++
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    w.postMessage({ ...msg, id })
  })
}

/** Start loading Pyodide (no-op if it's already loading or loaded). */
export function warmUp() {
  if (!readyPromise) {
    setStatus('loading', 'Warming up the Python engine…')
    readyPromise = send({ type: 'warm' })
      .then(() => setStatus('ready'))
      .catch((err) => {
        readyPromise = null
        setStatus('error', 'Could not load Python. Check your internet connection, then try again.')
        throw err
      })
  }
  return readyPromise
}

/**
 * Run code (and optionally hidden tests).
 * Resolves to { stdout, error, tests } or { timeout: true }.
 * With { trace: true } it resolves to the raw step-by-step trace (see fl_trace in harness.py).
 */
export async function runPython(code, { tests = [], check = false, trace = false } = {}) {
  await warmUp()
  if (/^\s*(import|from)\s+numpy/m.test(code) || tests.some((t) => /numpy/.test(t.code))) {
    setStatus('loading', 'Fetching NumPy (first time only)…')
  }
  await send({ type: 'prepare', code, tests })
  setStatus('ready')

  const runId = nextId
  let timer
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => {
      const p = pending.get(runId)
      pending.delete(runId)
      resetWorker()
      setStatus('idle')
      if (p) p.resolve(null)
      resolve({ timeout: true })
    }, RUN_TIMEOUT_MS)
  })
  const run = send(trace ? { type: 'trace', code } : { type: 'run', code, tests, check })
  const result = await Promise.race([run, timeout])
  clearTimeout(timer)
  return result || { timeout: true }
}

const EXPLANATIONS = {
  SyntaxError: "Python couldn't read this line. Look for a missing colon, bracket, or quote.",
  IndentationError: 'The spacing at the start of a line is off. Python uses indentation to group code.',
  TabError: 'Tabs and spaces got mixed. Stick to spaces (4 per level).',
  NameError: "Python doesn't know that name yet. Check the spelling, or define it before you use it.",
  TypeError: "An operation got a value of the wrong type (like adding a number to None). Did a function forget to return something?",
  ValueError: 'The type was right but the value was not (like float("banana")).',
  IndexError: "You asked for a position that doesn't exist in the list. Remember indexes start at 0.",
  KeyError: "That key isn't in the dictionary. Check the spelling or use .get().",
  AttributeError: "That object doesn't have the attribute or method you asked for. Did you set it on self?",
  ZeroDivisionError: 'Something got divided by zero. Guard against empty inputs.',
  ModuleNotFoundError: "That package isn't available here. FoundryLab supports the standard library and NumPy.",
  ImportError: "Python couldn't import that. Double-check the name.",
  RecursionError: 'A function kept calling itself forever. Make sure there is a stopping case.',
  FileNotFoundError: "That file doesn't exist yet. Did you write it first, and use the same path?",
  AssertionError: 'An assert statement failed: a check in the code was not true.',
  UnboundLocalError: 'A variable was used inside a function before it was given a value there.',
}

export function explainError(type) {
  return EXPLANATIONS[type] || 'Python hit a snag. Read the last line of the traceback; it usually names the problem.'
}
