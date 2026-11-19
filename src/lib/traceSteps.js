// Turns raw tracer events (from fl_trace in harness.py) into friendly steps:
//   { line, depth, stack, stdout, title, details: [..], changed: Set, kind }
// Each "line" step shows the state AFTER that line ran, so learners see the effect.

const indentOf = (s) => s.match(/^\s*/)[0].length
const isCode = (s) => s.trim() && !s.trim().startsWith('#')

function bodyStart(lines, lineNo) {
  // First real line after `lineNo` that is indented deeper (the start of its block).
  const base = indentOf(lines[lineNo - 1] || '')
  for (let k = lineNo; k < lines.length; k++) {
    if (!isCode(lines[k])) continue
    return indentOf(lines[k]) > base ? k + 1 : null
  }
  return null
}

const fmtVal = (v) => (v ? v.repr : '?')
const frameLabel = (f, i) => (i === 0 ? 'Main program' : f.func === 'list comprehension' ? 'Inside the list comprehension' : `Inside ${f.func}()`)

function diffVars(before = {}, after = {}) {
  const out = []
  const changed = []
  for (const [k, v] of Object.entries(after)) {
    const b = before[k]
    if (!b) {
      changed.push(k)
      if (v.kind === 'function') out.push(`Python learns a new function called \`${k}\` (it doesn't run it yet, it just remembers the recipe).`)
      else if (v.kind === 'class') out.push(`Python learns a new class (blueprint) called \`${k}\`.`)
      else out.push(`New box \`${k}\` holds \`${fmtVal(v)}\`.`)
    } else if (b.repr !== v.repr) {
      changed.push(k)
      out.push(`\`${k}\` changed from \`${fmtVal(b)}\` to \`${fmtVal(v)}\`.`)
    }
  }
  return { notes: out, changed }
}

function printedText(before, after) {
  const p = (after || '').slice((before || '').length)
  return p.replace(/\n$/, '')
}

/** Explain a line that finished running (no function call inside, or after returning). */
function describe(lines, lineNo, before, after, printed, nextLine, func) {
  const text = (lines[lineNo - 1] || '').trim()
  const { notes, changed } = diffVars(before, after)
  const details = []
  const first = text.split(/[\s(:]/)[0]

  if (func === 'list comprehension') {
    const item = changed.map((k) => `\`${k}\` = \`${fmtVal(after[k])}\``).join(', ')
    details.push(item ? `Next item: ${item}. Its result goes into the new list.` : 'No more items, so the new list is complete.')
    return { details, changed }
  }

  if (first === 'for') {
    if (changed.length) details.push(`Next item from the loop: ${notes.join(' ')} Now the indented lines run with it.`)
    else details.push('There are no more items, so the loop is finished. Python moves on to the lines after it.')
    return { details, changed }
  }
  if (first === 'while') {
    const start = bodyStart(lines, lineNo)
    if (nextLine && start && nextLine === start) details.push('The condition is **True**, so the loop runs (again).')
    else details.push('The condition is **False** now, so the loop stops.')
    return { details: [...details, ...notes], changed }
  }
  if (first === 'if' || first === 'elif') {
    const start = bodyStart(lines, lineNo)
    if (nextLine && start && nextLine === start) details.push('The question is **True**, so Python goes into the indented lines below it.')
    else details.push('The question is **False**, so Python skips the indented lines below it.')
    return { details: [...details, ...notes], changed }
  }
  if (first === 'else:' || text === 'else:') details.push('None of the questions above were True, so Python runs the `else` part.')

  details.push(...notes)
  if (printed) details.push(`🖨️ Printed: **${printed.length > 120 ? printed.slice(0, 119) + '…' : printed}**`)
  if (first === 'import' || first === 'from') details.push('Python loads a toolbox of extra commands so we can use it below.')
  if (!details.length) details.push(first === 'return' ? '`return` works out the answer and sends it back to the line that called this function.' : 'Python ran this line. Nothing visible changed.')
  return { details, changed }
}

export function buildSteps(code, result) {
  const lines = code.replace(/\n$/, '').split('\n')
  const raw = result.events.filter((e) => !(e.kind === 'call' && e.stack.length === 1))
  // The module's final "return" marks the end; drop it from the event list.
  const E = raw.filter((e) => !(e.kind === 'return' && e.stack.length === 1))
  const depth = (e) => e.stack.length - 1
  const endEvent = { stack: [{ func: 'main', line: 0, vars: result.final || {} }], stdout: result.stdout }

  const nextSame = (i) => {
    const d = depth(E[i])
    for (let k = i + 1; k < E.length; k++) if (depth(E[k]) <= d) return k
    return -1
  }

  const steps = []
  const pending = [] // line steps waiting for a called function to come back

  const finishPending = (retIndex) => {
    const p = pending[pending.length - 1]
    if (!p || !(retIndex + 1 === p.j || (p.j === -1 && retIndex + 1 >= E.length))) return
    pending.pop()
    const after = p.j === -1 ? endEvent : E[p.j]
    const beforeVars = E[p.i].stack[p.d].vars
    const afterFrame = after.stack[Math.min(p.d, after.stack.length - 1)]
    const nextLine = p.j !== -1 && E[p.j].kind === 'line' && depth(E[p.j]) === p.d ? E[p.j].line : null
    const { details, changed } = describe(lines, p.line, beforeVars, afterFrame.vars, printedText(E[retIndex].stdout, after.stdout), nextLine, afterFrame.func)
    steps.push({ kind: 'finish', line: p.line, depth: p.d, stack: after.stack.slice(0, p.d + 1), stdout: after.stdout, title: `Back on line ${p.line}`, details, changed })
  }

  for (let i = 0; i < E.length; i++) {
    const e = E[i]
    const d = depth(e)
    const frame = e.stack[d]
    if (e.kind === 'line') {
      const j = nextSame(i)
      const nested = j === -1 ? i + 1 < E.length : j > i + 1
      if (nested) {
        const calleeComp = E[i + 1] && E[i + 1].stack[E[i + 1].stack.length - 1].func.endsWith('comprehension')
        const jumpMsg = calleeComp
          ? 'This line has a comprehension, so Python builds that list one item at a time first. Let\'s watch! ➡️'
          : 'This line calls a function, so Python jumps into that function first. Let\'s follow it! ➡️'
        steps.push({ kind: 'jump', line: e.line, depth: d, stack: e.stack, stdout: e.stdout, title: `Line ${e.line}`, details: [jumpMsg], changed: [] })
        pending.push({ i, j, d, line: e.line })
        continue
      }
      const after = j === -1 ? endEvent : E[j]
      const afterFrame = after.stack[Math.min(d, after.stack.length - 1)]
      const nextLine = j !== -1 && E[j].kind === 'line' && depth(E[j]) === d ? E[j].line : null
      const { details, changed } = describe(lines, e.line, frame.vars, afterFrame.vars, printedText(e.stdout, after.stdout), nextLine, frame.func)
      steps.push({ kind: 'line', line: e.line, depth: d, stack: after.stack.slice(0, d + 1).map((f, k) => (k === d ? afterFrame : f)), stdout: after.stdout, title: `Line ${e.line}`, details, changed })
    } else if (e.kind === 'call') {
      const isClass = (lines[e.line - 1] || '').trim().startsWith('class ')
      const args = Object.entries(frame.vars)
      const comp = frame.func.endsWith('comprehension')
      const what = isClass ? `Building the class (blueprint) \`${frame.func}\`.` : comp ? 'Running the comprehension, one item at a time.' : `Jumping into the function \`${frame.func}()\`.`
      const inputs = !isClass && !comp && args.length ? ` Its inputs: ${args.map(([k, v]) => `\`${k}\` = \`${v.repr}\``).join(', ')}.` : !isClass && !comp ? ' It has no inputs.' : ''
      const where = frame.func.endsWith('comprehension') ? `the ${frame.func}` : isClass ? `class ${frame.func}` : `${frame.func}()`
      steps.push({ kind: 'call', line: e.line, depth: d, stack: e.stack, stdout: e.stdout, title: `➡️ Into ${where}`, details: [what + inputs], changed: args.map(([k]) => k) })
    } else if (e.kind === 'return') {
      const isClass = (lines[(e.stack[d].line || 1) - 1] || '').trim().startsWith('class ') || /^[A-Z]/.test(frame.func)
      const msg = frame.func.endsWith('comprehension')
        ? `The comprehension is done. It made \`${e.value}\`.`
        : isClass
          ? `The blueprint \`${frame.func}\` is ready.`
          : `\`${frame.func}()\` is finished and gives back \`${e.value}\`. ↩️`
      const leaving = frame.func.endsWith('comprehension') ? `the ${frame.func}` : isClass ? `class ${frame.func}` : `${frame.func}()`
      steps.push({ kind: 'return', line: e.line, depth: d, stack: e.stack, stdout: e.stdout, title: `↩️ Leaving ${leaving}`, details: [msg], changed: [] })
      finishPending(i)
    } else if (e.kind === 'exception' && !steps.some((s) => s.kind === 'error')) {
      steps.push({ kind: 'error', line: e.line, depth: d, stack: e.stack, stdout: e.stdout, title: `💥 Error on line ${e.line}`, details: [`Python got stuck here: **${e.error}**`], changed: [] })
    }
  }

  steps.push({
    kind: 'end',
    line: null,
    depth: 0,
    stack: endEvent.stack,
    stdout: result.stdout,
    title: result.error ? '🛑 The program stopped with an error' : result.truncated ? '⏸️ Stopped after many steps' : '✅ Finished!',
    details: [
      result.error
        ? `${result.error.type}: ${result.error.message}`
        : result.truncated
          ? 'This program takes a LOT of steps, so we only show the first ones.'
          : 'Python reached the end of the code. These are the final values in every box.',
    ],
    changed: [],
  })
  return steps
}

export { frameLabel }
