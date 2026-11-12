import { createFileRoute, Link } from '@tanstack/react-router'
import ListingCard from '../../../components/listings/ListingCard'
import type { PropertyListing } from '../../../lib/supabase/types'
import { listListings } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/')({
  loader: () => listListings(),
  pendingComponent: ListingsLoading,
  errorComponent: ListingsError,
  component: ListingsPage,
})

function ListingsLoading() {
  return (
    <section aria-busy="true" aria-live="polite">
      <p className="text-sm text-[var(--sea-ink-soft)]">Loading properties…</p>
    </section>
  )
}

function ListingsError({ error }: { error: unknown }) {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred.'

  return (
    <section aria-labelledby="listings-error-title" className="space-y-3">
      <h1 className="text-2xl font-bold text-[var(--sea-ink)]" id="listings-error-title">
        Unable to load properties
      </h1>
      <p className="text-sm text-red-700" role="alert">
        {message}
      </p>
      <button
        className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold"
        onClick={() => window.location.reload()}
        type="button"
      >
        Try again
      </button>
    </section>
  )
}

function ListingsPage() {
  const listings = Route.useLoaderData()

  return (
    <section aria-labelledby="listings-title" className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="island-kicker text-sm font-semibold uppercase tracking-wide">
            Sponsor portfolio
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--sea-ink)]" id="listings-title">
            Properties
          </h1>
        </div>
        <Link
          className="inline-flex rounded-full bg-[var(--palm)] px-5 py-3 text-sm font-semibold text-white no-underline transition hover:opacity-90"
          to="/dashboard/listings/new"
        >
          Add Property
        </Link>
      </header>

      {listings.length === 0 ? (
        <p className="island-shell rounded-2xl p-6 text-[var(--sea-ink-soft)]">
          No properties yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map((listing: PropertyListing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}
