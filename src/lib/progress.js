// All learner progress lives in localStorage under one key. Every read/write is
// wrapped in try/catch: if storage is blocked the app keeps working in memory.
import { useSyncExternalStore } from 'react'
import { MODULES, ALL_ACTIVITIES, XP, findActivity, moduleActivities } from '../data/curriculum'
import { celebrate } from './events'

const KEY = 'foundrylab:v1'
const DRAFTS_KEY = 'foundrylab:drafts'

export const XP_PER_LEVEL = 100

export const LEVEL_TITLES = [
  'Curious Spark',
  'Token Tinkerer',
  'Tensor Apprentice',
  'Vector Voyager',
  'Gradient Wrangler',
  'Matrix Mage',
  'Backprop Bard',
  'Attention Adept',
  'Embedding Explorer',
  'Transformer Tamer',
  'Diffusion Druid',
  'Foundry Master',
]

export function levelInfo(xp) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
  return { level, title, into: xp % XP_PER_LEVEL, next: XP_PER_LEVEL }
}

export const BADGES = [
  { id: 'first-lab', name: 'First Spark', emoji: '✨', desc: 'Pass your first lab' },
  { id: 'first-numpy', name: 'NumPy Initiate', emoji: '🔢', desc: 'Pass your first NumPy lab' },
  { id: 'ten-labs', name: 'Lab Regular', emoji: '🧪', desc: 'Pass 10 labs' },
  { id: 'perfect-quiz', name: 'Flawless', emoji: '💯', desc: 'Ace a quiz with every answer right first try' },
  { id: 'no-hints', name: 'Solo Flight', emoji: '🦅', desc: 'Pass a code lab without using a hint' },
  { id: 'explorer', name: 'Playground Explorer', emoji: '🎡', desc: 'Beat all 5 playground challenges' },
  { id: 'daily', name: 'Keep It Warm', emoji: '📅', desc: 'Finish a daily challenge' },
  { id: 'streak-3', name: 'Warming Up', emoji: '🔥', desc: 'Reach a 3-day streak' },
  { id: 'streak-7', name: 'On Fire', emoji: '☄️', desc: 'Reach a 7-day streak' },
  { id: 'level-5', name: 'Rising Star', emoji: '🌟', desc: 'Reach level 5' },
  ...MODULES.map((m) => ({ id: m.badge.id, name: m.badge.name, emoji: m.badge.emoji, desc: `Complete the ${m.title} module` })),
  { id: 'graduate', name: 'Foundry Graduate', emoji: '🎓', desc: 'Complete all five modules' },
]

const defaultState = () => ({
  xp: 0,
  completed: {}, // activityId -> timestamp
  quizScores: {}, // quizId -> { best, total }
  badges: {}, // badgeId -> timestamp
  streak: { count: 0, lastActive: null },
  dailyDone: null, // date string of the last finished daily challenge
  theme: null, // 'light' | 'dark' | null (follow system)
  lastLesson: null, // { moduleId, lessonId }
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...defaultState(), ...JSON.parse(raw) }
  } catch {
    /* storage blocked or corrupt — start fresh in memory */
  }
  return defaultState()
}

let state = load()
const listeners = new Set()

function commit(next) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore — progress just won't persist */
  }
  listeners.forEach((l) => l())
}

function subscribe(l) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function getState() {
  return state
}

export function useProgress() {
  return useSyncExternalStore(subscribe, getState)
}

// ── dates & streaks ───────────────────────────────────────────────────────────

export function today(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return today(d)
}

/** The streak as it stands right now (0 if the learner missed a day). */
export function currentStreak(s = state) {
  const { count, lastActive } = s.streak
  return lastActive === today() || lastActive === yesterday() ? count : 0
}

function bumpStreak(streak) {
  const t = today()
  if (streak.lastActive === t) return streak
  const count = streak.lastActive === yesterday() ? streak.count + 1 : 1
  return { count, lastActive: t }
}

// ── derived progress ──────────────────────────────────────────────────────────

export function isDone(id, s = state) {
  return Boolean(s.completed[id])
}

export function moduleProgress(moduleId, s = state) {
  const acts = moduleActivities(moduleId)
  const done = acts.filter((a) => s.completed[a.id]).length
  return { done, total: acts.length, pct: acts.length ? done / acts.length : 0 }
}

export function lessonProgress(lesson, s = state) {
  const done = lesson.activities.filter((a) => s.completed[a.id]).length
  return { done, total: lesson.activities.length }
}

export function overallProgress(s = state) {
  const done = ALL_ACTIVITIES.filter((a) => s.completed[a.id]).length
  return { done, total: ALL_ACTIVITIES.length, pct: done / ALL_ACTIVITIES.length }
}

function autoBadges(s) {
  const done = ALL_ACTIVITIES.filter((a) => s.completed[a.id])
  const labs = done.filter((a) => a.type === 'code' || a.type === 'git')
  const earned = []
  if (labs.length >= 1) earned.push('first-lab')
  if (done.some((a) => a.type === 'code' && a.numpy)) earned.push('first-numpy')
  if (labs.length >= 10) earned.push('ten-labs')
  const viz = ALL_ACTIVITIES.filter((a) => a.type === 'viz')
  if (viz.every((a) => s.completed[a.id])) earned.push('explorer')
  if (s.streak.count >= 3) earned.push('streak-3')
  if (s.streak.count >= 7) earned.push('streak-7')
  if (levelInfo(s.xp).level >= 5) earned.push('level-5')
  let allModules = true
  for (const m of MODULES) {
    if (moduleProgress(m.id, s).pct === 1) earned.push(m.badge.id)
    else allModules = false
  }
  if (allModules) earned.push('graduate')
  return earned
}

// ── mutations ─────────────────────────────────────────────────────────────────

/**
 * Mark an activity complete (idempotent). Awards XP the first time, updates the
 * streak, unlocks badges, and fires a celebration.
 * opts: { badges: [extra badge ids], message, bonusXp, quiet }
 */
export function completeActivity(id, opts = {}) {
  const act = findActivity(id)
  const firstTime = !state.completed[id]
  const xpGained = (firstTime ? act?.xp || 0 : 0) + (opts.bonusXp || 0)
  const before = levelInfo(state.xp).level

  const next = {
    ...state,
    xp: state.xp + xpGained,
    completed: firstTime ? { ...state.completed, [id]: Date.now() } : state.completed,
    streak: bumpStreak(state.streak),
  }
  const candidates = [...autoBadges(next), ...(opts.badges || [])]
  const newBadges = [...new Set(candidates)].filter((b) => !next.badges[b])
  if (newBadges.length) {
    next.badges = { ...next.badges }
    newBadges.forEach((b) => (next.badges[b] = Date.now()))
  }
  const levelUp = levelInfo(next.xp).level > before ? levelInfo(next.xp) : null

  let moduleDone = null
  if (firstTime && act) {
    const mod = MODULES.find((m) => m.id === act.moduleId)
    if (moduleProgress(mod.id, next).pct === 1) moduleDone = mod
  }

  commit(next)
  if (!opts.quiet) {
    celebrate({
      message: opts.message,
      xpGained,
      newBadges: newBadges.map((b) => BADGES.find((x) => x.id === b)).filter(Boolean),
      levelUp,
      moduleDone,
    })
  }
  return { firstTime, xpGained, newBadges, levelUp, moduleDone }
}

export function recordQuiz(id, correct, total) {
  const prev = state.quizScores[id]
  const best = Math.max(prev?.best || 0, correct)
  commit({ ...state, quizScores: { ...state.quizScores, [id]: { best, total } } })
}

export function markDailyDone() {
  commit({ ...state, dailyDone: today() })
}

export function setTheme(theme) {
  commit({ ...state, theme })
}

export function setLastLesson(moduleId, lessonId) {
  if (state.lastLesson?.moduleId === moduleId && state.lastLesson?.lessonId === lessonId) return
  commit({ ...state, lastLesson: { moduleId, lessonId } })
}

export function resetProgress() {
  const theme = state.theme
  draftsCache = {}
  try {
    localStorage.removeItem(DRAFTS_KEY)
  } catch {
    /* ignore */
  }
  commit({ ...defaultState(), theme })
}

// ── daily challenge ───────────────────────────────────────────────────────────

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

/** One lab from topics the learner has already completed, stable for the whole day. */
export function dailyChallenge(s = state) {
  const pool = ALL_ACTIVITIES.filter((a) => (a.type === 'code' || a.type === 'quiz' || a.type === 'git') && s.completed[a.id])
  if (!pool.length) return null
  const pick = pool[hash(today()) % pool.length]
  return { activity: pick, done: s.dailyDone === today(), bonus: XP.daily }
}

// ── code drafts (per-lab editor contents) ─────────────────────────────────────

let draftsCache = null
function drafts() {
  if (!draftsCache) {
    try {
      draftsCache = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '{}')
    } catch {
      draftsCache = {}
    }
  }
  return draftsCache
}

export function getDraft(id) {
  return drafts()[id]
}

export function saveDraft(id, code) {
  const d = drafts()
  if (code == null) delete d[id]
  else d[id] = code
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(d))
  } catch {
    /* ignore */
  }
}
