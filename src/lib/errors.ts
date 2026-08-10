/**
 * Supabase returns plain objects ({ message, code, details, hint }) rather than
 * Error instances, so String(e) renders the useless "[object Object]".
 */
export function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof e === 'object' && e !== null) {
    const o = e as Record<string, unknown>
    const text = [o.message, o.details, o.hint].filter(
      (x): x is string => typeof x === 'string' && x.length > 0,
    )
    if (text.length > 0) return text.join(' — ')
    try {
      return JSON.stringify(e)
    } catch {
      return 'Unknown error'
    }
  }
  return String(e)
}

/** An expired or missing login — the fix is to sign in again, not to retry. */
export function isAuthError(e: unknown): boolean {
  if (typeof e !== 'object' || e === null) return false
  const o = e as Record<string, unknown>
  if (o.status === 401 || o.status === 403) return true
  if (typeof o.code === 'string' && o.code.startsWith('PGRST3')) return true
  const message = typeof o.message === 'string' ? o.message : ''
  return /jwt|token|not signed in|session/i.test(message)
}
