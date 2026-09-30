import { createFileRoute } from '@tanstack/react-router'
import PortfolioSummary from '../../components/dashboard/PortfolioSummary'
import RecentActivity from '../../components/dashboard/RecentActivity'
import StatsCard from '../../components/dashboard/StatsCard'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
})

function DashboardOverview() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="m-0 text-2xl font-bold text-[var(--sea-ink)]">
          Dashboard overview
        </h1>
        <p className="mb-0 mt-2 text-sm text-[var(--sea-ink-soft)]">
          The investor information shown here is sample data for demonstration
          only.
        </p>
      </div>

      <section
        aria-label="Sample portfolio metrics"
        className="dashboard-stats-grid"
      >
        <StatsCard title="Total Portfolio Value" value="$200,000" hint="Sample data" />
        <StatsCard title="Open Deals" value={3} hint="Sample data" />
        <StatsCard title="Contributions YTD" value="$12,500" hint="Sample data" />
      </section>

      <div className="dashboard-overview-grid">
        <PortfolioSummary />
        <RecentActivity />
      </div>
    </main>
  )
}
