import { useCallback, useEffect, useState } from 'react'
import * as db from './db'
import { today } from './dates'
import type { Habit, HabitLog, InboxItem, Task } from './types'

/**
 * Single source of truth for the whole app. The dataset is one person's tasks,
 * so we just refetch everything after a mutation instead of maintaining a cache.
 */
export function useStore() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [inbox, setInbox] = useState<InboxItem[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const [t, i, h, l] = await Promise.all([
        db.listTasks(),
        db.listInbox(),
        db.listHabits(),
        db.listHabitLogs(today()),
      ])
      setTasks(t)
      setInbox(i)
      setHabits(h)
      setHabitLogs(l)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  /** Runs a mutation then refetches; surfaces failures instead of swallowing them. */
  const run = useCallback(
    async (fn: () => Promise<void>) => {
      try {
        await fn()
        await refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    },
    [refresh],
  )

  return { tasks, inbox, habits, habitLogs, loading, error, setError, refresh, run }
}

export type Store = ReturnType<typeof useStore>
