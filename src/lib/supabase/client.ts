/** Browser-only Supabase client. NEVER import server.ts here. */
import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY')
  }

  return createBrowserClient<Database>(url, publishableKey, {
    cookieOptions: {
      path: '/',
      sameSite: 'lax',
      secure: import.meta.env.PROD,
    },
  })
}
