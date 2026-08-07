import { useState } from 'react'
import * as db from '../lib/db'
import { today } from '../lib/dates'
import type { Store } from '../lib/useStore'

export default function Habits({ store }: { store: Store }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')

  const doneIds = new Set(store.habitLogs.map((l) => l.habit_id))
  const completed = store.habits.length > 0 && store.habits.every((h) => doneIds.has(h.id))

  function add(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setName('')
    void store.run(() => db.createHabit(trimmed))
  }

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Non-negotiables
        </h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs text-neutral-400 hover:text-neutral-700"
        >
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>

      {completed && !editing && (
        <p className="mb-2 text-xs text-green-700">All done for today.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {store.habits.map((h) => {
          const on = doneIds.has(h.id)
          return (
            <span key={h.id} className="flex items-center">
              <button
                onClick={() => void store.run(() => db.setHabitDone(h.id, today(), !on))}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  on
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                {h.name}
              </button>
              {editing && (
                <button
                  aria-label={`Remove ${h.name}`}
                  onClick={() => void store.run(() => db.deleteHabit(h.id))}
                  className="-ml-1 px-1.5 text-neutral-400 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </span>
          )
        })}
      </div>

      {editing && (
        <form onSubmit={add} className="mt-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a habit"
            className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-neutral-900"
          />
        </form>
      )}

      {store.habits.length === 0 && !editing && (
        <p className="text-sm text-neutral-400">No habits yet — hit Edit to add some.</p>
      )}
    </section>
  )
}
