import { createFileRoute } from '@tanstack/react-router'
import DealsList from '../../components/dashboard/DealsList'

export const Route = createFileRoute('/dashboard/deals')({
  component: Deals,
})

function Deals() {
  return (
    <main>
      <h1>Deals</h1>
      <DealsList />
    </main>
  )
}
