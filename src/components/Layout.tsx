import { supabase } from '../lib/supabase'

export type View = 'today' | 'inbox' | 'tasks'

const NAV: { id: View; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'tasks', label: 'Tasks' },
]

export default function Layout({
  view,
  setView,
  inboxCount,
  children,
}: {
  view: View
  setView: (v: View) => void
  inboxCount: number
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl">
      {/* Desktop sidebar */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-neutral-100 px-4 py-8 sm:flex">
        <p className="px-2 text-sm font-semibold tracking-tight">Second Brain</p>
        <nav className="mt-6 space-y-0.5">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm ${
                view === item.id
                  ? 'bg-neutral-100 font-medium text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {item.label}
              {item.id === 'inbox' && inboxCount > 0 && (
                <span className="text-xs text-neutral-400">{inboxCount}</span>
              )}
            </button>
          ))}
        </nav>
        <button
          onClick={() => void supabase.auth.signOut()}
          className="mt-auto px-2 text-left text-xs text-neutral-400 hover:text-neutral-700"
        >
          Sign out
        </button>
      </aside>

      <main className="min-w-0 flex-1 px-5 pb-28 pt-8 sm:px-10 sm:pb-16">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 flex border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex-1 py-3 text-sm ${
              view === item.id ? 'font-medium text-neutral-900' : 'text-neutral-400'
            }`}
          >
            {item.label}
            {item.id === 'inbox' && inboxCount > 0 && (
              <span className="ml-1 text-xs text-neutral-400">{inboxCount}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
