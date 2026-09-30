import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/deals')({
  component: Deals,
})

function Deals() {
  return (
    <main>
      <h1>Deals</h1>
    </main>
  )
}
