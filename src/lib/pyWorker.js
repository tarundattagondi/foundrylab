// Web Worker that owns the Pyodide runtime. Running Python off the main thread
// keeps the UI responsive and lets us kill runaway code (infinite loops).
import harness from './harness.py?raw'

export const PYODIDE_VERSION = '0.28.3'
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

let pyodidePromise = null

function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const { loadPyodide } = await import(/* @vite-ignore */ `${INDEX_URL}pyodide.mjs`)
      const py = await loadPyodide({ indexURL: INDEX_URL })
      py.runPython(harness)
      return py
    })()
    pyodidePromise.catch(() => {
      pyodidePromise = null
    })
  }
  return pyodidePromise
}

self.onmessage = async (event) => {
  const { id, type, code = '', tests = [], check = false } = event.data
  try {
    const py = await getPyodide()
    if (type === 'warm') {
      self.postMessage({ id, ok: true })
      return
    }
    if (type === 'prepare') {
      // Fetch any packages (e.g. numpy) the code or tests import. Not timed.
      const all = [code, ...tests.map((t) => t.code)].join('\n')
      await py.loadPackagesFromImports(all, { messageCallback: () => {} })
      self.postMessage({ id, ok: true })
      return
    }
    if (type === 'trace') {
      const fn = py.globals.get('fl_trace')
      const raw = fn(code)
      fn.destroy()
      self.postMessage({ id, ok: true, result: JSON.parse(raw) })
      return
    }
    if (type === 'run') {
      const fn = py.globals.get('fl_run')
      const raw = fn(code, JSON.stringify(tests), check)
      fn.destroy()
      self.postMessage({ id, ok: true, result: JSON.parse(raw) })
    }
  } catch (err) {
    self.postMessage({ id, ok: false, error: String(err && err.message ? err.message : err) })
  }
}
