import { Link } from '@tanstack/react-router'
import { navConfig } from './navConfig'

const baseLinkClassName =
  'dashboard-nav__link'

export default function NavItems() {
  return (
    <nav
      aria-label="Dashboard navigation"
      className="dashboard-nav"
    >
      {navConfig.map(({ label, to }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: true }}
          className={baseLinkClassName}
          activeProps={{
            className: baseLinkClassName,
            'aria-current': 'page',
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}