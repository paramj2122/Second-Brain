import { monthGrid, monthLabel, startOfMonth, today } from '../lib/dates'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** Read-only month view — just enough to see where today sits in the month. */
export default function MiniCalendar() {
  const t = today()
  const month = startOfMonth(t)

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
        {monthLabel(month)}
      </h2>
      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="py-0.5 text-center text-[10px] font-medium text-neutral-600">
            {d}
          </span>
        ))}
        {monthGrid(month).map((cell) => (
          <span
            key={cell.iso}
            className={`flex items-center justify-center rounded-md py-1 text-xs ${
              cell.iso === t
                ? 'bg-blue-600 font-medium text-white'
                : cell.inMonth
                  ? 'text-neutral-300'
                  : 'text-neutral-700'
            }`}
          >
            {Number(cell.iso.slice(8))}
          </span>
        ))}
      </div>
    </div>
  )
}
