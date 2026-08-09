import { useState } from 'react'
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
    store.addHabit(trimmed)
  }

  return (
    <section>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Non-negotiables
          </h2>
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs text-neutral-500 hover:text-neutral-200"
          >
            {editing ? 'Done' : 'Edit'}
          </button>
        </div>

        {completed && !editing && (
          <p className="mb-2 text-xs text-green-400">All done for today.</p>
        )}

        <ul>
          {store.habits.map((h) => {
            const on = doneIds.has(h.id)
            return (
              <li
                key={h.id}
                className="flex items-center gap-3 border-b border-neutral-800 py-2 last:border-0"
              >
                <button
                  aria-label={on ? `Mark ${h.name} incomplete` : `Mark ${h.name} complete`}
                  onClick={() => store.toggleHabit(h.id, !on)}
                  className={`size-[18px] shrink-0 rounded-[5px] border transition ${
                    on ? 'border-blue-600 bg-blue-600' : 'border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  {on && (
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
                <span className={`flex-1 text-[15px] ${on ? 'text-neutral-400' : 'text-neutral-100'}`}>
                  {h.name}
                </span>
                {editing && (
                  <button
                    aria-label={`Remove ${h.name}`}
                    onClick={() => store.removeHabit(h.id)}
                    className="px-1.5 text-neutral-500 hover:text-red-400"
                  >
                    ×
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        {editing && (
          <form onSubmit={add} className="mt-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add a habit"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-blue-500"
            />
          </form>
        )}

        {store.habits.length === 0 && !editing && (
          <p className="text-sm text-neutral-500">No habits yet — hit Edit to add some.</p>
        )}
      </div>
    </section>
  )
}
