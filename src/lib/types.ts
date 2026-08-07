export type Task = {
  id: string
  title: string
  note: string | null
  /** ISO yyyy-mm-dd, or null for unscheduled ("Someday"). */
  due_date: string | null
  done: boolean
  completed_at: string | null
  created_at: string
}

export type InboxItem = {
  id: string
  body: string
  archived: boolean
  created_at: string
}

export type Habit = {
  id: string
  name: string
  created_at: string
}

export type HabitLog = {
  id: string
  habit_id: string
  day: string
}
