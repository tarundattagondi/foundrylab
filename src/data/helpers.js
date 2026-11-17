// Shared helpers for writing curriculum modules (src/data/modules/*.js).
//
// ─── LESSON FORMAT ────────────────────────────────────────────────────────────
// module   { id, title, emoji, tagline, badge: { id, name, emoji }, lessons: [lesson] }
// lesson   { id, title, minutes, checkpoint?, learn: [page], activities: [activity] }
// page     { title, blocks: [block] }          // one small idea per page
//
// block (any of):
//   'A paragraph. Supports `code`, **bold** and *italic*.'
//   { big: 'A short, big, friendly sentence.' }
//   { analogy: 'Think of a list like a row of lunch boxes…', emoji: '🍱' }
//   { code: 'static code to look at' }
//   { tryit: py`print("hi")`, note: 'Press Run! Then change the word.' }   // runs in the browser, ungraded
//   { steps: ['first do this', 'then this'] }       // numbered list
//   { list: ['a point', 'another point'] }          // bullet list
//   { boxes: ['"cat"', '"dog"', '"fish"'], labels: ['0', '1', '2'], caption: 'my_list' }  // row of boxes
//   { table: { head: ['Python', 'Means'], rows: [['==', 'is equal?'], …] } }
//   { words: [['variable', 'a labeled box that holds a value'], …] }   // new-words glossary
//   { quick: { q: 'question?', options: ['a', 'b'], answer: 1, explain: 'why' } }   // ungraded check
//   { tip: 'helpful hint' }
//   { warn: 'common mistake to avoid' }
//
// activity (practice, after the learn pages):
//   { type: 'code', id, title, xp, numpy?, task, steps: [], starter, solution, tests: [{ name, code, fail? }], hints: [] }
//   { type: 'quiz', id, title, xp, questions: [{ q, code?, options, answer, explain }] }
//   { type: 'git',  id, title, xp, intro, setup, steps: [{ prompt, hint, check(state, cmd) }] }
//   { type: 'viz',  id, title, xp, component }   // DotProductViz | MatrixShapeViz | GradientDescentViz | VectorSimilarityViz | TemperatureViz
//
// Hidden tests are Python run in the learner's namespace after their code.
// `__source__` = their code, `__stdout__` = what it printed. Prefix test variables with `_`.

/** Tagged template for Python: keeps backslashes, trims the leading newline and trailing space. */
export const py = (strings, ...vals) => String.raw(strings, ...vals).replace(/^\n/, '').replace(/\s+$/, '') + '\n'

export const XP = { code: 50, quiz: 40, git: 40, viz: 15, daily: 25, learn: 10 }
