export interface PortfolioHolding {
  name: string
  allocation: string
  value: string
}

export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  { name: 'Residential Fund', allocation: '60%', value: '$120,000' },
  { name: 'Commercial Fund', allocation: '40%', value: '$80,000' },
]

interface PortfolioSummaryProps {
  holdings?: PortfolioHolding[]
}

export default function PortfolioSummary({
  holdings = MOCK_PORTFOLIO_HOLDINGS,
}: PortfolioSummaryProps) {
  return (
    <section
      aria-labelledby="portfolio-summary-title"
      className="feature-card rounded-lg border border-[var(--line)] p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="portfolio-summary-title"
          className="m-0 text-lg font-bold text-[var(--sea-ink)]"
        >
          Portfolio Summary
        </h2>
        <p className="m-0 text-xs font-semibold text-[var(--sea-ink-soft)]">
          Sample data
        </p>
      </div>
      <ul className="m-0 mt-4 list-none divide-y divide-[var(--line)] p-0">
        {holdings.map((holding) => (
          <li
            key={holding.name}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_5rem_7rem]"
          >
            <span className="font-semibold text-[var(--sea-ink)]">
              {holding.name}
            </span>
            <span className="text-right text-sm text-[var(--sea-ink-soft)]">
              {holding.allocation}
            </span>
            <span className="col-span-2 text-right text-sm font-semibold text-[var(--sea-ink)] sm:col-span-1">
              {holding.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}