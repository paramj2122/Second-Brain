# Second Brain

A one-person productivity dashboard. Stage 1 scope: **Today, Inbox, Tasks**.
React + TypeScript + Vite + Tailwind, backed by Supabase (Postgres + magic-link auth)
so the same data shows up on laptop and phone.

## Setup (once)

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → New query → paste all of [`supabase/schema.sql`](supabase/schema.sql) → Run.
3. Project Settings → API → copy the **Project URL** and the **anon public** key.
4. Authentication → URL Configuration → set **Site URL** to your Netlify URL, and add
   `http://localhost:5173` under **Redirect URLs** so local dev sign-in works too.

### 2. Local

```bash
cp .env.example .env
```

Put your URL and anon key in `.env`, then:

```bash
npm install && npm run dev
```

### 3. Netlify

Push this folder to a GitHub repo, then in Netlify: **Add new site → Import from Git**.
Build settings come from `netlify.toml` (`npm run build` → `dist`), so the only thing
to set manually is **Site configuration → Environment variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then go back to Supabase and put the live Netlify URL in **Site URL** (step 1.4).

## What it does

- **Today** — the date, non-negotiable habits, today's tasks, quick capture, and a
  rollover banner that moves anything unfinished from earlier days in one tap.
- **Inbox** — everything from quick capture. Convert an item to a task (today /
  tomorrow / someday) or delete it.
- **Tasks** — all tasks grouped Overdue / Today / Upcoming / Someday, plus completed.

Tap any task to edit its title, add a note, change its date, or delete it.

## Structure

```
src/lib/supabase.ts   client + "is it configured" check
src/lib/db.ts         every query lives here — swap backends by rewriting this file
src/lib/useStore.ts   loads everything, refetches after each mutation
src/lib/dates.ts      local-timezone yyyy-mm-dd helpers
src/components/       one file per view + shared task row
```

Not built yet (Stage 1 remainder): Projects, Areas, Notes/pages, global search.
Later stages: daily review, calendar, Gmail, AI.
