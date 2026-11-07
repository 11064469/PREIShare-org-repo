/**
 * Server-only Supabase helper for sponsor-scoped requests.
 * Import ONLY from TanStack Start server functions/loaders, never UI modules.
 *
 * The server reads the same public Supabase URL/publishable key from its
 * environment; it MUST NOT use SUPABASE_SECRET_KEY for ordinary listing access.
 * A privileged key could bypass RLS.
 *
 * Callers must securely obtain the user's access token from the validated
 * server-side auth/session flow. Never accept a token as trusted merely
 * because a browser submitted it. This helper verifies it with Supabase Auth.
 */
import '@tanstack/react-start/server-only'
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { Database } from './types'

export async function createServerSupabaseClient(
  accessToken: string,
): Promise<{ supabase: SupabaseClient<Database>; user: User }> {
  if (typeof window !== 'undefined') {
    throw new Error('createServerSupabaseClient must run on the server')
  }

  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !publishableKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY')
  }
  if (!accessToken) {
    throw new Error('Missing authenticated Supabase access token')
  }

  const supabase = createClient<Database>(url, publishableKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  // Auth confirms the JWT belongs to a real user; Postgres RLS checks ownership.
  const { data, error } = await supabase.auth.getUser(accessToken)
  if (error || !data.user) {
    throw new Error('Unauthorized: invalid or expired Supabase session')
  }

  return { supabase, user: data.user }
}
