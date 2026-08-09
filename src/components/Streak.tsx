import { toISODate, today } from '../lib/dates'
import type { Task } from '../lib/types'

const WEEKS = 12

/** 12 full weeks (Sun–Sat), most recent week last, ending on today's week. */
function buildWeeks(endISO: string): string[][] {
  const [y, m, d] = endISO.split('-').map(Number)
  const end = new Date(y, m - 1, d)
  const start = new Date(end)
  start.setDate(start.getDate() - end.getDay() - (WEEKS - 1) * 7)

  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, day) => {
      const cell = new Date(start)
      cell.setDate(start.getDate() + w * 7 + day)
      return toISODate(cell)
    }),
  )
}

function shade(count: number): string {
  if (count <= 0) return 'bg-neutral-800'
  if (count === 1) return 'bg-green-900'
  if (count === 2) return 'bg-green-700'
  return 'bg-green-500'
}

/** LeetCode-style grid: greener = more tasks finished that day, dimmer = something due that day slipped. */
export default function Streak({ tasks }: { tasks: Task[] }) {
  const t = today()
  const weeks = buildWeeks(t)

  const completedByDay = new Map<string, number>()
  const overdueByDay = new Set<string>()
  for (const task of tasks) {
    if (task.done && task.completed_at) {
      const day = task.completed_at.slice(0, 10)
      completedByDay.set(day, (completedByDay.get(day) ?? 0) + 1)
    }
    if (!task.done && task.due_date && task.due_date < t) {
      overdueByDay.add(task.due_date)
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">Streak</h2>
      <div className="flex gap-0.5 overflow-x-auto">
        {weeks.map((col, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {col.map((iso) => {
              if (iso > t) return <span key={iso} className="size-2.5" />
              const count = completedByDay.get(iso) ?? 0
              const dim = overdueByDay.has(iso)
              return (
                <span
                  key={iso}
                  title={`${iso} — ${count} done${dim ? ', something missed' : ''}`}
                  className={`size-2.5 rounded-sm ${shade(count)} ${dim ? 'opacity-40' : ''} ${
                    iso === t ? 'ring-1 ring-blue-500' : ''
                  }`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-neutral-600">Darker = more done. Dim = something missed.</p>
    </div>
  )
}
