export type DashboardNavItem = {
  label: string
  to: `/${string}`
  pageTitle: string
}

export const navConfig = [
  { label: 'Home', to: '/dashboard', pageTitle: 'Dashboard overview' },
  {
    label: 'Portfolio',
    to: '/dashboard/portfolio',
    pageTitle: 'Portfolio',
  },
  { label: 'Deals', to: '/dashboard/deals', pageTitle: 'Deals' },
  { label: 'Profile', to: '/dashboard/profile', pageTitle: 'Profile' },
] as const satisfies readonly DashboardNavItem[]

export function getDashboardPageTitle(pathname: string) {
  const normalizedPathname = pathname.replace(/\/$/, '')
  return (
    navConfig.find(({ to }) => to === normalizedPathname)?.pageTitle ??
    navConfig[0].pageTitle
  )
}