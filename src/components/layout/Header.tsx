import { useRouterState } from '@tanstack/react-router'
import { getDashboardPageTitle } from './navConfig'

export default function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <header className="border-b border-[var(--line)] bg-[var(--header-bg)] px-5 py-4 backdrop-blur-lg sm:px-8">
      <div className="mx-auto flex min-h-12 max-w-6xl items-center">
        <div>
          <p className="m-0 text-lg font-extrabold text-[var(--sea-ink)]">
            PREIshare
          </p>
          <p className="m-0 mt-0.5 text-xs font-semibold text-[var(--sea-ink-soft)] sm:text-sm">
            {getDashboardPageTitle(pathname)}
          </p>
        </div>
      </div>
    </header>
  )
}