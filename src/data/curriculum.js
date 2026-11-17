// FoundryLab curriculum entry point. Each module's lessons, labs and quizzes
// live in src/data/modules/<module>.js — see src/data/helpers.js for the format.
import python from './modules/python.js'
import git from './modules/git.js'
import linalg from './modules/linalg.js'
import calculus from './modules/calculus.js'
import probability from './modules/probability.js'

export { XP, py } from './helpers.js'

export const MODULES = [python, git, linalg, calculus, probability]

// ── Lookup helpers ─────────────────────────────────────────────────────────────

export const ALL_ACTIVITIES = MODULES.flatMap((m) =>
  m.lessons.flatMap((l) => l.activities.map((a) => ({ ...a, moduleId: m.id, lessonId: l.id }))),
)

export const ALL_LESSONS = MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })))

export function findLesson(moduleId, lessonId) {
  const mod = MODULES.find((m) => m.id === moduleId)
  const lesson = mod && mod.lessons.find((l) => l.id === lessonId)
  return mod && lesson ? { mod, lesson } : null
}

export function findActivity(id) {
  return ALL_ACTIVITIES.find((a) => a.id === id)
}

export function moduleActivities(moduleId) {
  return ALL_ACTIVITIES.filter((a) => a.moduleId === moduleId)
}
