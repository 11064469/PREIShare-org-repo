import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
})

function DashboardOverview() {
  return (
    <main>
      <h1>Dashboard overview</h1>
    </main>
  )
}
