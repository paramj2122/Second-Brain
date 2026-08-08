import { useState } from 'react'
import { today } from '../lib/dates'
import type { Task } from '../lib/types'
import type { Store } from '../lib/useStore'
import AddTask from './AddTask'
import TaskRow from './TaskRow'

export default function TasksView({ store }: { store: Store }) {
  const [showDone, setShowDone] = useState(false)
  const t = today()

  const open = store.tasks.filter((x) => !x.done)
  const groups: { label: string; dueDate: string | null; tasks: Task[] }[] = [
    { label: 'Overdue', dueDate: t, tasks: open.filter((x) => x.due_date !== null && x.due_date < t) },
    { label: 'Today', dueDate: t, tasks: open.filter((x) => x.due_date === t) },
    { label: 'Upcoming', dueDate: null, tasks: open.filter((x) => x.due_date !== null && x.due_date > t) },
    { label: 'Someday', dueDate: null, tasks: open.filter((x) => x.due_date === null) },
  ]

  const done = store.tasks
    .filter((x) => x.done)
    .sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''))

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="mt-0.5 text-sm text-neutral-400">{open.length} open</p>
      </header>

      {groups.map((g) => (
        <section key={g.label}>
          <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
            {g.label}
          </h2>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4">
            {g.tasks.length === 0 && g.label === 'Overdue' ? (
              <p className="py-3 text-sm text-neutral-600">Nothing.</p>
            ) : (
              <ul>
                {g.tasks.map((task) => (
                  <TaskRow key={task.id} task={task} store={store} />
                ))}
              </ul>
            )}
            {g.label !== 'Overdue' && g.label !== 'Upcoming' && (
              <AddTask store={store} dueDate={g.dueDate} />
            )}
          </div>
        </section>
      ))}

      <section>
        <button
          onClick={() => setShowDone(!showDone)}
          className="text-xs font-medium uppercase tracking-wide text-neutral-500 hover:text-neutral-200"
        >
          Completed ({done.length}) {showDone ? '−' : '+'}
        </button>
        {showDone && (
          <div className="mt-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4">
            <ul>
              {done.map((task) => (
                <TaskRow key={task.id} task={task} store={store} />
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
