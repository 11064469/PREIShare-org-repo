import type { PropertyListing } from '../../lib/supabase/types'

type ListingCardProps = {
  listing: PropertyListing
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="feature-card rounded-xl border border-[var(--line)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="m-0 break-words text-lg font-bold text-[var(--sea-ink)]">
            {listing.title}
          </h2>
          <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
            {[listing.city, listing.country].filter(Boolean).join(', ')}
          </p>
        </div>
        <span className="rounded-full bg-[var(--sand)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink)]">
          {listing.status}
        </span>
      </div>
      {listing.price != null ? (
        <p className="mt-4 text-sm font-semibold text-[var(--sea-ink)]">
          Price: {listing.price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ) : null}
    </article>
  )
}
