import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '../../lib/supabase/client'

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = Route.useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setConfirmationMessage('')
    setIsSubmitting(true)

    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: new URL('/auth/callback', window.location.origin).toString(),
        },
      })

      if (error) {
        setErrorMessage(error.message)
      } else if (data.session) {
        await navigate({ to: '/dashboard', replace: true })
      } else {
        setConfirmationMessage(
          'Check your email for a confirmation link. After confirming, you will be signed in.',
        )
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to create your account.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-12 sm:py-16">
      <section className="island-shell mx-auto max-w-md rounded-[2rem] p-6 sm:p-9">
        <p className="island-kicker mb-2 text-sm font-semibold uppercase tracking-wide">
          PREIshare sponsor account
        </p>
        <h1 className="display-title mb-6 text-3xl font-bold text-[var(--sea-ink)]">
          Create your account
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="signup-email">
              Email
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--sea-ink)] outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
              id="signup-email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="signup-password">
              Password
            </label>
            <input
              autoComplete="new-password"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--sea-ink)] outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
              id="signup-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>

          {errorMessage ? (
            <p className="text-sm font-medium text-red-700" role="alert">
              {errorMessage}
            </p>
          ) : null}
          {confirmationMessage ? (
            <p className="text-sm font-medium text-emerald-800" role="status">
              {confirmationMessage}
            </p>
          ) : null}

          <button
            className="w-full rounded-full bg-[var(--palm)] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-sm">
          Already have an account?{' '}
          <Link className="font-semibold" to="/auth/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
