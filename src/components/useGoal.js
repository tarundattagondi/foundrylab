import { useCallback, useRef } from 'react'
import { completeActivity, useProgress } from '../lib/progress'

/** For playground challenges: [alreadyDone, achieve()] — achieve fires once. */
export default function useGoal(activity, message) {
  const progress = useProgress()
  const done = Boolean(progress.completed[activity.id])
  const fired = useRef(false)
  const achieve = useCallback(() => {
    if (done || fired.current) return
    fired.current = true
    completeActivity(activity.id, { message })
  }, [done, activity.id, message])
  return [done, achieve]
}
