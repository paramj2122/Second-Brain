-- Second Brain — Stage 1 schema.
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query → Run).
-- Safe to re-run.

create extension if not exists "pgcrypto";

-- Tasks -----------------------------------------------------------------
create table if not exists tasks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  title        text not null,
  note         text,
  due_date     date,                    -- null = unscheduled (lives in "Someday")
  done         boolean not null default false,
  completed_at timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists tasks_user_due_idx on tasks (user_id, due_date);

-- Inbox (quick capture) --------------------------------------------------
create table if not exists inbox_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists inbox_user_idx on inbox_items (user_id, created_at desc);

-- Habits (non-negotiables) ----------------------------------------------
create table if not exists habits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists habit_logs (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references habits(id) on delete cascade,
  day      date not null,
  unique (habit_id, day)
);
create index if not exists habit_logs_user_day_idx on habit_logs (user_id, day);

-- Row level security: every row is scoped to its owner. -------------------
alter table tasks       enable row level security;
alter table inbox_items enable row level security;
alter table habits      enable row level security;
alter table habit_logs  enable row level security;

do $$
declare t text;
begin
  foreach t in array array['tasks', 'inbox_items', 'habits', 'habit_logs'] loop
    execute format('drop policy if exists own_rows on %I', t);
    execute format(
      'create policy own_rows on %I for all
         using (auth.uid() = user_id)
         with check (auth.uid() = user_id)', t);
  end loop;
end $$;
