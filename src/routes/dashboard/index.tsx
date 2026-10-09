import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Dashboard Overview</h2>
      <p className="text-slate-600">Metrics will appear here.</p>
    </div>
  )
}
