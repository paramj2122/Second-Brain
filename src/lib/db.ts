// All data access lives here. Swapping Supabase for another backend later
// should only mean rewriting this file.
import { supabase } from './supabase'
import type { Habit, HabitLog, InboxItem, Task } from './types'

/** Reads the cached session — getUser() would hit the network on every write. */
async function userId(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  const id = data.session?.user.id
  if (!id) throw new Error('Not signed in')
  return id
}

function unwrap<T>({ data, error }: { data: T | null; error: unknown }): T {
  if (error) throw error
  return data as T
}

// Tasks -------------------------------------------------------------------

export async function listTasks(): Promise<Task[]> {
  return unwrap(
    await supabase
      .from('tasks')
      .select('id,title,note,due_date,done,completed_at,created_at')
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true }),
  )
}

/** Takes the whole row so the caller can render it before this resolves. */
export async function createTask(task: Pick<Task, 'id' | 'title' | 'due_date'>): Promise<void> {
  unwrap(await supabase.from('tasks').insert({ ...task, user_id: await userId() }))
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<void> {
  unwrap(await supabase.from('tasks').update(patch).eq('id', id))
}

export async function deleteTask(id: string): Promise<void> {
  unwrap(await supabase.from('tasks').delete().eq('id', id))
}

/** Bulk reschedule — used by "move unfinished tasks". */
export async function rescheduleTasks(ids: string[], due_date: string | null): Promise<void> {
  if (ids.length === 0) return
  unwrap(await supabase.from('tasks').update({ due_date }).in('id', ids))
}

// Inbox -------------------------------------------------------------------

export async function listInbox(): Promise<InboxItem[]> {
  return unwrap(
    await supabase
      .from('inbox_items')
      .select('id,body,archived,created_at')
      .eq('archived', false)
      .order('created_at', { ascending: false }),
  )
}

export async function capture(item: Pick<InboxItem, 'id' | 'body'>): Promise<void> {
  unwrap(await supabase.from('inbox_items').insert({ ...item, user_id: await userId() }))
}

export async function archiveInboxItem(id: string): Promise<void> {
  unwrap(await supabase.from('inbox_items').update({ archived: true }).eq('id', id))
}

export async function deleteInboxItem(id: string): Promise<void> {
  unwrap(await supabase.from('inbox_items').delete().eq('id', id))
}

/** Inbox item → task, then archive the original so it stops showing up twice. */
export async function convertInboxItem(
  itemId: string,
  task: Pick<Task, 'id' | 'title' | 'due_date'>,
): Promise<void> {
  await createTask(task)
  await archiveInboxItem(itemId)
}

// Habits ------------------------------------------------------------------

export async function listHabits(): Promise<Habit[]> {
  return unwrap(
    await supabase.from('habits').select('id,name,created_at').order('created_at', { ascending: true }),
  )
}

export async function createHabit(habit: Pick<Habit, 'id' | 'name'>): Promise<void> {
  unwrap(await supabase.from('habits').insert({ ...habit, user_id: await userId() }))
}

export async function deleteHabit(id: string): Promise<void> {
  unwrap(await supabase.from('habits').delete().eq('id', id))
}

export async function listHabitLogs(day: string): Promise<HabitLog[]> {
  return unwrap(await supabase.from('habit_logs').select('id,habit_id,day').eq('day', day))
}

export async function setHabitDone(
  log: HabitLog,
  done: boolean,
): Promise<void> {
  const { id, habit_id, day } = log
  if (done) {
    unwrap(await supabase.from('habit_logs').insert({ id, habit_id, day, user_id: await userId() }))
  } else {
    unwrap(await supabase.from('habit_logs').delete().eq('habit_id', habit_id).eq('day', day))
  }
}
