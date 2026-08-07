import { useState } from 'react'
import * as db from '../lib/db'
import { relativeLabel, today, tomorrow } from '../lib/dates'
import type { Task } from '../lib/types'
import type { Store } from '../lib/useStore'

export default function TaskRow({ task, store }: { task: Task; store: Store }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [note, setNote] = useState(task.note ?? '')

  const overdue = !task.done && task.due_date !== null && task.due_date < today()

  function saveEdits() {
    const trimmed = title.trim()
    if (trimmed && (trimmed !== task.title || note !== (task.note ?? ''))) {
      void store.run(() => db.updateTask(task.id, { title: trimmed, note: note || null }))
    }
  }

  return (
    <li className="group border-b border-neutral-100 last:border-0">
      <div className="flex items-start gap-3 py-2.5">
        <button
          aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
          onClick={() => void store.run(() => db.setTaskDone(task.id, !task.done))}
          className={`mt-0.5 size-[18px] shrink-0 rounded-[5px] border transition ${
            task.done
              ? 'border-neutral-900 bg-neutral-900'
              : 'border-neutral-300 hover:border-neutral-500'
          }`}
        >
          {task.done && (
            <svg viewBox="0 0 16 16" className="size-full text-white" fill="none">
              <path d="M4 8.5l2.5 2.5L12 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <button
          onClick={() => setOpen(!open)}
          className={`flex-1 text-left text-[15px] leading-6 ${
            task.done ? 'text-neutral-400 line-through' : ''
          }`}
        >
          {task.title}
          {task.note && !open && (
            <span className="ml-2 text-xs text-neutral-400">{task.note}</span>
          )}
        </button>

        <span
          className={`mt-1 shrink-0 text-xs ${overdue ? 'text-red-600' : 'text-neutral-400'}`}
        >
          {relativeLabel(task.due_date)}
        </span>
      </div>

      {open && (
        <div className="space-y-2 pb-3 pl-[30px]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveEdits}
            className="w-full rounded-md border border-neutral-200 px-2 py-1 text-sm outline-none focus:border-neutral-900"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={saveEdits}
            placeholder="Note"
            className="w-full rounded-md border border-neutral-200 px-2 py-1 text-sm outline-none focus:border-neutral-900"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip onClick={() => reschedule(today())}>Today</Chip>
            <Chip onClick={() => reschedule(tomorrow())}>Tomorrow</Chip>
            <Chip onClick={() => reschedule(null)}>Someday</Chip>
            <input
              type="date"
              value={task.due_date ?? ''}
              onChange={(e) => reschedule(e.target.value || null)}
              className="rounded-md border border-neutral-200 px-2 py-1 text-xs"
            />
            <button
              onClick={() => void store.run(() => db.deleteTask(task.id))}
              className="ml-auto rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  )

  function reschedule(due_date: string | null) {
    void store.run(() => db.updateTask(task.id, { due_date }))
  }
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-50"
    >
      {children}
    </button>
  )
}
