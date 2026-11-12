import { createServerFn } from '@tanstack/react-start'

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { createServerSupabaseClient } =
      await import('../supabase/server')
    const { user } = await createServerSupabaseClient()
    return user ? { id: user.id, email: user.email ?? null } : null
  },
)

export const signOut = createServerFn({ method: 'POST' }).handler(
  async () => {
    const { createServerSupabaseClient } =
      await import('../supabase/server')
    const { supabase } = await createServerSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  },
)
