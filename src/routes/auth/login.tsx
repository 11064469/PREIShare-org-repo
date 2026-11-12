import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '../../lib/supabase/client'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = Route.useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const supabase = createBrowserSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      await navigate({ to: '/dashboard', replace: true })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to sign in.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-12 sm:py-16">
      <section className="island-shell mx-auto max-w-md rounded-[2rem] p-6 sm:p-9">
        <p className="island-kicker mb-2 text-sm font-semibold uppercase tracking-wide">
          PREIshare sponsor access
        </p>
        <h1 className="display-title mb-6 text-3xl font-bold text-[var(--sea-ink)]">
          Sign in
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="login-email">
              Email
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--sea-ink)] outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
              id="login-email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="login-password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--sea-ink)] outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
              id="login-password"
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

          <button
            className="w-full rounded-full bg-[var(--palm)] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm">
          New to PREIshare?{' '}
          <Link className="font-semibold" to="/auth/signup">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}
