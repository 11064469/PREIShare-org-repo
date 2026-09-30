export type DealStatus = 'Open' | 'Closing Soon' | 'Waitlist'

export type OpenDeal = {
  name: string
  locationOrAssetClass: string
  status: DealStatus
} & (
  | { targetRaise: string; minimumInvestment?: never }
  | { targetRaise?: never; minimumInvestment: string }
)

export const MOCK_OPEN_DEALS: OpenDeal[] = [
  {
    name: 'Oakridge Multifamily',
    locationOrAssetClass: 'Austin, TX',
    targetRaise: '$2.4M',
    status: 'Open',
  },
  {
    name: 'Riverside Logistics Park',
    locationOrAssetClass: 'Industrial',
    minimumInvestment: '$10,000',
    status: 'Closing Soon',
  },
  {
    name: 'Maple Street Residences',
    locationOrAssetClass: 'Denver, CO',
    minimumInvestment: '$5,000',
    status: 'Waitlist',
  },
]

interface DealsListProps {
  deals?: OpenDeal[]
}

const statusStyles: Record<DealStatus, string> = {
  Open: 'bg-[var(--sand)] text-[var(--palm)]',
  'Closing Soon': 'bg-[var(--hero-a)] text-[var(--sea-ink)]',
  Waitlist: 'bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]',
}

export default function DealsList({
  deals = MOCK_OPEN_DEALS,
}: DealsListProps) {
  return (
    <section
      aria-labelledby="open-deals-title"
      className="feature-card rounded-lg border border-[var(--line)] p-5"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="open-deals-title"
          className="m-0 text-lg font-bold text-[var(--sea-ink)]"
        >
          Open Deals
        </h2>
        <p className="m-0 text-xs font-semibold text-[var(--sea-ink-soft)]">
          Sample data
        </p>
      </div>

      {deals.length === 0 ? (
        <p className="m-0 py-6 text-sm text-[var(--sea-ink-soft)]">
          No open deals are available right now.
        </p>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {deals.map((deal) => {
            const investmentLabel = deal.targetRaise
              ? 'Target raise'
              : 'Minimum investment'
            const investmentValue =
              deal.targetRaise ?? deal.minimumInvestment

            return (
              <li
                key={deal.name}
                className="rounded-md border border-[var(--line)] bg-[var(--surface)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="m-0 text-base font-bold text-[var(--sea-ink)]">
                    {deal.name}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[deal.status]}`}
                  >
                    {deal.status}
                  </span>
                </div>
                <p className="mb-0 mt-2 text-sm text-[var(--sea-ink-soft)]">
                  {deal.locationOrAssetClass}
                </p>
                <p className="mb-0 mt-4 text-xs font-semibold text-[var(--sea-ink-soft)]">
                  {investmentLabel}
                </p>
                <p className="mb-0 mt-1 text-base font-bold text-[var(--sea-ink)]">
                  {investmentValue}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}