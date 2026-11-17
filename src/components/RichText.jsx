import TryIt from './TryIt'
import QuickCheck from './QuickCheck'

// Renders the tiny markup used in curriculum text: `code`, **bold** and *italic*.
export function Inline({ text }) {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`') && p.length > 1) return <code key={i} className="inline-code">{p.slice(1, -1)}</code>
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) return <strong key={i} className="font-extrabold">{p.slice(2, -2)}</strong>
    if (p.length > 2 && p.startsWith('*') && p.endsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>
    return <span key={i}>{p}</span>
  })
}

export function CodeBlock({ code }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-ink-950 p-4 text-[13px] leading-relaxed text-ink-100 dark:bg-black/40">
      <pre className="font-mono"><code>{code}</code></pre>
    </div>
  )
}

function Callout({ emoji, tone, children }) {
  return (
    <div className={`flex gap-3 rounded-xl border p-3 text-[15px] ${tone}`}>
      <span className="text-xl leading-none" aria-hidden>{emoji}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

/** Renders one learn-page block (see src/data/helpers.js for the formats). */
export function Block({ b }) {
  if (typeof b === 'string') return <p><Inline text={b} /></p>
  if (b.big) return <p className="text-xl font-black leading-snug sm:text-2xl"><Inline text={b.big} /></p>
  if (b.code) return <CodeBlock code={b.code} />
  if (b.tryit) return <TryIt code={b.tryit} note={b.note} />
  if (b.quick) return <QuickCheck {...b.quick} />
  if (b.analogy)
    return (
      <Callout emoji={b.emoji || '🧸'} tone="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
        <p className="mb-0.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">Think of it like this</p>
        <p><Inline text={b.analogy} /></p>
      </Callout>
    )
  if (b.tip)
    return (
      <Callout emoji="💡" tone="border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-900/20">
        <p><Inline text={b.tip} /></p>
      </Callout>
    )
  if (b.warn)
    return (
      <Callout emoji="⚠️" tone="border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30">
        <p><Inline text={b.warn} /></p>
      </Callout>
    )
  if (b.steps)
    return (
      <ol className="space-y-2">
        {b.steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-black text-white">{i + 1}</span>
            <span className="pt-0.5"><Inline text={s} /></span>
          </li>
        ))}
      </ol>
    )
  if (b.list)
    return (
      <ul className="space-y-1.5">
        {b.list.map((s, i) => (
          <li key={i} className="flex gap-2"><span className="text-brand-500" aria-hidden>●</span><span><Inline text={s} /></span></li>
        ))}
      </ul>
    )
  if (b.boxes)
    return (
      <figure className="overflow-x-auto py-1">
        <div className="flex w-max items-end gap-1.5">
          {b.caption && <span className="mr-2 self-center font-mono text-sm font-bold">{b.caption} =</span>}
          {b.boxes.map((x, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="grid min-h-12 min-w-12 place-items-center rounded-xl border-2 border-brand-400 bg-brand-50 px-3 font-mono text-sm font-bold dark:bg-brand-900/30">{x}</div>
              {b.labels && <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-300">{b.labels[i]}</span>}
            </div>
          ))}
        </div>
        {b.labels && b.labelName && <figcaption className="muted mt-1 text-xs">↑ {b.labelName}</figcaption>}
      </figure>
    )
  if (b.table)
    return (
      <div className="overflow-x-auto rounded-xl border border-[color:var(--line)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-100 dark:bg-ink-800">
            <tr>{b.table.head.map((h, i) => <th key={i} className="px-3 py-2 font-extrabold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {b.table.rows.map((r, i) => (
              <tr key={i} className="border-t border-[color:var(--line)]">
                {r.map((c, j) => <td key={j} className="px-3 py-2"><Inline text={c} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  if (b.words)
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">📖 New words</p>
        <dl className="space-y-1.5 text-sm">
          {b.words.map(([term, meaning]) => (
            <div key={term}>
              <dt className="inline font-extrabold">{term}</dt> <dd className="inline">— <Inline text={meaning} /></dd>
            </div>
          ))}
        </dl>
      </div>
    )
  return null
}

export function Blocks({ blocks }) {
  return (
    <div className="space-y-4 text-[16px] leading-relaxed">
      {blocks.map((b, i) => <Block key={i} b={b} />)}
    </div>
  )
}
