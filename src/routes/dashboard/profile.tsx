import { createFileRoute } from '@tanstack/react-router'
import ProfileCard from '../../components/dashboard/ProfileCard'

export const Route = createFileRoute('/dashboard/profile')({
  component: Profile,
})

function Profile() {
  return (
    <main>
      <h1>Profile</h1>
      <ProfileCard />
    </main>
  )
}
