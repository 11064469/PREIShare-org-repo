import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({ component: DashboardLayout })

function DashboardLayout() {
  return (
    <main className="page-wrap px-4 py-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2">Dashboard content will appear here.</p>
      <Outlet />
    </main>
  )
}