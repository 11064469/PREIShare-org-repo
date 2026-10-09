import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">PREIshare Dashboard</h1>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
