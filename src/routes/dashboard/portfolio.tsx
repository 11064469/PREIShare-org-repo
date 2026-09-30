import { createFileRoute } from '@tanstack/react-router'
import PortfolioTable from '../../components/dashboard/PortfolioTable'

export const Route = createFileRoute('/dashboard/portfolio')({
  component: Portfolio,
})

function Portfolio() {
  return (
    <main>
      <h1>Portfolio</h1>
      <PortfolioTable />
    </main>
  )
}