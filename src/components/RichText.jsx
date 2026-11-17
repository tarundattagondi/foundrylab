// Renders the tiny markup used in curriculum text: `code` and **bold**.
export function Inline({ text }) {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="inline-code">{p.slice(1, -1)}</code>
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="font-extrabold">{p.slice(2, -2)}</strong>
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

export function Theory({ blocks }) {
  return (
    <div className="space-y-3 text-[15px] leading-relaxed">
      {blocks.map((b, i) => {
        if (typeof b === 'string') return <p key={i}><Inline text={b} /></p>
        if (b.code) return <CodeBlock key={i} code={b.code} />
        if (b.tip)
          return (
            <div key={i} className="flex gap-3 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm dark:border-brand-900 dark:bg-brand-900/20">
              <span aria-hidden>💡</span>
              <p><Inline text={b.tip} /></p>
            </div>
          )
        return null
      })}
    </div>
  )
}
