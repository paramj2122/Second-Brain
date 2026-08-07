# Personal Productivity Dashboard — PRD

## 1. Product Vision

Build a **personal productivity dashboard for one person** that feels as simple and flexible as Notion, but is designed around one specific problem:

> **Everything currently floating around in my head should have one place to go, and I should always know what I need to do next.**

This is NOT intended to be a complicated productivity system, project-management platform, or commercial SaaS product.

It should feel like a **personal workspace that I can open every day on my laptop or phone**.

---

# 2. Core Problems

The app should solve these problems:

1. I have too many things in my head and forget them.
2. I do not have one reliable place to dump random thoughts, tasks and ideas.
3. I sometimes have free time but do not know what I should work on.
4. I forget tasks and deadlines, especially because I do not regularly check email.
5. My work is spread across college, freelance work, content creation, travel/personal projects and other areas.
6. I start many things and lose track of what is actually pending.
7. Traditional Notion setups become complicated because of databases, linked views, relations and Kanban boards.
8. If I do not finish something today, I need an easy way to move it to another day instead of letting it disappear.

---

# 3. Product Principles

### Keep it simple
Every feature should reduce mental load, not create another system to maintain.

### Notion-like
The interface should feel familiar to someone who has used Notion:

- Pages
- Blocks
- Simple lists
- Checkboxes
- Notes
- Drag/drop where useful
- Flexible content
- Clean sidebar/navigation
- Minimal visual clutter

### One-person product
This is primarily for personal use. No need for:

- Teams
- User accounts
- Collaboration
- Complex permissions
- Enterprise features

### Capture first, organize later
The user should be able to quickly dump something without deciding where it belongs immediately.

### Tasks should never disappear
If a task is not completed today, it should be very easy to:

- Complete it
- Move it to tomorrow
- Schedule it for another date
- Keep it unscheduled

---

# 4. MVP — Stage 1

The first version should contain ONLY the following.

## 4.1 Home / Today

This is the main screen opened every day.

It should show:

### A. Date

Example:

**Friday, 7 August**

---

### B. Non-Negotiables

A simple habit tracker.

Examples:

- Exercise
- Read
- Study
- Edit/content work
- Sleep on time
- Drink enough water

The user should be able to:

- Add a habit
- Remove a habit
- Check/uncheck it for today
- See whether today's habits are completed

Keep this extremely simple.

Do NOT build a complicated habit analytics system in Stage 1.

---

### C. Today's Tasks

A simple task list.

Each task should have:

- Task name
- Checkbox
- Optional note
- Optional due date
- Optional project/category

Example:

- Finish Signals assignment
- Edit reel
- Send freelance invoice
- Book train ticket
- Research travel destination

The user should be able to:

- Add a task quickly
- Edit a task
- Complete a task
- Delete a task
- Move a task to another date
- Leave a task unscheduled

---

### D. Quick Capture / Brain Dump

A prominent input box:

> "What's on your mind?"

The user can type anything:

- Random idea
- Task
- Reminder
- Thought
- Project idea
- Something to research
- Travel idea
- Content idea
- Something they don't want to forget

For Stage 1, this can simply create an item in an **Inbox**.

The important thing is:

**The user should never have to organize something before capturing it.**

---

# 5. Inbox

A simple place containing everything captured through Quick Capture.

Each item can later be converted/moved into:

- Task
- Note
- Project
- Idea

For Stage 1, keep this basic.

Example:

> "Need to check internship applications"

The user can later turn it into:

**Task → Check internship applications**

---

# 6. Tasks & Scheduling

Tasks need a simple date-based system.

Possible states:

- Inbox
- Today
- Upcoming
- Completed

The user should be able to select a date for a task.

### Important feature: End-of-day rollover

If a task is still incomplete at night, it should NOT automatically disappear.

The user should be able to choose:

> **Move unfinished tasks**

Options:

- Tomorrow
- Pick a date
- Upcoming
- Keep in inbox

This should be extremely easy.

Later, this can become an automatic end-of-day review.

---

# 7. Projects

A simple project area.

Projects should represent larger things that contain multiple tasks.

Examples:

### College
- Signals assignment
- Lab record
- Exam preparation

### Freelance
- Client website
- Video editing
- Invoice

### Content
- YouTube video
- Instagram reel
- Photography project

### Travel
- Girnar trip
- Future travel ideas

Each project should have:

- Project name
- Short description
- Tasks
- Notes
- Status

Do NOT build complicated project management in Stage 1.

No mandatory Kanban board.

A simple list is enough.

---

# 8. Areas

The user has different parts of life.

The app should eventually support areas such as:

- College
- Freelance
- Content
- Personal
- Travel
- Learning
- Fitness
- Finance

These are NOT projects.

An area is an ongoing part of life.

A project has a finish line.

---

# 9. Notes / Pages

The user should be able to create Notion-like pages for information that is not a task.

Examples:

- Travel plans
- Course notes
- Content ideas
- Personal notes
- Research
- Meeting notes
- Freelance client information

Pages should support simple blocks such as:

- Text
- Heading
- Checklist
- Bullet list
- Numbered list
- Divider

Keep the editor simple in Stage 1.

---

# 10. Navigation

Keep navigation minimal.

Suggested sidebar:

**Home**
- Today
- Inbox
- Tasks
- Projects
- Areas
- Notes

Nothing more is required initially.

---

# 11. Search

A basic global search should eventually allow the user to search:

- Tasks
- Projects
- Notes
- Inbox items

This can be Stage 1 if easy to implement.

---

# 12. Data Storage — Stage 1

The first version does NOT need:

- Backend
- Database server
- Hosting
- User authentication
- Cloud infrastructure

Use local browser storage such as:

**IndexedDB or localStorage**

The priority is to make the app work reliably on the user's own device.

However, design the code so that cloud synchronization can be added later.

---

# 13. Device Strategy

### Stage 1

Make it work locally on a laptop.

The app can be started/opened through the local development environment.

### Later

Make it accessible from:

- Laptop
- Phone
- Tablet

This will require cloud hosting and synchronized storage.

Do NOT over-engineer this in Stage 1.

---

# 14. Suggested Tech Stack

Use a simple modern web stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- Local storage / IndexedDB

The exact stack can be changed if Claude Code has a simpler recommendation.

The important requirement is:

**Simple, maintainable and easy to extend.**

---

# 15. Stage 2 — Better Daily Planning

After using Stage 1 for some time, add:

### Daily review

At the end of the day:

- What was completed?
- What remains?
- What should move to tomorrow?
- What can be deleted?
- What should be scheduled later?

### Upcoming view

See tasks for:

- Tomorrow
- This week
- Future dates

### Calendar

A simple calendar view showing scheduled tasks.

### Recurring tasks

Useful for things that happen repeatedly.

---

# 16. Stage 3 — Email Integration

This is an important future feature.

Connect the app to Gmail using the official Gmail API with **read-only permissions initially**.

The app should identify useful emails such as:

- College deadlines
- Assignment announcements
- Internship opportunities
- Client emails
- Payment/invoice emails
- Travel bookings
- Important reminders

Instead of showing every email, the dashboard should eventually surface:

### Important

Emails requiring attention.

### Deadlines

Emails containing dates/deadlines.

### Action required

Emails where the user needs to do something.

The user should be able to convert an email into a task.

Example:

Email:

> "Submit assignment by Monday"

Dashboard:

**Task: Submit assignment — Monday**

Do NOT give the app permission to send/delete emails initially.

Read-only access is the safer starting point.

---

# 17. Stage 4 — Calendar Integration

Potential integrations:

- Google Calendar

The dashboard could show:

### Today

10:00 — Class  
14:00 — Client meeting  
17:00 — Gym

And combine calendar events with tasks.

Eventually:

> "You have 2 hours free between 3 PM and 5 PM."

The system could suggest suitable tasks.

---

# 18. Stage 5 — AI Assistant

Add an optional AI layer.

The user should be able to type naturally:

> "I have 2 hours free. What should I do?"

or

> "Add a task to finish my Signals assignment tomorrow."

or

> "I haven't finished these three tasks. Help me plan tomorrow."

or

> "Turn this brain dump into tasks."

The AI should interact with the existing tasks, projects, notes and calendar.

Important:

**AI should reduce decision fatigue, not create more complexity.**

---

# 19. Stage 6 — Personal Intelligence

Possible future features:

### Weekly review

Show:

- Tasks completed
- Tasks repeatedly postponed
- Projects with no progress
- Habits completed
- Areas receiving too much/little attention

### Forgotten items

Identify things sitting in the inbox for too long.

### Stale projects

Identify projects that have not been touched recently.

### Overloaded days

Warn when too many tasks are scheduled on one day.

### Decision queue

A separate place for decisions that are taking mental space.

Example:

- Which laptop to buy?
- Which course to take?
- Should I accept this project?
- Which travel plan should I choose?

This keeps decisions out of the normal task list.

---

# 20. Stage 7 — Cross-Device Sync

Once the system is genuinely useful:

Move from local-only storage to a cloud-backed system.

Possible architecture:

- Supabase / Firebase / similar backend
- Secure authentication
- Database synchronization
- Cloud backup

Then the same workspace can be used from:

- Laptop
- Phone
- Tablet

This stage should happen ONLY after the workflow is proven.

---

# 21. What NOT to Build Initially

Do not build:

- Complex Kanban boards
- Complicated databases
- Team collaboration
- Multiple user accounts
- Gamification
- Excessive analytics
- Complex habit statistics
- AI everywhere
- Automatic task scheduling
- Social features
- Mobile app
- Complicated permissions
- Fancy animations
- Dozens of dashboards

The goal is:

> **Open → dump thoughts → see what needs doing → do it → move unfinished things → repeat.**

---

# 22. Stage 1 Success Criteria

Stage 1 is successful if the user can:

1. Open the app.
2. Immediately understand what needs to be done today.
3. Check their non-negotiable habits.
4. Add a task in seconds.
5. Dump a random thought without organizing it.
6. Find that thought later in Inbox.
7. Schedule tasks for another day.
8. Mark tasks complete.
9. Create simple projects.
10. Create simple Notion-like pages.
11. Use the system without needing a tutorial.
12. Continue using it every day.

---

# 23. UX Requirement

The most important UX requirement:

## It should feel lighter than Notion.

Notion is powerful, but this application should remove the friction of:

- Creating databases
- Linking databases
- Creating relations
- Creating views
- Managing properties
- Building dashboards

The user should not have to "maintain the productivity system."

The system should simply help them **think, capture, organize and act**.

---

# 24. Claude Code Implementation Instruction

Build **Stage 1 only** first.

Do not implement future stages yet.

Before writing significant code:

1. Create the basic application structure.
2. Explain the architecture briefly.
3. Keep components modular so future features can be added.
4. Use local persistence.
5. Make the interface responsive.
6. Make it usable on both desktop and mobile screen sizes.
7. Prioritize functionality over visual complexity.
8. Avoid unnecessary dependencies.
9. Add clear comments where future integrations will connect.
10. Do not build Gmail, Calendar or AI integration yet.

After Stage 1 works reliably, the user will test it in real daily life before deciding what to build next.

---

# 25. Core Philosophy

This is not meant to become another productivity project that takes more time to manage than it saves.

The product should follow one rule:

> **If using the system feels like work, simplify the system.**
