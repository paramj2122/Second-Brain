import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && anonKey)

// Falls back to placeholders so the app can render a "not configured yet"
// screen instead of crashing on a fresh clone / missing Netlify env vars.
export const supabase = createClient(url ?? 'http://localhost', anonKey ?? 'public-anon-key')
