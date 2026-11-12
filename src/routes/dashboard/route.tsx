import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import AppShell from '../../components/dashboard/AppShell'
import { getCurrentUser, signOut } from '../../lib/auth/session'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (!user) {
      throw redirect({ to: '/auth/login' })
    }
    return { user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user } = Route.useRouteContext()
  const [signOutError, setSignOutError] = useState('')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const navigate = Route.useNavigate()

  async function handleSignOut() {
    setSignOutError('')
    setIsSigningOut(true)

    try {
      await signOut()
      await navigate({ to: '/auth/login', replace: true })
    } catch (error) {
      setSignOutError(
        error instanceof Error ? error.message : 'Unable to sign out.',
      )
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <AppShell
      title="Dashboard"
      subtitle="Investor overview"
      userName={user.email ?? 'Sponsor'}
    >
      <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
        {signOutError ? (
          <p className="text-sm font-medium text-red-700" role="alert">
            {signOutError}
          </p>
        ) : null}
        <button
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSigningOut}
          onClick={handleSignOut}
          type="button"
        >
          {isSigningOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
      <Outlet />
    </AppShell>
  )
}
