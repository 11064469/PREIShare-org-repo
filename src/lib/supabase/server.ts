/**
 * Server-only Supabase helper for sponsor-scoped requests.
 * Import ONLY from TanStack Start server functions/loaders, never UI modules.
 * Uses public credentials with the request's verified user session so RLS applies.
 */
import '@tanstack/react-start/server-only'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import {
  getCookies,
  setCookie,
  setResponseHeader,
} from '@tanstack/react-start/server'
import type { Database } from './types'

function setPrivateNoStoreHeaders() {
  setResponseHeader('cache-control', 'private, no-store')
}

export async function createServerSupabaseClient(): Promise<{
  supabase: SupabaseClient<Database>
  user: User | null
}> {
  if (typeof window !== 'undefined') {
    throw new Error('createServerSupabaseClient must run on the server')
  }

  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !publishableKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY')
  }

  setPrivateNoStoreHeaders()

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookieOptions: {
      path: '/',
      sameSite: 'lax',
      secure: import.meta.env.PROD,
    },
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(cookies, headers) {
        for (const { name, value, options } of cookies) {
          setCookie(name, value, options)
        }

        if (headers['Cache-Control']) {
          setResponseHeader('cache-control', headers['Cache-Control'])
        }
        if (headers.Expires) {
          setResponseHeader('expires', headers.Expires)
        }
        if (headers.Pragma) {
          setResponseHeader('pragma', headers.Pragma)
        }

        setPrivateNoStoreHeaders()
      },
    },
  })

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()
  if (sessionError) {
    throw sessionError
  }
  if (!sessionData.session) {
    return { supabase, user: null }
  }

  // Verify the cookie-backed session with Auth; do not trust its stored user.
  const { data, error } = await supabase.auth.getUser(
    sessionData.session.access_token,
  )
  if (error) {
    if (error.status === 401) {
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'local',
      })
      if (signOutError) {
        throw signOutError
      }
      return { supabase, user: null }
    }
    throw error
  }

  return { supabase, user: data.user }
}
