import { useState } from 'react'
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
    store.addTask(trimmed, dueDate)
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-3 py-2.5">
      <span className="size-[18px] shrink-0 rounded-[5px] border border-dashed border-neutral-700" />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[15px] text-neutral-100 outline-none placeholder:text-neutral-500"
      />
    </form>
  )
}
