import { useCallback, useEffect, useState } from 'react'
import * as db from './db'
import { today } from './dates'
import type { Habit, HabitLog, InboxItem, Task } from './types'

/**
 * Single source of truth for the whole app.
 *
 * Every action is optimistic: local state changes immediately so the UI never
 * waits on the network, and the write is fired off in the background. If the
 * server rejects it we refetch rather than hand-rolling an inverse for each
 * action — wrong-but-recoverable beats slow on a single-user app.
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

  /** Fire-and-forget write; on failure, fall back to server truth. */
  const sync = useCallback(
    (fn: () => Promise<void>) => {
      void fn().catch((e: unknown) => {
        setError(e instanceof Error ? e.message : String(e))
        void refresh()
      })
    },
    [refresh],
  )

  // Tasks -----------------------------------------------------------------

  const addTask = useCallback(
    (title: string, due_date: string | null) => {
      const task: Task = {
        id: crypto.randomUUID(),
        title,
        note: null,
        due_date,
        done: false,
        completed_at: null,
        created_at: new Date().toISOString(),
      }
      setTasks((prev) => [...prev, task])
      sync(() => db.createTask(task))
    },
    [sync],
  )

  const patchTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
      sync(() => db.updateTask(id, patch))
    },
    [sync],
  )

  const toggleTask = useCallback(
    (id: string, done: boolean) =>
      patchTask(id, { done, completed_at: done ? new Date().toISOString() : null }),
    [patchTask],
  )

  const removeTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
      sync(() => db.deleteTask(id))
    },
    [sync],
  )

  const rescheduleTasks = useCallback(
    (ids: string[], due_date: string | null) => {
      const set = new Set(ids)
      setTasks((prev) => prev.map((t) => (set.has(t.id) ? { ...t, due_date } : t)))
      sync(() => db.rescheduleTasks(ids, due_date))
    },
    [sync],
  )

  // Inbox -----------------------------------------------------------------

  const captureItem = useCallback(
    (body: string) => {
      const item: InboxItem = {
        id: crypto.randomUUID(),
        body,
        archived: false,
        created_at: new Date().toISOString(),
      }
      setInbox((prev) => [item, ...prev])
      sync(() => db.capture(item))
    },
    [sync],
  )

  const removeInboxItem = useCallback(
    (id: string) => {
      setInbox((prev) => prev.filter((i) => i.id !== id))
      sync(() => db.deleteInboxItem(id))
    },
    [sync],
  )

  const convertInboxItem = useCallback(
    (item: InboxItem, due_date: string | null) => {
      const task: Task = {
        id: crypto.randomUUID(),
        title: item.body,
        note: null,
        due_date,
        done: false,
        completed_at: null,
        created_at: new Date().toISOString(),
      }
      setInbox((prev) => prev.filter((i) => i.id !== item.id))
      setTasks((prev) => [...prev, task])
      sync(() => db.convertInboxItem(item.id, task))
    },
    [sync],
  )

  // Habits ----------------------------------------------------------------

  const addHabit = useCallback(
    (name: string) => {
      const habit: Habit = {
        id: crypto.randomUUID(),
        name,
        created_at: new Date().toISOString(),
      }
      setHabits((prev) => [...prev, habit])
      sync(() => db.createHabit(habit))
    },
    [sync],
  )

  const removeHabit = useCallback(
    (id: string) => {
      setHabits((prev) => prev.filter((h) => h.id !== id))
      setHabitLogs((prev) => prev.filter((l) => l.habit_id !== id))
      sync(() => db.deleteHabit(id))
    },
    [sync],
  )

  const toggleHabit = useCallback(
    (habit_id: string, done: boolean) => {
      const log: HabitLog = { id: crypto.randomUUID(), habit_id, day: today() }
      setHabitLogs((prev) =>
        done ? [...prev, log] : prev.filter((l) => l.habit_id !== habit_id),
      )
      sync(() => db.setHabitDone(log, done))
    },
    [sync],
  )

  return {
    tasks,
    inbox,
    habits,
    habitLogs,
    loading,
    error,
    setError,
    refresh,
    addTask,
    patchTask,
    toggleTask,
    removeTask,
    rescheduleTasks,
    captureItem,
    removeInboxItem,
    convertInboxItem,
    addHabit,
    removeHabit,
    toggleHabit,
  }
}

export type Store = ReturnType<typeof useStore>
