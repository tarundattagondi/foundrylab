// Verifies every code lab: the reference solution passes all hidden tests and
// the starter code fails at least one. Uses your local python3 (+ numpy).
//   node scripts/verify-labs.mjs
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { ALL_ACTIVITIES } from '../src/data/curriculum.js'

const harness = readFileSync(new URL('../src/lib/harness.py', import.meta.url), 'utf8')
const labs = ALL_ACTIVITIES.filter((a) => a.type === 'code').map(({ id, starter, solution, tests }) => ({ id, starter, solution, tests }))

const driver = `${harness}
import json, sys
labs = json.loads(sys.stdin.read())
bad = 0
for lab in labs:
    tests = json.dumps(lab["tests"])
    sol = json.loads(fl_run(lab["solution"], tests, True))
    st = json.loads(fl_run(lab["starter"], tests, True))
    sol_ok = sol["error"] is None and all(t["passed"] for t in sol["tests"])
    st_fails = any(not t["passed"] for t in st["tests"])
    status = "ok " if sol_ok and st_fails else "BAD"
    if status == "BAD":
        bad += 1
    print(f"{status} {lab['id']:<22} solution {'passes' if sol_ok else 'FAILS'}; starter {'fails' if st_fails else 'PASSES'}")
    if not sol_ok:
        print("    ", sol["error"], [t for t in sol["tests"] if not t["passed"]])
print(f"\\n{len(labs)} labs, {bad} problems")
sys.exit(1 if bad else 0)
`
const r = spawnSync('python3', ['-c', driver], { input: JSON.stringify(labs), encoding: 'utf8' })
process.stdout.write(r.stdout)
process.stderr.write(r.stderr)
process.exit(r.status)
