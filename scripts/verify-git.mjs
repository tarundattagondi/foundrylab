// Plays every GitSim scenario with its hint commands and checks each step passes.
//   node scripts/verify-git.mjs
import { ALL_ACTIVITIES } from '../src/data/curriculum.js'
import { exec, initState, normalize } from '../src/lib/gitSim.js'

let bad = 0
for (const sim of ALL_ACTIVITIES.filter((a) => a.type === 'git')) {
  let s = initState(sim.setup)
  let step = 0
  for (const st of sim.steps) {
    // Hints look like 'cmd', 'cmd   (or alt)', or 'cmd1, then cmd2'.
    for (const cmd of st.hint.split(/\s{2,}\(/)[0].split(', then ')) {
      const r = exec(s, cmd)
      s = r.state
      while (step < sim.steps.length && sim.steps[step].check(s, normalize(cmd))) step++
    }
  }
  const ok = step === sim.steps.length
  if (!ok) bad++
  console.log(`${ok ? 'ok ' : 'BAD'} ${sim.id.padEnd(20)} ${step}/${sim.steps.length} steps`)
}
console.log(`\n${bad} problems`)
process.exit(bad ? 1 : 0)
