import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import Auth from './components/Auth'
import InboxView from './components/InboxView'
import Layout, { type View } from './components/Layout'
import TasksView from './components/TasksView'
import TodayView from './components/TodayView'
import { isConfigured, supabase } from './lib/supabase'
import { useStore } from './lib/useStore'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isConfigured) {
      setChecking(false)
      return
    }
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!isConfigured) return <NotConfigured />
  if (checking) return null
  if (!session) return <Auth />
  return <Workspace key={session.user.id} />
}

function Workspace() {
  const [view, setView] = useState<View>('today')
  const store = useStore()

  return (
    <Layout view={view} setView={setView} inboxCount={store.inbox.length}>
      {store.error && store.status === 'ready' && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {store.error}{' '}
          <button onClick={() => store.setError(null)} className="underline">
            dismiss
          </button>
        </div>
      )}

      {store.status === 'loading' && <p className="text-sm text-neutral-500">Loading…</p>}

      {/* Never fall through to the views here: empty lists would look like lost data. */}
      {store.status === 'expired' && (
        <Blocked
          title="Your sign-in expired"
          body="Your data is safe on the server — this device just needs to sign in again."
          action="Sign in again"
          onClick={() => void supabase.auth.signOut()}
          detail={store.error}
        />
      )}

      {store.status === 'failed' && (
        <Blocked
          title="Couldn’t load your data"
          body="Nothing has been deleted. This is usually a dropped connection."
          action="Try again"
          onClick={() => void store.refresh()}
          detail={store.error}
        />
      )}

      {store.status === 'ready' &&
        (view === 'today' ? (
          <TodayView store={store} />
        ) : view === 'inbox' ? (
          <InboxView store={store} />
        ) : (
          <TasksView store={store} />
        ))}
    </Layout>
  )
}

function Blocked({
  title,
  body,
  action,
  onClick,
  detail,
}: {
  title: string
  body: string
  action: string
  onClick: () => void
  detail: string | null
}) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
      <h2 className="text-sm font-medium text-amber-200">{title}</h2>
      <p className="mt-1 text-sm text-amber-100/70">{body}</p>
      <button
        onClick={onClick}
        className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
      >
        {action}
      </button>
      {detail && <p className="mt-3 text-xs text-amber-100/40">Details: {detail}</p>}
    </div>
  )
}

function NotConfigured() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-lg font-semibold text-neutral-50">Supabase isn’t configured</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Set <code className="rounded bg-neutral-800 px-1 text-neutral-200">VITE_SUPABASE_URL</code>{' '}
        and{' '}
        <code className="rounded bg-neutral-800 px-1 text-neutral-200">
          VITE_SUPABASE_ANON_KEY
        </code>{' '}
        in <code className="rounded bg-neutral-800 px-1 text-neutral-200">.env</code> locally, or
        in Netlify → Site configuration → Environment variables. See the README.
      </p>
    </div>
  )
}
