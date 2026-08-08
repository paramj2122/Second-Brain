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
      {store.error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {store.error}{' '}
          <button onClick={() => store.setError(null)} className="underline">
            dismiss
          </button>
        </div>
      )}
      {store.loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : view === 'today' ? (
        <TodayView store={store} />
      ) : view === 'inbox' ? (
        <InboxView store={store} />
      ) : (
        <TasksView store={store} />
      )}
    </Layout>
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
