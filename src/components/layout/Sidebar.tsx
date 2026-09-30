import { Link } from '@tanstack/react-router'

const dashboardLinks = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Portfolio', to: '/dashboard/portfolio' },
  { label: 'Deals', to: '/dashboard/deals' },
  { label: 'Profile', to: '/dashboard/profile' },
] as const

export default function Sidebar() {
  return (
    <aside className="border-b border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 md:min-h-screen md:border-r md:border-b-0 md:px-5 md:py-8">
      <nav
        aria-label="Dashboard navigation"
        className="mx-auto flex max-w-6xl gap-2 overflow-x-auto md:mx-0 md:flex-col md:gap-1"
      >
        {dashboardLinks.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="inline-flex min-h-11 shrink-0 items-center rounded-md px-4 text-sm font-semibold text-[var(--sea-ink-soft)] no-underline transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lagoon-deep)]"
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}