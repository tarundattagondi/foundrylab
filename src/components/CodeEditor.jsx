import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { keymap } from '@codemirror/view'
import { Compartment, EditorState } from '@codemirror/state'
import { indentWithTab } from '@codemirror/commands'
import { indentUnit } from '@codemirror/language'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'

const lightTheme = EditorView.theme({
  '&': { backgroundColor: '#fffdfa', color: '#17172a' },
  '.cm-gutters': { backgroundColor: '#f6f2ec', color: '#a09cb0', border: 'none' },
  '.cm-activeLine': { backgroundColor: '#fff4ed' },
  '.cm-activeLineGutter': { backgroundColor: '#ffe6d4' },
})

const sizing = (minHeight) => EditorView.theme({
  '&': { minHeight, maxHeight: '520px' },
  '.cm-scroller': { overflow: 'auto', fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace", lineHeight: '1.6' },
})

/** CodeMirror 6 Python editor. Ctrl/Cmd+Enter runs, Shift+Ctrl/Cmd+Enter checks. */
export default function CodeEditor({ value, onChange, dark, onRun, onCheck, label, minHeight = '220px' }) {
  const host = useRef(null)
  const view = useRef(null)
  const themeSlot = useRef(new Compartment())
  const handlers = useRef({ onChange, onRun, onCheck })
  handlers.current = { onChange, onRun, onCheck }

  useEffect(() => {
    const runKeys = keymap.of([
      { key: 'Mod-Enter', run: () => (handlers.current.onRun?.(), true) },
      { key: 'Shift-Mod-Enter', run: () => (handlers.current.onCheck?.(), true) },
    ])
    view.current = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          runKeys,
          basicSetup,
          keymap.of([indentWithTab]),
          indentUnit.of('    '),
          python(),
          sizing(minHeight),
          themeSlot.current.of(dark ? oneDark : lightTheme),
          EditorView.contentAttributes.of({ 'aria-label': label || 'Python code editor' }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) handlers.current.onChange?.(u.state.doc.toString())
          }),
        ],
      }),
    })
    // Re-measure once web fonts arrive so gutters line up with the text.
    document.fonts?.ready.then(() => view.current?.requestMeasure())
    return () => view.current?.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    view.current?.dispatch({ effects: themeSlot.current.reconfigure(dark ? oneDark : lightTheme) })
  }, [dark])

  // Replace the document when the value is changed from outside (reset / show solution).
  useEffect(() => {
    const v = view.current
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } })
    }
  }, [value])

  return <div ref={host} className="overflow-hidden rounded-xl border border-[color:var(--line)]" />
}
