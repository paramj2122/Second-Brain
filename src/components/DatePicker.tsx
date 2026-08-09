import { useState } from 'react'
import { addMonths, monthGrid, monthLabel, startOfMonth, today, tomorrow } from '../lib/dates'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/**
 * Click-to-pick calendar. Deliberately not an <input type="date"> — that fires a
 * change on every keystroke, so typing a year commits "0002" before you finish.
 */
export default function DatePicker({
  value,
  onSelect,
  onClose,
}: {
  value: string | null
  onSelect: (iso: string | null) => void
  onClose: () => void
}) {
  const [month, setMonth] = useState(() => startOfMonth(value ?? today()))
  const t = today()

  return (
    <>
      {/* Catches the click that dismisses the popup. */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-neutral-700 bg-neutral-900 p-3 shadow-xl shadow-black/50">
        <div className="mb-2 flex items-center justify-between">
          <button
            aria-label="Previous month"
            onClick={() => setMonth(addMonths(month, -1))}
            className="rounded px-2 py-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            ‹
          </button>
          <span className="text-sm font-medium text-neutral-100">{monthLabel(month)}</span>
          <button
            aria-label="Next month"
            onClick={() => setMonth(addMonths(month, 1))}
            className="rounded px-2 py-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {WEEKDAYS.map((d, i) => (
            <span key={i} className="py-1 text-center text-[10px] font-medium text-neutral-500">
              {d}
            </span>
          ))}
          {monthGrid(month).map((cell) => {
            const selected = cell.iso === value
            const isToday = cell.iso === t
            return (
              <button
                key={cell.iso}
                onClick={() => onSelect(cell.iso)}
                className={`rounded-md py-1.5 text-xs transition ${
                  selected
                    ? 'bg-blue-600 font-medium text-white'
                    : cell.inMonth
                      ? 'text-neutral-200 hover:bg-neutral-800'
                      : 'text-neutral-600 hover:bg-neutral-800'
                } ${isToday && !selected ? 'ring-1 ring-inset ring-blue-500' : ''}`}
              >
                {Number(cell.iso.slice(8))}
              </button>
            )
          })}
        </div>

        <div className="mt-2 flex gap-1 border-t border-neutral-800 pt-2">
          <Shortcut onClick={() => onSelect(t)}>Today</Shortcut>
          <Shortcut onClick={() => onSelect(tomorrow())}>Tomorrow</Shortcut>
          <Shortcut onClick={() => onSelect(null)}>Someday</Shortcut>
        </div>
      </div>
    </>
  )
}

function Shortcut({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-md px-1 py-1 text-[11px] text-neutral-300 hover:bg-neutral-800"
    >
      {children}
    </button>
  )
}
