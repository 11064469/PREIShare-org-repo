import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { createBrowserSupabaseClient } from '../../lib/supabase/client'

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === 'string' ? search.code : undefined,
    errorDescription:
      typeof search.error_description === 'string'
        ? search.error_description
        : undefined,
  }),
  component: AuthCallbackPage,
})

function AuthCallbackPage() {
  const { code, errorDescription } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const callbackStarted = useRef(false)

  useEffect(() => {
    let isActive = true

    async function completeSignIn() {
      if (callbackStarted.current) {
        return
      }
      callbackStarted.current = true

      if (errorDescription) {
        setErrorMessage(errorDescription)
        return
      }
      if (!code) {
        setErrorMessage('The confirmation link is incomplete or has expired.')
        return
      }

      try {
        const supabase = createBrowserSupabaseClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          throw error
        }
        if (isActive) {
          await navigate({ to: '/dashboard', replace: true })
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to confirm your email.',
          )
        }
      }
    }

    void completeSignIn()
    return () => {
      isActive = false
    }
  }, [code, errorDescription, navigate])

  return (
    <main className="page-wrap px-4 py-12 sm:py-16">
      <section
        aria-live="polite"
        className="island-shell mx-auto max-w-md rounded-[2rem] p-6 sm:p-9"
      >
        <p className="island-kicker mb-2 text-sm font-semibold uppercase tracking-wide">
          PREIshare sponsor access
        </p>
        <h1 className="display-title mb-4 text-3xl font-bold text-[var(--sea-ink)]">
          Confirming your email
        </h1>
        {errorMessage ? (
          <>
            <p className="mb-5 text-sm font-medium text-red-700" role="alert">
              {errorMessage}
            </p>
            <Link className="font-semibold" to="/auth/login">
              Return to sign in
            </Link>
          </>
        ) : (
          <p className="text-sm text-[var(--sea-ink-soft)]">
            Please wait while we verify your confirmation link.
          </p>
        )}
      </section>
    </main>
  )
}
