import { createFileRoute, Outlet } from '@tanstack/react-router'
import AppShell from '../../components/dashboard/AppShell'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <AppShell title="Dashboard" subtitle="Investor overview" userName="Investor">
      <Outlet />
    </AppShell>
  )
}
