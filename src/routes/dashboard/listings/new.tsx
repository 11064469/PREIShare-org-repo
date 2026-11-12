import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import ListingForm from '../../../components/listings/ListingForm'
import type { CreateListingInput } from '../../../lib/listings/schema'
import { createListing } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/new')({
  component: NewListingPage,
})

function NewListingPage() {
  const navigate = Route.useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  async function handleCreate(listing: CreateListingInput) {
    setServerError('')
    setIsSubmitting(true)

    try {
      await createListing({ data: listing })
      await navigate({ to: '/dashboard/listings', replace: true })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save this property.'
      setServerError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="new-listing-title" className="mx-auto max-w-3xl space-y-5">
      <header>
        <Link className="text-sm font-semibold" to="/dashboard/listings">
          ← Back to properties
        </Link>
        <h1
          className="mt-4 text-2xl font-bold text-[var(--sea-ink)]"
          id="new-listing-title"
        >
          Add Property
        </h1>
      </header>

      <ListingForm
        isSubmitting={isSubmitting}
        onSubmit={handleCreate}
        serverError={serverError}
      />
    </section>
  )
}
