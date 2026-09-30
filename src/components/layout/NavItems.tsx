import { Link } from '@tanstack/react-router'
import { navConfig } from './navConfig'

const baseLinkClassName =
  'inline-flex min-h-11 shrink-0 items-center rounded-md border px-4 text-sm font-semibold no-underline transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lagoon-deep)]'

export default function NavItems() {
  return (
    <nav
      aria-label="Dashboard navigation"
      className="mx-auto flex max-w-6xl gap-2 overflow-x-auto md:mx-0 md:flex-col md:gap-1"
    >
      {navConfig.map(({ label, to }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: true }}
          className={`${baseLinkClassName} border-transparent text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]`}
          activeProps={{
            className: `${baseLinkClassName} border-[var(--chip-line)] bg-[var(--sand)] text-[var(--sea-ink)] shadow-sm`,
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}