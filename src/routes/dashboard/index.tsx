import { createFileRoute } from '@tanstack/react-router'
import MetricCard from '../../components/dashboard/MetricCard'
import PortfolioSummary from '../../components/dashboard/PortfolioSummary'
import RecentActivity from '../../components/dashboard/RecentActivity'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

const portfolioHoldings = [
  { name: 'Residential Fund', value: '$120,000', allocation: '60%' },
  { name: 'Commercial Fund', value: '$80,000', allocation: '40%' },
]

const recentActivity = [
  {
    id: 'distribution-posted',
    description: 'Distribution posted',
    date: 'Jun 12',
    type: 'Cash flow',
  },
  {
    id: 'portfolio-updated',
    description: 'Portfolio statement updated',
    date: 'Jun 08',
    type: 'Reporting',
  },
  {
    id: 'deal-added',
    description: 'New deal added to watchlist',
    date: 'Jun 03',
    type: 'Opportunity',
  },
]

function DashboardHome() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Investor overview
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard overview</h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total portfolio value"
          value="$200,000"
          helperText="Sample data"
          changeText="+4.2%"
        />
        <MetricCard
          label="Open deals"
          value="3"
          helperText="Sample data"
          changeText="2 new"
        />
        <MetricCard
          label="Contributions YTD"
          value="$12,500"
          helperText="Sample data"
          changeText="+1.5%"
        />
        <MetricCard
          label="Account status"
          value="Active"
          helperText="Sample data"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PortfolioSummary
          title="Portfolio Summary"
          totalValue="$200,000"
          holdings={portfolioHoldings}
          summaryLabel="Sample portfolio data"
        />

        <RecentActivity
          title="Recent Activity"
          activities={recentActivity}
          emptyMessage="No recent activity to show yet."
        />
      </section>
    </div>
  )
}
