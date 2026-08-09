import { today, tomorrow } from '../lib/dates'
import type { InboxItem } from '../lib/types'
import type { Store } from '../lib/useStore'
import QuickCapture from './QuickCapture'

export default function InboxView({ store }: { store: Store }) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
        <p className="mt-0.5 text-sm text-neutral-400">
          {store.inbox.length === 0 ? 'Empty. Nice.' : `${store.inbox.length} to sort`}
        </p>
      </header>

      <QuickCapture store={store} />

      <ul className="space-y-2">
        {store.inbox.map((item) => (
          <Item key={item.id} item={item} store={store} />
        ))}
      </ul>
    </div>
  )
}

function Item({ item, store }: { item: InboxItem; store: Store }) {
  const toTask = (date: string | null) => store.convertInboxItem(item, date)

  return (
    <li className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
      <p className="whitespace-pre-wrap text-[15px] leading-6 text-neutral-100">{item.body}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <button onClick={() => toTask(today())} className={chip}>
          → Task today
        </button>
        <button onClick={() => toTask(tomorrow())} className={chip}>
          Tomorrow
        </button>
        <button onClick={() => toTask(null)} className={chip}>
          Someday
        </button>
        <button
          onClick={() => store.removeInboxItem(item.id)}
          className="ml-auto rounded-md px-2 py-1 text-xs text-neutral-500 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </li>
  )
}

const chip =
  'rounded-md border border-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800'
