import { useState } from 'react'
import * as db from '../lib/db'
import type { Store } from '../lib/useStore'

/** One-line task entry. `dueDate` is whatever the current view means by "here". */
export default function AddTask({
  store,
  dueDate,
  placeholder = 'Add a task',
}: {
  store: Store
  dueDate: string | null
  placeholder?: string
}) {
  const [title, setTitle] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setTitle('')
    void store.run(() => db.createTask(trimmed, dueDate))
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-3 py-2.5">
      <span className="size-[18px] shrink-0 rounded-[5px] border border-dashed border-neutral-300" />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-neutral-400"
      />
    </form>
  )
}
