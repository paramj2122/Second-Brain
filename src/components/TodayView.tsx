import { useState } from 'react'
import { addDays, longDate, today, tomorrow } from '../lib/dates'
import type { Store } from '../lib/useStore'
import AddTask from './AddTask'
import Habits from './Habits'
import QuickCapture from './QuickCapture'
import TaskRow from './TaskRow'

export default function TodayView({ store }: { store: Store }) {
  const t = today()
  const tm = tomorrow()
  const [dragId, setDragId] = useState<string | null>(null)
  const [overZone, setOverZone] = useState<string | null>(null)

  const overdue = store.tasks.filter((x) => !x.done && x.due_date !== null && x.due_date < t)
  const todays = store.tasks.filter((x) => x.due_date === t)
  const tomorrows = store.tasks.filter((x) => x.due_date === tm && !x.done)
  const openToday = todays.filter((x) => !x.done)

  /** Drop-target wiring shared by the Today and Tomorrow cards. */
  function zone(id: string, due: string) {
    return {
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setOverZone(id)
      },
      onDragLeave: (e: React.DragEvent) => {
        // Ignore leave events fired while crossing between child rows.
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverZone(null)
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        if (dragId) store.rescheduleTasks([dragId], due)
        setDragId(null)
        setOverZone(null)
      },
      className: `rounded-2xl border bg-neutral-900/60 px-4 transition ${
        overZone === id ? 'border-blue-500 bg-blue-600/10' : 'border-neutral-800'
      }`,
    }
  }

  const dragProps = {
    draggable: true,
    onDragEnd: () => {
      setDragId(null)
      setOverZone(null)
    },
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{longDate(t)}</h1>
        <p className="mt-0.5 text-sm text-neutral-400">
          {openToday.length === 0 && overdue.length === 0
            ? 'Nothing left for today.'
            : `${openToday.length + overdue.length} to do`}
        </p>
      </header>

      <QuickCapture store={store} />

      <Habits store={store} />

      {overdue.length > 0 && <Rollover store={store} ids={overdue.map((x) => x.id)} />}

      <section>
        <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">Today</h2>
        <div {...zone('today', t)}>
          <ul>
            {overdue.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                store={store}
                {...dragProps}
                onDragStart={() => setDragId(task.id)}
              />
            ))}
            {todays.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                store={store}
                {...dragProps}
                onDragStart={() => setDragId(task.id)}
              />
            ))}
          </ul>
          <AddTask store={store} dueDate={t} />
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
          Tomorrow
        </h2>
        <div {...zone('tomorrow', tm)}>
          {tomorrows.length === 0 ? (
            <p className="py-3 text-sm text-neutral-600">Nothing scheduled.</p>
          ) : (
            <ul>
              {tomorrows.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  store={store}
                  {...dragProps}
                  onDragStart={() => setDragId(task.id)}
                />
              ))}
            </ul>
          )}
          <AddTask store={store} dueDate={tm} />
        </div>
        <p className="mt-1 text-xs text-neutral-600">
          Drag a task between cards to move it. On a phone, tap it and use the date buttons.
        </p>
      </section>
    </div>
  )
}

/** "Tasks should never disappear" — one tap to move everything unfinished. */
function Rollover({ store, ids }: { store: Store; ids: string[] }) {
  const move = (date: string | null) => store.rescheduleTasks(ids, date)

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <p className="text-sm text-amber-300">
        {ids.length} unfinished {ids.length === 1 ? 'task' : 'tasks'} from earlier.
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button onClick={() => move(today())} className={btn}>
          Move to today
        </button>
        <button onClick={() => move(tomorrow())} className={btn}>
          Tomorrow
        </button>
        <button onClick={() => move(addDays(today(), 7))} className={btn}>
          Next week
        </button>
        <button onClick={() => move(null)} className={btn}>
          Someday
        </button>
      </div>
    </div>
  )
}

const btn =
  'rounded-md border border-amber-500/30 bg-neutral-900 px-2 py-1 text-xs text-amber-300 hover:bg-amber-500/10'
