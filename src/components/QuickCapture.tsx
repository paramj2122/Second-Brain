import { useState } from 'react'
import * as db from '../lib/db'
import type { Store } from '../lib/useStore'

/** Never asks where it goes — everything lands in the Inbox. */
export default function QuickCapture({ store }: { store: Store }) {
  const [body, setBody] = useState('')
  const [flash, setFlash] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = body.trim()
    if (!trimmed) return
    setBody('')
    setFlash(true)
    setTimeout(() => setFlash(false), 1200)
    void store.run(() => db.capture(trimmed))
  }

  return (
    <form onSubmit={submit}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          // Enter captures; Shift+Enter makes a new line.
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit(e)
          }
        }}
        rows={2}
        placeholder="What's on your mind?"
        className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-[15px] text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-blue-500 focus:bg-neutral-900"
      />
      <p className="mt-1 h-4 text-xs text-neutral-500">
        {flash ? 'Saved to Inbox.' : 'Enter to save · Shift+Enter for a new line'}
      </p>
    </form>
  )
}
