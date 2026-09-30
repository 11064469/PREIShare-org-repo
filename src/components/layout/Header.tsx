import { useRouterState } from '@tanstack/react-router'
import { getDashboardPageTitle } from './navConfig'

export default function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__inner">
        <div className="dashboard-brand-block">
          <p className="dashboard-brand">PREIshare</p>
          <p className="dashboard-page-title">
            {getDashboardPageTitle(pathname)}
          </p>
        </div>
      </div>
    </header>
  )
}