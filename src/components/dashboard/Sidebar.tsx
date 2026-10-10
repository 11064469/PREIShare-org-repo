import { Link, useLocation } from '@tanstack/react-router'
import { navConfig } from '../layout/navConfig'

export default function Sidebar() {
  const pathname = useLocation({
    select: (state) => state.location.pathname,
  })

  return (
    <aside
      className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block"
      aria-label="Dashboard sidebar navigation"
    >
      <nav aria-label="Dashboard navigation" className="flex flex-col gap-2 p-4">
        {navConfig.map(({ label, to }) => {
          const isActive =
            pathname === to || (to === '/dashboard' && pathname === '/dashboard/')

          return (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              className={[
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')}
              activeProps={{
                className: 'rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white',
                'aria-current': 'page',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
