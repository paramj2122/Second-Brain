import { useState } from 'react'
import { relativeLabel, today, tomorrow } from '../lib/dates'
import type { Task } from '../lib/types'
import type { Store } from '../lib/useStore'
import DatePicker from './DatePicker'

export default function TaskRow({
  task,
  store,
  draggable = false,
  onDragStart,
  onDragEnd,
}: {
  task: Task
  store: Store
  draggable?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [picker, setPicker] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [note, setNote] = useState(task.note ?? '')

  const overdue = !task.done && task.due_date !== null && task.due_date < today()

  function saveEdits() {
    const trimmed = title.trim()
    if (trimmed && (trimmed !== task.title || note !== (task.note ?? ''))) {
      store.patchTask(task.id, { title: trimmed, note: note || null })
    }
  }

  function reschedule(due_date: string | null) {
    store.patchTask(task.id, { due_date })
    setPicker(false)
  }

  return (
    <li
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        // Firefox refuses to start a drag without payload.
        e.dataTransfer.setData('text/plain', task.id)
        onDragStart?.()
      }}
      onDragEnd={onDragEnd}
      className={`group border-b border-neutral-800 last:border-0 ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <div className="flex items-start gap-3 py-2.5">
        <button
          aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
          onClick={() => store.toggleTask(task.id, !task.done)}
          className={`mt-0.5 size-[18px] shrink-0 rounded-[5px] border transition ${
            task.done ? 'border-blue-600 bg-blue-600' : 'border-neutral-700 hover:border-neutral-500'
          }`}
        >
          {task.done && (
            <svg viewBox="0 0 16 16" className="size-full text-white" fill="none">
              <path
                d="M4 8.5l2.5 2.5L12 5.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        <button
          onClick={() => setOpen(!open)}
          className={`flex-1 text-left text-[15px] leading-6 ${
            task.done ? 'text-neutral-500 line-through' : 'text-neutral-100'
          }`}
        >
          {task.title}
          {task.note && !open && (
            <span className="ml-2 text-xs text-neutral-500">{task.note}</span>
          )}
        </button>

        <span className={`mt-1 shrink-0 text-xs ${overdue ? 'text-red-400' : 'text-neutral-500'}`}>
          {relativeLabel(task.due_date)}
        </span>
      </div>

      {open && (
        <div className="space-y-2 pb-3 pl-[30px]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveEdits}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-blue-500"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={saveEdits}
            placeholder="Note"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-blue-500"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip onClick={() => reschedule(today())}>Today</Chip>
            <Chip onClick={() => reschedule(tomorrow())}>Tomorrow</Chip>
            <Chip onClick={() => reschedule(null)}>Someday</Chip>
            <div className="relative">
              <Chip onClick={() => setPicker(!picker)}>Pick a date ▾</Chip>
              {picker && (
                <DatePicker
                  value={task.due_date}
                  onSelect={reschedule}
                  onClose={() => setPicker(false)}
                />
              )}
            </div>
            <button
              onClick={() => store.removeTask(task.id)}
              className="ml-auto rounded-md px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
    >
      {children}
    </button>
  )
}
