import * as db from '../lib/db'
import { addDays, longDate, today, tomorrow } from '../lib/dates'
import type { Store } from '../lib/useStore'
import AddTask from './AddTask'
import Habits from './Habits'
import QuickCapture from './QuickCapture'
import TaskRow from './TaskRow'

export default function TodayView({ store }: { store: Store }) {
  const t = today()
  const overdue = store.tasks.filter((x) => !x.done && x.due_date !== null && x.due_date < t)
  const todays = store.tasks.filter((x) => x.due_date === t)
  const openToday = todays.filter((x) => !x.done)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{longDate(t)}</h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          {openToday.length === 0 && overdue.length === 0
            ? 'Nothing left for today.'
            : `${openToday.length + overdue.length} to do`}
        </p>
      </header>

      <QuickCapture store={store} />

      <Habits store={store} />

      {overdue.length > 0 && <Rollover store={store} ids={overdue.map((x) => x.id)} />}

      <section>
        <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Today
        </h2>
        <ul>
          {overdue.map((task) => (
            <TaskRow key={task.id} task={task} store={store} />
          ))}
          {todays.map((task) => (
            <TaskRow key={task.id} task={task} store={store} />
          ))}
        </ul>
        <AddTask store={store} dueDate={t} />
      </section>
    </div>
  )
}

/** "Tasks should never disappear" — one tap to move everything unfinished. */
function Rollover({ store, ids }: { store: Store; ids: string[] }) {
  const move = (date: string | null) => void store.run(() => db.rescheduleTasks(ids, date))

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <p className="text-sm text-amber-900">
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
  'rounded-md border border-amber-300 bg-white px-2 py-1 text-xs text-amber-900 hover:bg-amber-100'
