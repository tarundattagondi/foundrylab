// Verifies curriculum content with your local python3 (+ numpy):
//   • every code lab: the reference solution passes all hidden tests, the starter fails at least one
//   • every { tryit } example in the learn pages runs without an error (unless it sets expectError)
//   • every { quick } / quiz question has a valid answer index
//
//   node scripts/verify-labs.mjs            # all modules
//   node scripts/verify-labs.mjs python     # just src/data/modules/python.js
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const only = process.argv[2]
let modules
if (only) {
  modules = [(await import(`../src/data/modules/${only}.js`)).default]
} else {
  modules = (await import('../src/data/curriculum.js')).MODULES
}

const harness = readFileSync(new URL('../src/lib/harness.py', import.meta.url), 'utf8')
const labs = []
const tryits = []
const problems = []
const ids = new Set()

for (const m of modules) {
  for (const l of m.lessons) {
    if (ids.has(l.id)) problems.push(`duplicate lesson id ${l.id}`)
    ids.add(l.id)
    if (!Array.isArray(l.learn) || !l.learn.length) problems.push(`${l.id}: missing learn pages`)
    ;(l.learn || []).forEach((page, pi) => {
      if (!page.title || !Array.isArray(page.blocks)) problems.push(`${l.id} page ${pi + 1}: needs title and blocks`)
      ;(page.blocks || []).forEach((b, bi) => {
        const where = `${l.id} p${pi + 1} b${bi + 1}`
        if (b && b.tryit) tryits.push({ where, code: b.tryit, expectError: Boolean(b.expectError) })
        if (b && b.quick && !(b.quick.answer >= 0 && b.quick.answer < b.quick.options.length)) problems.push(`${where}: quick answer out of range`)
      })
    })
    for (const a of l.activities) {
      if (ids.has(a.id)) problems.push(`duplicate activity id ${a.id}`)
      ids.add(a.id)
      if (a.type === 'code') labs.push({ id: a.id, starter: a.starter, solution: a.solution, tests: a.tests })
      if (a.type === 'quiz') a.questions.forEach((q, i) => !(q.answer >= 0 && q.answer < q.options.length) && problems.push(`${a.id} q${i + 1}: answer out of range`))
    }
  }
}

const driver = `${harness}
import json, sys
data = json.loads(sys.stdin.read())
bad = 0
for lab in data["labs"]:
    tests = json.dumps(lab["tests"])
    sol = json.loads(fl_run(lab["solution"], tests, True))
    st = json.loads(fl_run(lab["starter"], tests, True))
    sol_ok = sol["error"] is None and all(t["passed"] for t in sol["tests"])
    st_fails = any(not t["passed"] for t in st["tests"])
    if not (sol_ok and st_fails):
        bad += 1
        print(f"BAD lab {lab['id']}: solution {'passes' if sol_ok else 'FAILS'}; starter {'fails' if st_fails else 'PASSES'}")
        if not sol_ok:
            print("    ", sol["error"], [t for t in sol["tests"] if not t["passed"]])
for t in data["tryits"]:
    r = json.loads(fl_run(t["code"]))
    errored = r["error"] is not None
    if errored != t["expectError"]:
        bad += 1
        print(f"BAD tryit {t['where']}: {'error ' + str(r['error']['type']) + ': ' + r['error']['message'] if errored else 'expected an error but it ran fine'}")
print(f"{len(data['labs'])} labs, {len(data['tryits'])} try-it examples checked")
sys.exit(1 if bad else 0)
`
const r = spawnSync('python3', ['-c', driver], { input: JSON.stringify({ labs, tryits }), encoding: 'utf8' })
process.stdout.write(r.stdout)
process.stderr.write(r.stderr)
problems.forEach((p) => console.log('BAD', p))
const ok = r.status === 0 && !problems.length
console.log(ok ? 'All good ✓' : 'Problems found ✗')
process.exit(ok ? 0 : 1)
