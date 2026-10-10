import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { navConfig } from '../layout/navConfig'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = useLocation({
    select: (state) => state.location.pathname,
  })

  const toggleLabel = isOpen ? 'Close menu' : 'Open menu'

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={toggleLabel}
        aria-expanded={isOpen}
        aria-controls="dashboard-mobile-navigation"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
      >
        {toggleLabel}
      </button>

      {isOpen ? (
        <nav
          id="dashboard-mobile-navigation"
          aria-label="Mobile dashboard navigation"
          className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
        >
          {navConfig.map(({ label, to }) => {
            const isActive =
              pathname === to || (to === '/dashboard' && pathname === '/dashboard/')

            return (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                activeOptions={{ exact: true }}
                className={[
                  'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')}
                activeProps={{
                  className:
                    'block rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white',
                  'aria-current': 'page',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      ) : null}
    </div>
  )
}
