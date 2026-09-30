import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: Profile,
})

function Profile() {
  return (
    <main>
      <h1>Profile</h1>
    </main>
  )
}
