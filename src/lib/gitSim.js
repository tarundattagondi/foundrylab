// A small, forgiving git simulator. Pure functions: exec(state, input) returns
// the next state plus terminal output. Not real git, just enough to practice.

const hex = () => Math.random().toString(16).slice(2, 9).padEnd(7, '0')
const commit = (msg) => ({ hash: hex(), msg })

export function initState(setup = {}) {
  const branches = {}
  for (const [name, msgs] of Object.entries(setup.branches || (setup.initialized ? { main: [] } : {}))) {
    branches[name] = msgs.map(commit)
  }
  // Branches that share a first message share the same root commit.
  const roots = {}
  for (const list of Object.values(branches)) {
    if (!list[0]) continue
    roots[list[0].msg] ||= list[0]
    list[0] = roots[list[0].msg]
  }
  return {
    initialized: Boolean(setup.initialized),
    files: { ...(setup.files || {}) },
    branch: 'main',
    branches,
    remote: setup.remote || null,
    remoteCount: 0,
    pushed: false,
    pulled: false,
    teammatePending: false,
    merging: false,
    conflict: false,
    conflictWith: setup.conflictWith || null,
    conflictFile: setup.conflictFile || null,
    ignore: [],
  }
}

function tokenize(input) {
  const out = []
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g
  let m
  while ((m = re.exec(input))) out.push(m[1] ?? m[2] ?? m[3])
  return out
}

export function normalize(input) {
  return input.trim().replace(/^\$\s*/, '').replace(/\s+/g, ' ')
}

const isIgnored = (s, f) => s.ignore.some((p) => p === f || p === f.replace(/\/$/, '') || p.replace(/\/$/, '') === f.replace(/\/$/, ''))

const clone = (s) => ({ ...s, files: { ...s.files }, branches: Object.fromEntries(Object.entries(s.branches).map(([k, v]) => [k, [...v]])), ignore: [...s.ignore] })

const HELP = [
  'Commands this sandbox understands:',
  '  git init | status | add | commit -m "msg" | log [--oneline]',
  '  git branch [name] | checkout [-b] name | switch [-c] name | merge name',
  '  git clone url | push | pull | remote -v',
  '  ls | touch file | cat file | echo "text" >> file | code file',
  '  hint   - get a nudge for the current step',
  '  clear  - clear the screen',
]

/** Returns { state, lines: [{ text, kind }] , clear? } */
export function exec(prev, rawInput) {
  const input = normalize(rawInput)
  const s = clone(prev)
  const lines = []
  const out = (text, kind = 'out') => text.split('\n').forEach((t) => lines.push({ text: t, kind }))
  const err = (text) => out(text, 'err')
  const done = () => ({ state: s, lines })

  if (!input) return done()
  const args = tokenize(input)
  const [cmd, sub, ...rest] = args

  if (cmd === 'help') return out(HELP.join('\n')), done()
  if (cmd === 'clear') return { state: s, lines, clear: true }
  if (cmd === 'pwd') return out('/home/you/project'), done()
  if (cmd === 'cd') return out('(you can stay right here, everything happens in this folder)'), done()
  if (cmd === 'ls') {
    const names = Object.keys(s.files).filter((f) => args.includes('-a') || !f.startsWith('.') || f === '.gitignore')
    out(names.length ? names.join('  ') : '(empty folder)')
    return done()
  }
  if (cmd === 'touch') {
    if (!sub) return err('touch: missing file name, e.g. touch notes.md'), done()
    for (const f of [sub, ...rest]) {
      if (!(f in s.files)) s.files[f] = 'untracked'
    }
    return done()
  }
  if (cmd === 'echo') {
    const redirect = args.findIndex((a) => a === '>>' || a === '>')
    if (redirect === -1) return out(args.slice(1).join(' ')), done()
    const text = args.slice(1, redirect).join(' ')
    const file = args[redirect + 1]
    if (!file) return err('echo: where should that go? e.g. echo ".venv/" >> .gitignore'), done()
    if (file === '.gitignore') {
      if (args[redirect] === '>') s.ignore = []
      s.ignore.push(text.trim())
    }
    s.files[file] = s.files[file] === 'committed' ? 'modified' : s.files[file] === 'staged' ? 'modified' : s.files[file] || 'untracked'
    return done()
  }
  if (cmd === 'cat') {
    if (!sub) return err('cat: which file?'), done()
    if (!(sub in s.files)) return err(`cat: ${sub}: No such file or directory`), done()
    if (sub === s.conflictFile && s.conflict) {
      out(`<<<<<<< HEAD\nlr = 0.01\n=======\nlr = 0.001\n>>>>>>> ${s.conflictWith}`, 'warn')
      out('↑ Both branches changed this line. Open the file to choose one.', 'note')
    } else if (sub === '.gitignore') {
      out(s.ignore.join('\n') || '(empty)')
    } else if (sub === s.conflictFile) {
      out('lr = 0.001')
    } else {
      out(`# ${sub}\n# (pretend there's brilliant code in here)`)
    }
    return done()
  }
  if (['code', 'nano', 'vim', 'vi', 'edit', 'open'].includes(cmd)) {
    if (!sub) return err(`${cmd}: which file?`), done()
    if (!(sub in s.files)) s.files[sub] = 'untracked'
    if (sub === s.conflictFile && s.conflict) {
      s.conflict = false
      out(`Opened ${sub}… kept "lr = 0.001", deleted the <<<<<<< ======= >>>>>>> markers. Saved ✔`, 'note')
      return done()
    }
    if (s.files[sub] === 'committed' || s.files[sub] === 'staged') s.files[sub] = 'modified'
    out(`(pretend you edited ${sub}, saved ✔)`, 'note')
    return done()
  }
  if (cmd !== 'git') {
    err(`command not found: ${cmd}`)
    out('This sandbox speaks git (plus ls, touch, cat, echo, code). Type help or hint.', 'note')
    return done()
  }

  // ── git ─────────────────────────────────────────────────────────────────
  if (!sub || sub === 'help') return out(HELP.join('\n')), done()
  if (sub === '--version' || sub === 'version') return out('git version 2.53.0 (FoundryLab sandbox)'), done()

  if (sub === 'init') {
    if (s.initialized) return out('Reinitialized existing Git repository in /home/you/project/.git/'), done()
    s.initialized = true
    s.branches = { main: [] }
    s.branch = 'main'
    out('Initialized empty Git repository in /home/you/project/.git/')
    return done()
  }

  if (sub === 'clone') {
    const url = rest[0]
    if (!url) return err('fatal: You must specify a repository to clone.'), done()
    const name = url.replace(/\/$/, '').split('/').pop().replace(/\.git$/, '') || 'repo'
    s.initialized = true
    s.remote = url
    s.files = { 'README.md': 'committed', 'model.py': 'committed', 'tokenizer.py': 'committed' }
    s.branches = { main: [commit('Initial commit'), commit('Add model'), commit('Add tokenizer')] }
    s.branch = 'main'
    s.remoteCount = 3
    out(`Cloning into '${name}'...\nremote: Enumerating objects: 12, done.\nReceiving objects: 100% (12/12), done.`)
    out(`(you're now inside ${name}/)`, 'note')
    return done()
  }

  if (!s.initialized) {
    err('fatal: not a git repository (or any of the parent directories): .git')
    out('Tip: start one with git init (or git clone a repo).', 'note')
    return done()
  }

  const current = s.branches[s.branch] || (s.branches[s.branch] = [])

  if (sub === 'status') {
    out(`On branch ${s.branch}`)
    const by = (st) => Object.keys(s.files).filter((f) => s.files[f] === st && !isIgnored(s, f))
    if (s.merging) {
      out('You have unmerged paths.\n  (fix conflicts and run "git commit")')
      if (s.files[s.conflictFile] === 'conflicted') out(`Unmerged paths:\n\tboth modified:   ${s.conflictFile}`, 'err')
    }
    const staged = by('staged')
    const modified = [...by('modified'), ...(s.merging ? [] : by('conflicted'))]
    const untracked = by('untracked')
    if (staged.length) out('Changes to be committed:\n' + staged.map((f) => `\tnew/changed:  ${f}`).join('\n'), 'good')
    if (modified.length) out('Changes not staged for commit:\n' + modified.map((f) => `\tmodified:     ${f}`).join('\n'), 'err')
    if (untracked.length) out('Untracked files:\n  (use "git add <file>..." to include in what will be committed)\n' + untracked.map((f) => `\t${f}`).join('\n'), 'err')
    if (!staged.length && !modified.length && !untracked.length && !s.merging) out('nothing to commit, working tree clean')
    return done()
  }

  if (sub === 'add') {
    if (!rest.length) return err('Nothing specified, nothing added.\nMaybe you wanted to say \'git add .\'?'), done()
    const all = rest.some((r) => r === '.' || r === '-A' || r === '--all')
    const targets = all ? Object.keys(s.files).filter((f) => !isIgnored(s, f)) : rest
    for (const f of targets) {
      if (!(f in s.files)) {
        err(`fatal: pathspec '${f}' did not match any files`)
        continue
      }
      if (isIgnored(s, f)) {
        err(`The following paths are ignored by one of your .gitignore files:\n${f}`)
        continue
      }
      if (f === s.conflictFile && s.conflict) {
        s.conflict = false
        out('(heads-up: in real life, delete the <<<<<<< ======= >>>>>>> markers before adding!)', 'note')
      }
      if (s.files[f] !== 'committed') s.files[f] = 'staged'
    }
    return done()
  }

  if (sub === 'commit') {
    const mi = rest.findIndex((r) => r === '-m' || r === '-am')
    if (rest.includes('-am') || rest.includes('-a')) {
      Object.keys(s.files).forEach((f) => s.files[f] === 'modified' && (s.files[f] = 'staged'))
    }
    const msg = mi >= 0 ? rest[mi + 1] : null
    if (s.merging) {
      if (s.conflict || s.files[s.conflictFile] === 'conflicted') {
        err('error: Committing is not possible because you have unmerged files.')
        out('Fix the file, then git add it.', 'note')
        return done()
      }
      Object.keys(s.files).forEach((f) => s.files[f] === 'staged' && (s.files[f] = 'committed'))
      const c = commit(msg || `Merge branch '${s.conflictWith}'`)
      current.push(c)
      s.merging = false
      out(`[${s.branch} ${c.hash}] ${c.msg}`)
      out('Merge complete. Conflict conquered. 🏆', 'good')
      return done()
    }
    const staged = Object.keys(s.files).filter((f) => s.files[f] === 'staged')
    if (!staged.length) {
      out(`On branch ${s.branch}\nnothing added to commit`)
      out('Stage something first with git add <file>.', 'note')
      return done()
    }
    if (!msg) {
      err('Aborting commit due to empty commit message.')
      out('Add a message: git commit -m "Describe your change"', 'note')
      return done()
    }
    staged.forEach((f) => (s.files[f] = 'committed'))
    const c = commit(msg)
    current.push(c)
    out(`[${s.branch}${current.length === 1 ? ' (root-commit)' : ''} ${c.hash}] ${msg}\n ${staged.length} file${staged.length > 1 ? 's' : ''} changed`)
    return done()
  }

  if (sub === 'log') {
    if (!current.length) return err(`fatal: your current branch '${s.branch}' does not have any commits yet`), done()
    const oneline = rest.includes('--oneline')
    ;[...current].reverse().forEach((c, i) => {
      const head = i === 0 ? ` (HEAD -> ${s.branch})` : ''
      if (oneline) out(`${c.hash}${head} ${c.msg}`, i === 0 ? 'good' : 'out')
      else out(`commit ${c.hash}${head}\nAuthor: You <you@foundrylab.dev>\n\n    ${c.msg}\n`, i === 0 ? 'good' : 'out')
    })
    return done()
  }

  const createBranch = (name) => {
    if (s.branches[name]) {
      err(`fatal: a branch named '${name}' already exists`)
      return false
    }
    s.branches[name] = [...current]
    return true
  }
  const switchTo = (name) => {
    if (!s.branches[name]) {
      err(`error: pathspec '${name}' did not match any branch`)
      out(`To create it: git checkout -b ${name}`, 'note')
      return
    }
    s.branch = name
    out(`Switched to branch '${name}'`)
  }

  if (sub === 'branch') {
    if (!rest.length) {
      Object.keys(s.branches).forEach((b) => out(`${b === s.branch ? '* ' : '  '}${b}`, b === s.branch ? 'good' : 'out'))
      return done()
    }
    if (rest[0] === '-d' || rest[0] === '-D') {
      const name = rest[1]
      if (name === s.branch) return err(`error: Cannot delete branch '${name}' checked out`), done()
      if (!s.branches[name]) return err(`error: branch '${name}' not found.`), done()
      delete s.branches[name]
      out(`Deleted branch ${name}.`)
      return done()
    }
    createBranch(rest[0])
    return done()
  }

  if (sub === 'checkout' || sub === 'switch') {
    const flag = rest[0]
    if ((sub === 'checkout' && flag === '-b') || (sub === 'switch' && (flag === '-c' || flag === '--create'))) {
      const name = rest[1]
      if (!name) return err('error: missing branch name'), done()
      if (createBranch(name)) {
        s.branch = name
        out(`Switched to a new branch '${name}'`)
      }
      return done()
    }
    if (!flag) return err('error: which branch?'), done()
    switchTo(flag)
    return done()
  }

  if (sub === 'merge') {
    const name = rest[0]
    if (!name) return err('fatal: No remote for the current branch. Name a branch: git merge <branch>'), done()
    if (!s.branches[name]) return err(`merge: ${name} - not something we can merge`), done()
    if (name === s.branch) return out('Already up to date.'), done()
    if (name === s.conflictWith && !s.merging && !current.some((c) => c.msg.startsWith('Merge'))) {
      s.merging = true
      s.conflict = true
      s.files[s.conflictFile] = 'conflicted'
      out(`Auto-merging ${s.conflictFile}`)
      err(`CONFLICT (content): Merge conflict in ${s.conflictFile}\nAutomatic merge failed; fix conflicts and then commit the result.`)
      out("Don't panic, this is normal. Let's look at the file.", 'note')
      return done()
    }
    const other = s.branches[name]
    const newOnes = other.filter((c) => !current.includes(c))
    if (!newOnes.length) return out('Already up to date.'), done()
    const fastForward = current.every((c) => other.includes(c))
    if (fastForward) {
      s.branches[s.branch] = [...other]
      out(`Updating ${current.at(-1)?.hash || '0000000'}..${other.at(-1).hash}\nFast-forward\n ${newOnes.length} commit${newOnes.length > 1 ? 's' : ''} merged`)
    } else {
      current.push(...newOnes, commit(`Merge branch '${name}'`))
      out(`Merge made by the 'ort' strategy.`)
    }
    return done()
  }

  if (sub === 'remote') {
    if (!s.remote) return done()
    out(`origin\t${s.remote} (fetch)\norigin\t${s.remote} (push)`)
    return done()
  }

  if (sub === 'push') {
    if (!s.remote) {
      err('fatal: No configured push destination.')
      out('This repo has no remote. (In the clone lesson you get one automatically.)', 'note')
      return done()
    }
    if (current.length <= s.remoteCount) return out('Everything up-to-date'), done()
    const from = current[s.remoteCount - 1]?.hash || '0000000'
    s.remoteCount = current.length
    s.pushed = true
    s.teammatePending = true
    out(`To ${s.remote}\n   ${from}..${current.at(-1).hash}  ${s.branch} -> ${s.branch}`)
    out('🔔 Meanwhile, a teammate just pushed a fix to main…', 'note')
    return done()
  }

  if (sub === 'pull') {
    if (!s.remote) return err('fatal: No remote repository specified.'), done()
    if (!s.teammatePending) return out('Already up to date.'), done()
    const c = commit('Fix tokenizer bug (teammate)')
    current.push(c)
    s.remoteCount = current.length
    s.teammatePending = false
    s.pulled = true
    out(`From ${s.remote}\nUpdating ..${c.hash}\nFast-forward\n tokenizer.py | 4 ++--\n 1 file changed`)
    return done()
  }

  err(`git: '${sub}' is not a git command. See 'help'.`)
  return done()
}
