// Registry for { visual: 'name', ...props } blocks in lesson pages.
// Each module file exports a map { name: Component }; names must be unique.
import linalg from './linalg'
import calculus from './calculus'
import probability from './probability'

export const VISUALS = { ...linalg, ...calculus, ...probability }

export default function Visual({ visual, ...props }) {
  const V = VISUALS[visual]
  if (!V) return <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">Unknown visual: {visual}</p>
  return <V {...props} />
}
