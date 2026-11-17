import { XP } from '../helpers.js'

// Joins lines into one string, handy for terminal sessions in { code } blocks.
const lines = (...l) => l.join('\n')

// GitSim state (see src/lib/gitSim.js): { initialized, files: {name: 'untracked'|'modified'|'staged'|'committed'|'conflicted'},
//   branch, branches: {name: [commit]}, remote, pushed, pulled, merging, conflict, ignore: [] }

export default {
  id: 'git',
  title: 'Git & GitHub',
  emoji: '🌿',
  tagline: 'Save, branch, share, and collaborate, without fear.',
  badge: { id: 'mod-git', name: 'Version Wizard', emoji: '🌿' },
  lessons: [
    // ─────────────────────────────── 1. What is version control? ───────────────────────────────
    {
      id: 'git-why',
      title: 'What is version control?',
      minutes: 5,
      learn: [
        {
          title: 'The “final_FINAL” problem',
          blocks: [
            { big: 'Have you ever had a folder that looks like this? 😅' },
            {
              code: lines(
                'story.docx',
                'story_v2.docx',
                'story_final.docx',
                'story_final_REALLY_final.docx',
                'story_final_REALLY_final_fixed.docx',
              ),
            },
            'People make copies like this because they are scared of losing a good version. But soon nobody knows which file is the newest, or what changed between them.',
            'Programmers had this exact problem, but with *thousands* of files. So they invented a better way.',
          ],
        },
        {
          title: 'Save points, like in a video game',
          blocks: [
            { analogy: 'In a video game, you reach a **save point** before the scary boss. If things go badly, you load the save and try again. Nothing is lost!', emoji: '🎮' },
            '**Version control** gives your project save points. Each save point remembers *every file* exactly as it was at that moment.',
            'You can look back at any old save point, see what changed, and even go back in time if you break something.',
            { tip: 'You only keep **one** copy of each file. Git quietly remembers all the old versions for you.' },
          ],
        },
        {
          title: 'Meet Git',
          blocks: [
            '**Git** is the most popular version control tool in the world. Almost every AI project, including the code behind ChatGPT-style models, uses Git.',
            { list: [
              'Git runs on **your computer**.',
              'It watches a folder you choose.',
              'When you say so, it takes a snapshot (a save point) of that folder.',
            ] },
            { words: [
              ['version control', 'a way to keep every saved version of your project'],
              ['Git', 'the tool programmers use for version control'],
              ['snapshot', 'a picture of all your files at one moment in time'],
            ] },
          ],
        },
        {
          title: 'Why should an AI learner care?',
          blocks: [
            { steps: [
              '**Undo mistakes.** Broke your code? Jump back to the last save point.',
              '**Try ideas safely.** Test a wild new idea without wrecking the version that works.',
              '**Work with friends.** Many people can work on the same project at once.',
              '**Share your work.** Put your projects online (on GitHub) so others, like future employers, can see them.',
            ] },
            { quick: { q: 'What is the main job of version control?', options: ['Make your computer faster', 'Keep save points of your project so nothing is lost', 'Write code for you', 'Delete old files'], answer: 1, explain: 'Version control remembers every saved version, like save points in a game.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { big: 'You just learned why programmers love Git! 🌿' },
            { list: [
              'Making copies like *story_final_v2* gets messy fast.',
              'Version control keeps **save points** of your whole project.',
              '**Git** is the tool that does it, and almost everyone uses it.',
              'It helps you undo mistakes, try ideas, and work with others.',
            ] },
          ],
        },
      ],
      activities: [
        {
          type: 'quiz',
          id: 'git-why-quiz',
          title: 'Why version control?',
          xp: XP.quiz,
          questions: [
            { q: 'Which video-game idea is most like a Git snapshot?', options: ['A power-up', 'A save point', 'A high score', 'A boss fight'], answer: 1, explain: 'A save point remembers everything at one moment so you can go back to it.' },
            { q: 'With Git, how many copies of `story.txt` do you keep in your folder?', options: ['One: Git remembers the old versions for you', 'One per day', 'As many as you like', 'None'], answer: 0, explain: 'You keep one file. Git stores the history behind the scenes.' },
            { q: 'Which is NOT a reason to use Git?', options: ['Undoing mistakes', 'Working with friends', 'Making your internet faster', 'Trying ideas safely'], answer: 2, explain: 'Git has nothing to do with internet speed. It is all about saving and sharing versions.' },
          ],
        },
      ],
    },

    // ─────────────────────────────── 2. The terminal ───────────────────────────────
    {
      id: 'git-terminal',
      title: 'The terminal: typing commands',
      minutes: 6,
      learn: [
        {
          title: 'What is a terminal?',
          blocks: [
            'Usually you use a computer by clicking: click a folder, click a file. A **terminal** is a different way: you **type** what you want, and the computer types back.',
            { analogy: 'It is like texting the computer. You send a short message (a **command**), and it replies.', emoji: '💬' },
            'Git is mostly used from the terminal, so let’s get comfy with it first. Don’t worry. You can’t break anything here. FoundryLab’s terminal is a safe pretend one!',
          ],
        },
        {
          title: 'How to read a terminal line',
          blocks: [
            'A terminal line looks like this:',
            { code: 'you@foundry ~/project $ ls' },
            { table: { head: ['Part', 'What it means'], rows: [
              ['`you@foundry`', 'who you are and which computer'],
              ['`~/project`', 'which folder you are in right now'],
              ['`$`', 'the **prompt**: “I’m ready, type something!”'],
              ['`ls`', 'the command *you* typed'],
            ] } },
            'You type after the `$` and press **Enter**. The computer’s answer appears on the next lines.',
          ],
        },
        {
          title: 'ls: look around',
          blocks: [
            '`ls` is short for **list**. It shows the files in the folder you are in.',
            { code: lines('$ ls', 'notes.txt  homework.py') },
            { list: ['Line 1: you typed `ls`.', 'Line 2: the computer answered. There are two files here.'] },
            { tip: 'Commands are short because programmers type them a LOT. `ls` = list.' },
          ],
        },
        {
          title: 'touch: make a new empty file',
          blocks: [
            '`touch` followed by a name makes a brand-new, empty file.',
            { code: lines('$ touch hello.txt', '$ ls', 'hello.txt  notes.txt  homework.py') },
            { steps: ['`touch hello.txt` made the file. (The computer says nothing; silence means “done!”)', '`ls` shows it is now in the folder.'] },
            { warn: 'Spaces matter! `touch hello.txt` works. `touchhello.txt` does not: the computer can’t find a command called “touchhello.txt”.' },
          ],
        },
        {
          title: 'cat: peek inside a file',
          blocks: [
            '`cat` shows what is written inside a file. (It comes from the word con-**cat**-enate, not the animal 🐱, but you can think of a cat peeking in!)',
            { code: lines('$ cat notes.txt', 'Buy milk', 'Learn Git') },
            'The two lines under the command are what is written inside `notes.txt`.',
            { quick: { q: 'Which command shows the files in your folder?', options: ['`cat`', '`ls`', '`touch`', '`help`'], answer: 1, explain: '`ls` lists the files. `cat` shows what is *inside* one file.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [
              ['terminal', 'a window where you type commands instead of clicking'],
              ['command', 'a short instruction you type, like `ls`'],
              ['prompt', 'the `$` sign: the computer is ready for you'],
            ] },
            { table: { head: ['Command', 'What it does'], rows: [
              ['`ls`', 'list the files here'],
              ['`touch name`', 'make a new empty file'],
              ['`cat name`', 'show what is inside a file'],
              ['`help`', 'show the commands this practice terminal knows'],
            ] } },
          ],
        },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-terminal-tour',
          title: 'Terminal warm-up',
          xp: XP.git,
          intro: 'Welcome to your first terminal! Type each command and press Enter. Stuck? Type hint.',
          setup: { initialized: false, files: { 'notes.txt': 'untracked' } },
          steps: [
            { prompt: 'Look at the files in this folder.', hint: 'ls', check: (s, cmd) => /^ls/.test(cmd) },
            { prompt: 'Peek inside notes.txt.', hint: 'cat notes.txt', check: (s, cmd) => /^cat\s+notes\.txt/.test(cmd) },
            { prompt: 'Make a new empty file called hello.txt.', hint: 'touch hello.txt', check: (s) => 'hello.txt' in s.files },
            { prompt: 'List the files again. Is hello.txt there?', hint: 'ls', check: (s, cmd) => /^ls/.test(cmd) && 'hello.txt' in s.files },
            { prompt: 'Ask the terminal what commands it knows.', hint: 'help', check: (s, cmd) => cmd === 'help' },
          ],
        },
      ],
    },

    // ─────────────────────────────── 3. git init & git status ───────────────────────────────
    {
      id: 'git-init-status',
      title: 'git init & git status',
      minutes: 5,
      learn: [
        {
          title: 'Git commands start with “git”',
          blocks: [
            'Every Git command starts with the word `git`, then a space, then what you want Git to do.',
            { code: lines('git init', 'git status') },
            { analogy: 'It is like saying a friend’s name before asking them something: “**Git**, please **start**.” “**Git**, what’s the **status**?”', emoji: '🗣️' },
          ],
        },
        {
          title: 'git init: start watching this folder',
          blocks: [
            'Git does nothing until you tell it which folder to look after. `git init` (short for **initialize**, which means “start”) does that.',
            { code: lines('$ git init', 'Initialized empty Git repository in /home/you/project/.git/') },
            { list: [
              'Git made a hidden folder called `.git`. That’s where it keeps all your save points.',
              'Your folder is now a **repository** (or **repo** for short): a folder that Git looks after.',
            ] },
            { tip: 'You only run `git init` **once** per project.' },
          ],
        },
        {
          title: 'git status: “what’s going on?”',
          blocks: [
            '`git status` is the question you will ask most. It tells you what Git sees right now.',
            { code: lines(
              '$ git status',
              'On branch main',
              'Untracked files:',
              '        story.txt',
            ) },
            { steps: [
              '`On branch main`: you are on the main line of your project (more on branches later!).',
              '`Untracked files:`: files Git sees, but is **not** saving yet.',
              '`story.txt`: the file that is untracked.',
            ] },
          ],
        },
        {
          title: 'When you’re not in a repo yet',
          blocks: [
            'If you ask `git status` before `git init`, Git gets confused:',
            { code: lines('$ git status', 'fatal: not a git repository') },
            '“Fatal” sounds scary, but it just means “I can’t do that.” Nothing broke! The fix is simple: run `git init` first.',
            { quick: { q: 'You just made a new project folder. What do you run first?', options: ['`git status`', '`git init`', '`cat`', '`git log`'], answer: 1, explain: '`git init` turns the folder into a repository. Then `git status` works.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [
              ['repository (repo)', 'a project folder that Git looks after'],
              ['initialize', 'to start something up, `git init` starts Git in a folder'],
              ['untracked', 'a file Git can see but is not saving yet'],
            ] },
            { list: ['`git init` → start Git in this folder (once).', '`git status` → ask Git what it sees (any time, as often as you like!).'] },
          ],
        },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-init-tour',
          title: 'Start your first repo',
          xp: XP.git,
          intro: 'This folder has a story.txt file. Let’s get Git to look after it!',
          setup: { initialized: false, files: { 'story.txt': 'untracked' } },
          steps: [
            { prompt: 'Turn this folder into a Git repository.', hint: 'git init', check: (s) => s.initialized },
            { prompt: 'Ask Git what it sees.', hint: 'git status', check: (s, cmd) => /^git status/.test(cmd) },
            { prompt: 'Make a new file called poem.txt.', hint: 'touch poem.txt', check: (s) => 'poem.txt' in s.files },
            { prompt: 'Ask Git again. It should spot poem.txt too.', hint: 'git status', check: (s, cmd) => /^git status/.test(cmd) && 'poem.txt' in s.files },
          ],
        },
      ],
    },

    // ─────────────────────────────── 4. Staging & committing ───────────────────────────────
    {
      id: 'git-basics',
      title: 'Staging & committing: making a save point',
      minutes: 7,
      learn: [
        {
          title: 'Two steps to save',
          blocks: [
            { big: 'Saving in Git takes two steps: **add**, then **commit**.' },
            { analogy: 'Imagine making a photo album. First you **pick** which photos to put in (that’s `git add`). Then you **glue them in and write a caption** underneath (that’s `git commit`).', emoji: '📸' },
            { boxes: ['📝 edit files', '✋ git add', '📸 git commit'], labels: ['step 1', 'step 2', 'step 3'] },
          ],
        },
        {
          title: 'git add: pick what to save',
          blocks: [
            '`git add` puts a file into the **staging area**: the waiting spot for things that will go into your next save point.',
            { code: lines('$ git add story.txt', '$ git status', 'Changes to be committed:', '        new/changed:  story.txt') },
            'Now `git status` says story.txt is **ready to be committed**. In a real terminal this line is green ✅.',
            { tip: '`git add .` (with a dot) means “add **everything** that changed”. The dot means “this whole folder”.' },
          ],
        },
        {
          title: 'git commit: make the save point',
          blocks: [
            '`git commit` takes a snapshot of everything you added. The `-m` part lets you write a **message** (the caption) in quotes.',
            { code: lines('$ git commit -m "Write the first chapter"', '[main a1b2c3d] Write the first chapter', ' 1 file changed') },
            { steps: [
              '`-m "Write the first chapter"`: your caption for this save point.',
              '`a1b2c3d`: a special ID code Git gives every commit (like a fingerprint).',
              '`1 file changed`: how many files are in this save point.',
            ] },
          ],
        },
        {
          title: 'Writing good commit messages',
          blocks: [
            'Your future self will read these messages to find things. Make them say **what you did**.',
            { table: { head: ['😕 Unhelpful', '😃 Helpful'], rows: [
              ['"stuff"', '"Add the dragon to chapter 2"'],
              ['"fix"', '"Fix spelling of castle"'],
              ['"asdfgh"', '"Make the training loop faster"'],
            ] } },
            { quick: { q: 'Which is the best commit message?', options: ['"changes"', '"Add a title to the poem"', '"aaa"', '"done"'], answer: 1, explain: 'It says exactly what changed, so anyone can understand it later.' } },
          ],
        },
        {
          title: 'Why not save everything automatically?',
          blocks: [
            'Because sometimes you change three things but only want to save one of them now. The staging area lets **you** choose.',
            { analogy: 'You took 50 photos at the party, but only the 5 best ones go in the album.', emoji: '🎉' },
            { warn: 'A common mistake: running `git commit` without `git add` first. Git will say “nothing added to commit”. Just `git add` and try again!' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [
              ['stage / staging area', 'the waiting spot for changes that will go into the next commit'],
              ['commit', 'a save point: a snapshot of your files with a message'],
              ['commit message', 'the caption that says what you changed'],
            ] },
            { steps: ['Change some files.', '`git add file` (or `git add .`) to pick them.', '`git commit -m "what you did"` to save.', '`git status` any time to check.'] },
          ],
        },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-first-commit',
          title: 'Your first commit',
          xp: XP.git,
          intro: 'You wrote story.txt. Let’s make your very first save point! 🎉',
          setup: { initialized: false, files: { 'story.txt': 'untracked' } },
          steps: [
            { prompt: 'Start Git in this folder.', hint: 'git init', check: (s) => s.initialized },
            { prompt: 'Pick story.txt to be saved (stage it).', hint: 'git add story.txt   (or git add .)', check: (s) => s.files['story.txt'] === 'staged' },
            { prompt: 'Check that it is ready to commit.', hint: 'git status', check: (s, cmd) => /^git status/.test(cmd) },
            { prompt: 'Make the save point with a message.', hint: 'git commit -m "Start my story"', check: (s) => (s.branches.main || []).length >= 1 },
          ],
        },
        {
          type: 'git',
          id: 'git-more-commits',
          title: 'Keep saving',
          xp: XP.git,
          intro: 'Your story has one save point. Let’s keep writing and saving, just like real programmers do all day.',
          setup: { initialized: true, files: { 'story.txt': 'committed' }, branches: { main: ['Start my story'] } },
          steps: [
            { prompt: 'Open story.txt and add a new chapter (we’ll pretend to type for you).', hint: 'code story.txt', check: (s) => s.files['story.txt'] === 'modified' },
            { prompt: 'Ask Git what changed.', hint: 'git status', check: (s, cmd) => /^git status/.test(cmd) },
            { prompt: 'Stage the changed story.', hint: 'git add story.txt', check: (s) => s.files['story.txt'] === 'staged' },
            { prompt: 'Commit it with a helpful message.', hint: 'git commit -m "Add chapter 2"', check: (s) => (s.branches.main || []).length >= 2 },
            { prompt: 'Make a new file called drawing.png.', hint: 'touch drawing.png', check: (s) => 'drawing.png' in s.files },
            { prompt: 'Stage everything at once with the dot trick.', hint: 'git add .', check: (s) => s.files['drawing.png'] === 'staged' },
            { prompt: 'Commit your third save point!', hint: 'git commit -m "Add a drawing"', check: (s) => (s.branches.main || []).length >= 3 },
          ],
        },
      ],
    },

    // ─────────────────────────────── 5. git log ───────────────────────────────
    {
      id: 'git-log',
      title: 'git log: your history book',
      minutes: 4,
      learn: [
        {
          title: 'Looking back in time',
          blocks: [
            'Every commit you make is remembered. `git log` shows the list, newest first.',
            { analogy: 'It is like flipping backwards through your photo album, reading the caption under every picture.', emoji: '📖' },
          ],
        },
        {
          title: 'Reading git log',
          blocks: [
            { code: lines(
              '$ git log',
              'commit 9f3e2a1 (HEAD -> main)',
              'Author: You <you@foundrylab.dev>',
              '',
              '    Add chapter 2',
              '',
              'commit a1b2c3d',
              'Author: You <you@foundrylab.dev>',
              '',
              '    Start my story',
            ) },
            { steps: [
              '`commit 9f3e2a1`: the ID of the newest save point.',
              '`(HEAD -> main)`: **HEAD** means “you are here”. You are on the newest commit of main.',
              '`Author`: who made it.',
              'The indented line is the commit message.',
            ] },
          ],
        },
        {
          title: 'The short version',
          blocks: [
            'Long logs take up lots of space. Add `--oneline` to get one line per commit:',
            { code: lines('$ git log --oneline', '9f3e2a1 (HEAD -> main) Add chapter 2', 'a1b2c3d Start my story') },
            { tip: 'This is why good messages matter: the one-line log is just IDs and your messages!' },
            { quick: { q: 'In `git log`, what does HEAD mean?', options: ['The first commit ever', 'Where you are right now', 'The boss of the project', 'A deleted commit'], answer: 1, explain: 'HEAD is the “you are here” marker.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['log', 'the list of all your commits'], ['HEAD', 'the “you are here” marker in your history'], ['commit ID', 'the short code (like a1b2c3d) that names each commit']] },
            { list: ['`git log` → full history, newest first.', '`git log --oneline` → short history, one line each.'] },
          ],
        },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-history',
          title: 'Read your history',
          xp: XP.git,
          intro: 'This project already has three save points. Let’s explore its history and add one more.',
          setup: { initialized: true, files: { 'story.txt': 'committed' }, branches: { main: ['Start my story', 'Add chapter 2', 'Fix spelling of castle'] } },
          steps: [
            { prompt: 'Show the full history.', hint: 'git log', check: (s, cmd) => /^git log/.test(cmd) },
            { prompt: 'Now show the short, one-line version.', hint: 'git log --oneline', check: (s, cmd) => /^git log.*--oneline/.test(cmd) },
            { prompt: 'Make a new file called the-end.txt.', hint: 'touch the-end.txt', check: (s) => 'the-end.txt' in s.files },
            { prompt: 'Stage it.', hint: 'git add the-end.txt', check: (s) => s.files['the-end.txt'] === 'staged' },
            { prompt: 'Commit it.', hint: 'git commit -m "Add the ending"', check: (s) => (s.branches.main || []).length >= 4 },
            { prompt: 'Look at the short history. Your new commit is on top!', hint: 'git log --oneline', check: (s, cmd) => /^git log/.test(cmd) && (s.branches.main || []).length >= 4 },
          ],
        },
      ],
    },

    // ─────────────────────────────── 6. Branches ───────────────────────────────
    {
      id: 'git-branches',
      title: 'Branches: try ideas safely',
      minutes: 6,
      learn: [
        {
          title: 'What if your idea is a bad one?',
          blocks: [
            'You have a story that works. You want to try a crazy new ending, but what if it’s terrible? You don’t want to wreck the good version.',
            { big: 'Branches let you try ideas in a safe copy of your project.' },
          ],
        },
        {
          title: 'Parallel universes',
          blocks: [
            { analogy: 'A branch is like a **parallel universe**. In one universe, your story stays the same. In the other, you try the dragon ending. If the dragon ending is great, you bring it back. If not, you just leave that universe behind.', emoji: '🌌' },
            'The main universe is a branch called **main**. Every repo starts with it.',
            { boxes: ['save 1', 'save 2', 'save 3'], labels: ['main', 'main', 'main'] },
            'When you make a new branch, it starts as a copy of where you are now, and then grows its own commits.',
          ],
        },
        {
          title: 'Seeing and making branches',
          blocks: [
            { code: lines('$ git branch', '* main', '$ git branch dragon-ending', '$ git branch', '  dragon-ending', '* main') },
            { steps: [
              '`git branch` (alone) lists your branches. The `*` shows which one you are on.',
              '`git branch dragon-ending` makes a new branch with that name.',
              'You are still on main! Making a branch does not move you to it.',
            ] },
          ],
        },
        {
          title: 'Switching branches',
          blocks: [
            'To move into a branch, use `git checkout` (or the newer `git switch`, both work).',
            { code: lines('$ git checkout dragon-ending', "Switched to branch 'dragon-ending'") },
            'Shortcut! Make a branch **and** jump into it in one command:',
            { code: lines('$ git checkout -b space-ending', "Switched to a new branch 'space-ending'") },
            { table: { head: ['Command', 'What it does'], rows: [
              ['`git branch name`', 'make a branch (stay where you are)'],
              ['`git checkout name`', 'go to a branch'],
              ['`git checkout -b name`', 'make a branch AND go to it'],
              ['`git switch -c name`', 'same thing, newer spelling'],
            ] } },
          ],
        },
        {
          title: 'Check yourself',
          blocks: [
            { quick: { q: 'You typed `git branch robots`. Which branch are you on now?', options: ['robots', 'main (making a branch doesn’t move you)', 'No branch at all', 'Both'], answer: 1, explain: 'You need `git checkout robots` (or `checkout -b`) to actually move.' } },
            { tip: 'Branch names can’t have spaces. Use dashes: `dragon-ending`, `fix-typo`.' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['branch', 'a separate line of work, a safe parallel universe for an idea'], ['main', 'the main branch every repo starts with'], ['checkout / switch', 'move to a different branch']] },
            { list: ['`git branch` → list branches.', '`git branch name` → make one.', '`git checkout name` → go to one.', '`git checkout -b name` → make it and go.'] },
          ],
        },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-branch-basics',
          title: 'Explore branches',
          xp: XP.git,
          intro: 'Your drawing project is on main. Let’s make some parallel universes!',
          setup: { initialized: true, files: { 'drawing.png': 'committed' }, branches: { main: ['First drawing'] } },
          steps: [
            { prompt: 'List the branches you have.', hint: 'git branch', check: (s, cmd) => cmd === 'git branch' },
            { prompt: 'Make a new branch called rainbow.', hint: 'git branch rainbow', check: (s) => Boolean(s.branches.rainbow) },
            { prompt: 'Move into the rainbow branch.', hint: 'git checkout rainbow   (or git switch rainbow)', check: (s) => s.branch === 'rainbow' },
            { prompt: 'List branches again. Where is the star (*) now?', hint: 'git branch', check: (s, cmd) => cmd === 'git branch' && s.branch === 'rainbow' },
            { prompt: 'Go back to main.', hint: 'git checkout main   (or git switch main)', check: (s) => s.branch === 'main' },
            { prompt: 'Use the shortcut: make a branch called stars and jump in.', hint: 'git checkout -b stars   (or git switch -c stars)', check: (s) => s.branch === 'stars' },
          ],
        },
      ],
    },

    // ─────────────────────────────── 7. Merging ───────────────────────────────
    {
      id: 'git-merge',
      title: 'Merging: bring your idea home',
      minutes: 5,
      learn: [
        {
          title: 'Your idea worked!',
          blocks: [
            'You tried the dragon ending on its own branch, and it’s awesome. 🐉 Now you want it in the main story.',
            { big: '**Merging** brings the commits from one branch into another.' },
            { analogy: 'Two streams of water joining into one river. 🏞️ Everything from both streams ends up together.', emoji: '🌊' },
          ],
        },
        {
          title: 'How to merge',
          blocks: [
            'The rule: **go to the branch that should receive the changes**, then merge the other one into it.',
            { code: lines('$ git checkout main', "Switched to branch 'main'", '$ git merge dragon-ending', 'Fast-forward', ' 1 commit merged') },
            { steps: ['`git checkout main`: stand on the branch that receives.', '`git merge dragon-ending`: pull the dragon commits in.', '“Fast-forward” means main simply caught up, easy!'] },
          ],
        },
        {
          title: 'The full branch adventure',
          blocks: [
            { steps: [
              '`git checkout -b experiment`: make a safe branch.',
              'Change files, `git add`, `git commit`: as many times as you want.',
              '`git checkout main`: go back home.',
              '`git merge experiment`: bring the good idea in.',
            ] },
            { quick: { q: 'You want the changes from `experiment` inside `main`. Where should you be standing?', options: ['On experiment', 'On main', 'It doesn’t matter', 'On a new branch'], answer: 1, explain: 'You merge INTO the branch you are on. So stand on main, then `git merge experiment`.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['merge', 'combine the work from one branch into another'], ['fast-forward', 'an easy merge where one branch just catches up to the other']] },
            { list: ['Stand on the receiving branch.', '`git merge other-branch`.', 'Your idea is now part of main! 🎉'] },
          ],
        },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-branching',
          title: 'Branch, commit, merge',
          xp: XP.git,
          intro: 'Your project has one commit on main. Try a new idea on a branch, then bring it home!',
          setup: { initialized: true, files: { 'model.py': 'committed' }, branches: { main: ['Initial model'] } },
          steps: [
            { prompt: 'Make a branch called experiment and jump into it.', hint: 'git checkout -b experiment   (or git switch -c experiment)', check: (s) => s.branch === 'experiment' },
            { prompt: 'Make a new file called notes.md.', hint: 'touch notes.md', check: (s) => 'notes.md' in s.files },
            { prompt: 'Stage and commit notes.md on this branch.', hint: 'git add notes.md, then git commit -m "Add notes"', check: (s) => (s.branches.experiment || []).length > (s.branches.main || []).length },
            { prompt: 'Go back to main.', hint: 'git checkout main   (or git switch main)', check: (s) => s.branch === 'main' },
            { prompt: 'Merge experiment into main.', hint: 'git merge experiment', check: (s) => (s.branches.main || []).length >= 2 },
          ],
        },
      ],
    },

    // ─────────────────────────────── 8. GitHub & remotes ───────────────────────────────
    {
      id: 'git-remotes',
      title: 'GitHub: your code in the cloud',
      minutes: 7,
      learn: [
        {
          title: 'Git vs GitHub',
          blocks: [
            'People mix these up all the time, so let’s make it clear:',
            { table: { head: ['', 'What it is'], rows: [
              ['**Git**', 'the tool on *your* computer that makes save points'],
              ['**GitHub**', 'a website that stores a copy of your repo online'],
            ] } },
            { analogy: 'Git is your notebook. GitHub is a library where you keep a copy of the notebook so friends can read it, and so it’s safe if your computer breaks.', emoji: '📚' },
          ],
        },
        {
          title: 'Remote = the copy online',
          blocks: [
            'The copy of your repo on GitHub is called the **remote**. Its nickname is usually **origin**.',
            { code: lines('$ git remote -v', 'origin  https://github.com/you/tiny-gpt.git (fetch)', 'origin  https://github.com/you/tiny-gpt.git (push)') },
            'This says: “my remote is called origin and it lives at this web address”.',
          ],
        },
        {
          title: 'git clone: download a project',
          blocks: [
            '`git clone` copies a whole repo from GitHub onto your computer, every file AND all the history.',
            { code: lines('$ git clone https://github.com/foundrylab/tiny-gpt.git', "Cloning into 'tiny-gpt'...", 'Receiving objects: 100% (12/12), done.') },
            { tip: 'This is how you get almost any open-source AI project: find it on GitHub, copy its address, `git clone` it.' },
          ],
        },
        {
          title: 'git push: upload your commits',
          blocks: [
            'You made commits on your computer. GitHub doesn’t know about them yet! `git push` sends them up.',
            { code: lines('$ git push', 'To https://github.com/you/tiny-gpt.git', '   a1b2c3d..9f3e2a1  main -> main') },
            '`main -> main` means: your main branch was sent to GitHub’s main branch. ⬆️',
          ],
        },
        {
          title: 'git pull: download new changes',
          blocks: [
            'Your friend pushed some new commits. To get them onto your computer, use `git pull`. ⬇️',
            { code: lines('$ git pull', 'Updating 9f3e2a1..c4d5e6f', 'Fast-forward', ' tokenizer.py | 4 ++--') },
            { analogy: 'Push = mailing your new pages to the library. Pull = picking up the pages your friends mailed in.', emoji: '📬' },
            { tip: 'Good habit: `git pull` before you start working each day.' },
          ],
        },
        {
          title: 'Check yourself',
          blocks: [
            { quick: { q: 'You made 2 commits. Your friend can’t see them on GitHub. What did you forget?', options: ['`git pull`', '`git push`', '`git init`', '`git clone`'], answer: 1, explain: 'Commits stay on your computer until you `git push` them up.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['GitHub', 'a website that hosts Git repos online'], ['remote / origin', 'the online copy of your repo'], ['clone', 'download a repo'], ['push', 'upload your commits'], ['pull', 'download other people’s commits']] },
            { table: { head: ['Command', 'Direction'], rows: [['`git clone url`', '☁️ → 💻 (whole project, once)'], ['`git push`', '💻 → ☁️'], ['`git pull`', '☁️ → 💻']] } },
          ],
        },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-remote-flow',
          title: 'Clone, push, pull',
          xp: XP.git,
          intro: 'A project lives on GitHub at https://github.com/foundrylab/tiny-gpt.git. Let’s download it and work on it together!',
          setup: { initialized: false, files: {} },
          steps: [
            { prompt: 'Download (clone) the project.', hint: 'git clone https://github.com/foundrylab/tiny-gpt.git', check: (s) => s.initialized && !!s.remote },
            { prompt: 'Check where your copy came from.', hint: 'git remote -v', check: (s, cmd) => /^git remote/.test(cmd) },
            { prompt: 'Make a new file called data.py.', hint: 'touch data.py', check: (s) => 'data.py' in s.files },
            { prompt: 'Stage and commit it.', hint: 'git add data.py, then git commit -m "Add data loader"', check: (s) => s.files['data.py'] === 'committed' },
            { prompt: 'Upload your commit to GitHub.', hint: 'git push   (or git push origin main)', check: (s) => s.pushed },
            { prompt: 'A teammate just pushed a fix. Download it!', hint: 'git pull', check: (s) => s.pulled },
          ],
        },
      ],
    },

    // ─────────────────────────────── 9. Merge conflicts ───────────────────────────────
    {
      id: 'git-conflicts',
      title: "Merge conflicts (don't panic!)",
      minutes: 7,
      learn: [
        {
          title: 'When two people change the same line',
          blocks: [
            'Usually Git merges by itself. But what if two branches changed **the exact same line** in different ways? Git can’t guess which one you want.',
            { analogy: 'You and your friend both edit the same sentence in a shared essay. You wrote “The cat is orange.” Your friend wrote “The cat is black.” Someone has to decide!', emoji: '✍️' },
            { big: 'That is a **merge conflict**. It’s normal, and you can fix it. 💪' },
          ],
        },
        {
          title: 'What Git says',
          blocks: [
            { code: lines('$ git merge fix-lr', 'Auto-merging config.py', 'CONFLICT (content): Merge conflict in config.py', 'Automatic merge failed; fix conflicts and then commit the result.') },
            { steps: ['Git tried to merge (“Auto-merging”).', 'It found two different changes in `config.py`.', 'It stopped and is asking **you** to choose.'] },
            { tip: 'Nothing is broken or lost. Git is just being careful.' },
          ],
        },
        {
          title: 'Reading the conflict markers',
          blocks: [
            'Git writes both versions into the file, with special markers around them:',
            { code: lines('<<<<<<< HEAD', 'lr = 0.01', '=======', 'lr = 0.001', '>>>>>>> fix-lr') },
            { table: { head: ['Marker', 'Means'], rows: [
              ['`<<<<<<< HEAD`', 'start of **your** version (the branch you are on)'],
              ['`=======`', 'the dividing line'],
              ['`>>>>>>> fix-lr`', 'end of the **other** branch’s version'],
            ] } },
          ],
        },
        {
          title: 'Fixing it, step by step',
          blocks: [
            { steps: [
              'Open the file in your editor.',
              'Decide what the line should be (keep one version, or mix them).',
              'Delete all the marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).',
              'Save the file.',
              '`git add config.py`: tells Git “I fixed it”.',
              '`git commit`: finishes the merge.',
            ] },
            { code: 'lr = 0.001' },
            '↑ After fixing, the file just has the line you chose. No markers!',
          ],
        },
        {
          title: 'Check yourself',
          blocks: [
            { quick: { q: 'After you fix the file and remove the markers, what tells Git the conflict is solved?', options: ['`git status`', '`git add` the file, then `git commit`', '`git pull`', 'Delete the repo'], answer: 1, explain: 'Adding the file marks it as resolved; committing finishes the merge.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['merge conflict', 'when two branches changed the same lines and Git needs you to pick'], ['conflict markers', 'the `<<<<<<<`, `=======` and `>>>>>>>` lines Git adds to show both versions'], ['resolve', 'fix a conflict']] },
            { list: ['Conflicts are normal: don’t panic.', 'Open the file, choose, delete the markers.', '`git add` the file, then `git commit`.'] },
          ],
        },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-conflict',
          title: 'Fix a conflict',
          xp: XP.git,
          intro: 'Both main and fix-lr changed the same line in config.py. Let’s merge them and fix the conflict together. You’ve got this!',
          setup: {
            initialized: true,
            files: { 'config.py': 'committed' },
            branches: { main: ['Initial config', 'Set lr to 0.01'], 'fix-lr': ['Initial config', 'Set lr to 0.001'] },
            conflictWith: 'fix-lr',
            conflictFile: 'config.py',
          },
          steps: [
            { prompt: 'Merge the fix-lr branch into main.', hint: 'git merge fix-lr', check: (s) => s.merging },
            { prompt: 'Peek inside the file to see the markers.', hint: 'cat config.py', check: (s, cmd) => /^cat\s+config\.py/.test(cmd) },
            { prompt: 'Open the file and fix it (we’ll keep lr = 0.001 and delete the markers for you).', hint: 'code config.py   (nano or vim work too)', check: (s) => s.merging && !s.conflict },
            { prompt: 'Tell Git it’s fixed by staging the file.', hint: 'git add config.py', check: (s) => s.files['config.py'] === 'staged' },
            { prompt: 'Finish the merge with a commit.', hint: 'git commit -m "Merge fix-lr"   (plain git commit works too)', check: (s) => !s.merging && s.files['config.py'] === 'committed' },
          ],
        },
      ],
    },

    // ─────────────────────────────── 10. .gitignore & README ───────────────────────────────
    {
      id: 'git-ignore',
      title: '.gitignore & README',
      minutes: 7,
      learn: [
        {
          title: 'Some files should never be saved',
          blocks: [
            'Not everything in your folder belongs in Git:',
            { list: [
              '🔑 **Secrets**: like passwords or API keys (often in a file called `.env`).',
              '📦 **Huge files**: datasets or trained models that are gigabytes big.',
              '🗑️ **Junk**: files your computer makes by itself, like the `.venv/` folder for Python packages.',
            ] },
            { warn: 'If you push a secret key to GitHub, strangers can find it and use it. Always keep secrets out!' },
          ],
        },
        {
          title: 'Meet .gitignore',
          blocks: [
            '`.gitignore` is a simple text file. Each line is a file or folder name Git should **pretend doesn’t exist**.',
            { code: lines('# .gitignore', '.venv/', '.env', 'data/', '*.pt') },
            { table: { head: ['Line', 'Ignores'], rows: [
              ['`.venv/`', 'the whole .venv folder'],
              ['`.env`', 'the secrets file'],
              ['`*.pt`', 'every file ending in .pt (`*` means “anything”)'],
              ['`# ...`', 'a comment: just a note for humans'],
            ] } },
            { analogy: 'It’s a “do not pack” list for your suitcase. 🧳 Git checks it before packing anything into a commit.', emoji: '🚫' },
          ],
        },
        {
          title: 'Adding lines from the terminal',
          blocks: [
            'You can add a line to a file with `echo` and `>>`:',
            { code: lines('$ echo ".venv/" >> .gitignore', '$ cat .gitignore', '.venv/') },
            { steps: ['`echo ".venv/"`: the text to write.', '`>>`: “add it to the end of…”', '`.gitignore`: …this file (it gets created if it’s new).'] },
            { quick: { q: 'Which line in .gitignore keeps your secret `.env` file out of Git?', options: ['`.env`', '`secret`', '`password`', '`ignore everything`'], answer: 0, explain: 'You just write the file’s name on its own line.' } },
          ],
        },
        {
          title: 'README: your project’s front page',
          blocks: [
            '`README.md` is the first thing people see on your GitHub page. It explains what your project is and how to use it.',
            'The `.md` means it’s written in **Markdown**, plain text with a few symbols for formatting.',
            { table: { head: ['You type', 'You get'], rows: [
              ['`# My Project`', 'a big title'],
              ['`## Setup`', 'a smaller heading'],
              ['`- apples`', 'a bullet point'],
              ['`**bold**`', '**bold** text'],
              ['three backticks', 'a code box'],
            ] } },
          ],
        },
        {
          title: 'A tiny README example',
          blocks: [
            { code: lines('# Tiny GPT', '', 'A very small language model I built to learn.', '', '## How to run', '', '- Install Python', '- Run train.py') },
            'That’s it! Short and clear beats long and confusing.',
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['.gitignore', 'a list of files Git should never save'], ['README.md', 'the welcome page of your project'], ['Markdown', 'simple text formatting using symbols like # and -']] },
            { list: ['Never commit secrets, huge files or junk.', 'Put their names in `.gitignore`.', 'Every repo deserves a friendly README.'] },
          ],
        },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-gitignore',
          title: 'Ignore the junk',
          xp: XP.git,
          intro: 'Your project has a .venv folder and a secret .env file. Let’s keep them out of Git!',
          setup: { initialized: true, files: { 'train.py': 'untracked', '.venv/': 'untracked', '.env': 'untracked' }, branches: { main: [] } },
          steps: [
            { prompt: 'See what Git wants to track.', hint: 'git status', check: (s, cmd) => /^git status/.test(cmd) },
            { prompt: 'Add .venv/ to a .gitignore file.', hint: 'echo ".venv/" >> .gitignore', check: (s) => s.ignore.includes('.venv/') },
            { prompt: 'Also ignore .env (your secrets).', hint: 'echo ".env" >> .gitignore', check: (s) => s.ignore.includes('.env') },
            { prompt: 'Check again: the ignored files have vanished from the list!', hint: 'git status', check: (s, cmd) => /^git status/.test(cmd) && s.ignore.includes('.env') },
            { prompt: 'Stage everything that’s left.', hint: 'git add .', check: (s) => s.files['train.py'] === 'staged' && s.files['.gitignore'] === 'staged' },
            { prompt: 'Commit, and your secrets stay safe.', hint: 'git commit -m "Add train.py and .gitignore"', check: (s) => s.files['train.py'] === 'committed' },
          ],
        },
        {
          type: 'quiz',
          id: 'git-ignore-quiz',
          title: 'Quick check: .gitignore & README',
          xp: XP.quiz,
          questions: [
            {
              q: 'What is a .gitignore file for?',
              options: ['Deleting files you don’t need', 'Telling Git which files and folders to never track (like .venv/ or secrets)', 'Hiding files from your own computer', 'Ignoring merge conflicts'],
              answer: 1,
              explain: 'Ignored files stay on your disk; Git just never stages or commits them.',
            },
            { q: 'You put an API key in .env. Which line keeps it out of Git?', options: ['.env', 'API_KEY', 'secret', 'ignore .env'], answer: 0, explain: 'Each line is a filename or pattern. Add `.env` and Git skips it.' },
            { q: 'In README.md, how do you make a big title?', options: ['<h1>Title', '# Title', '== Title ==', '**Title**'], answer: 1, explain: 'One `#` is a big heading, `##` is smaller, and so on.' },
            { q: 'What does `*.pt` mean in .gitignore?', options: ['Only a file called *.pt', 'Every file ending in .pt', 'Nothing', 'Every folder'], answer: 1, explain: 'The `*` means “anything”, so it matches every file ending in .pt.' },
          ],
        },
      ],
    },

    // ─────────────────────────────── 11. Checkpoint ───────────────────────────────
    {
      id: 'git-checkpoint',
      title: 'Checkpoint: fork, PR & issues',
      minutes: 8,
      checkpoint: true,
      learn: [
        {
          title: 'Helping with other people’s projects',
          blocks: [
            'Thousands of people build open-source AI tools together on GitHub. You can help too, even by fixing one typo! But you can’t push straight into someone else’s project. So GitHub has three helpers:',
            { list: ['🍴 **Fork**', '📬 **Pull Request (PR)**', '🐛 **Issue**'] },
          ],
        },
        {
          title: 'Fork: your own copy',
          blocks: [
            'A **fork** is your own copy of someone else’s repo, on your GitHub account. You click a “Fork” button on the website.',
            { analogy: 'The library won’t let you write in their book. So you photocopy it and write in your copy. ✏️', emoji: '🍴' },
            'Then you `git clone` **your fork** to your computer and work as usual.',
          ],
        },
        {
          title: 'Pull Request: “please take my changes”',
          blocks: [
            'When your change is ready, you `git push` it to your fork, then open a **Pull Request** on GitHub.',
            'A PR says: “Hi! I made this change. Would you like to pull it into your project?” The owners can read it, comment, ask for fixes, and finally **merge** it.',
            { warn: 'Don’t mix them up: `git pull` downloads changes. A **Pull Request** is a request on the GitHub website.' },
          ],
        },
        {
          title: 'Issues: reporting bugs and ideas',
          blocks: [
            'An **issue** is like a sticky note on the project: “I found a bug!” or “Wouldn’t it be cool if…?”',
            'You don’t need to write code to open an issue. Anyone can help by reporting problems clearly.',
            { quick: { q: 'You found a bug but don’t have time to fix it. What should you open?', options: ['A fork', 'A Pull Request', 'An issue', 'A branch'], answer: 2, explain: 'Issues track bugs and ideas so someone can pick them up.' } },
          ],
        },
        {
          title: 'The whole contribution journey',
          blocks: [
            { steps: [
              '🍴 **Fork** the project on GitHub.',
              '💻 `git clone` your fork.',
              '🌿 `git checkout -b fix-typo`: make a branch.',
              '✏️ Edit, `git add`, `git commit`.',
              '⬆️ `git push` your branch.',
              '📬 Open a **Pull Request** on GitHub.',
              '🎉 The owners merge it, and you’re an open-source contributor!',
            ] },
          ],
        },
        {
          title: 'Recap: you did it!',
          blocks: [
            { words: [['fork', 'your own copy of someone else’s repo on GitHub'], ['pull request (PR)', 'asking the owners to merge your changes'], ['issue', 'a note reporting a bug or idea']] },
            { big: 'You now know the same Git skills professional AI engineers use every day. 🌿🏆' },
          ],
        },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-final-journey',
          title: 'The full journey',
          xp: XP.git,
          intro: 'Final challenge! You forked tiny-gpt and spotted a typo in the README. Let’s fix it and send it, start to finish.',
          setup: { initialized: false, files: {} },
          steps: [
            { prompt: 'Clone your fork.', hint: 'git clone https://github.com/you/tiny-gpt.git', check: (s) => s.initialized && !!s.remote },
            { prompt: 'Make a branch called fix-readme and jump in.', hint: 'git checkout -b fix-readme   (or git switch -c fix-readme)', check: (s) => s.branch === 'fix-readme' },
            { prompt: 'Open README.md and fix the typo (we’ll pretend to type).', hint: 'code README.md', check: (s) => s.files['README.md'] === 'modified' },
            { prompt: 'Stage the README.', hint: 'git add README.md', check: (s) => s.files['README.md'] === 'staged' },
            { prompt: 'Commit with a clear message.', hint: 'git commit -m "Fix typo in README"', check: (s) => s.files['README.md'] === 'committed' },
            { prompt: 'Push your branch up to GitHub. (Next you’d click “Open Pull Request” on the website!)', hint: 'git push', check: (s) => s.pushed },
          ],
        },
        {
          type: 'quiz',
          id: 'git-checkpoint-quiz',
          title: 'Can you contribute to a real repo?',
          xp: XP.quiz,
          questions: [
            { q: 'You want to fix a typo in a popular repo you don’t own. First step?', options: ['git push directly to their main', 'Fork the repo to your account', 'Open an issue titled "fixed"', 'Email the owner a zip'], answer: 1, explain: 'A fork gives you a copy you *can* push to. Then you open a PR back to the original.' },
            { q: 'What is a Pull Request?', options: ['A command that downloads changes', 'A request for the owners to review and merge your branch', 'A way to delete a branch', 'A type of merge conflict'], answer: 1, explain: '`git pull` downloads; a Pull Request is GitHub’s review-and-merge request.' },
            { q: 'You found a bug but have no time to fix it. What do you open?', options: ['A fork', 'A PR', 'An issue', 'A new branch'], answer: 2, explain: 'Issues track bugs and ideas so someone can pick them up.' },
            { q: 'Which command makes a branch AND switches to it?', options: ['git branch -d fix', 'git checkout -b fix', 'git merge fix', 'git commit -b fix'], answer: 1, explain: '`git checkout -b fix` (or `git switch -c fix`).' },
            { q: 'What are the two steps to make a save point?', options: ['git init, then git log', 'git add, then git commit', 'git push, then git pull', 'git clone, then git merge'], answer: 1, explain: 'Add picks the changes; commit saves them with a message.' },
            { q: 'Which belongs in .gitignore for a Python AI project?', options: ['train.py', 'README.md', '.venv/', 'requirements.txt'], answer: 2, explain: 'Share requirements.txt, never the venv itself. It’s big and only works on your computer.' },
          ],
        },
      ],
    },
  ],
}
