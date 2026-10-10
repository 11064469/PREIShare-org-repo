export interface PortfolioHolding {
  name: string
  value: string
  allocation?: string
}

interface PortfolioSummaryProps {
  title?: string
  totalValue?: string
  holdings?: PortfolioHolding[]
  summaryLabel?: string
}

export default function PortfolioSummary({
  title = 'Portfolio Summary',
  totalValue = '—',
  holdings = [],
  summaryLabel = 'Sample portfolio data',
}: PortfolioSummaryProps) {
  return (
    <section
      aria-labelledby="portfolio-summary-title"
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="portfolio-summary-title"
          className="m-0 text-lg font-bold text-slate-900"
        >
          {title}
        </h2>
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {summaryLabel}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <span className="text-sm text-slate-500">Total value</span>
        <span className="text-lg font-semibold text-slate-900">{totalValue}</span>
      </div>

      {holdings.length > 0 ? (
        <ul className="m-0 mt-4 list-none divide-y divide-slate-200 p-0">
          {holdings.map((holding) => (
            <li key={holding.name} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-semibold text-slate-800">{holding.name}</p>
                {holding.allocation ? (
                  <p className="text-sm text-slate-500">{holding.allocation}</p>
                ) : null}
              </div>
              <span className="text-right text-sm font-semibold text-slate-700">
                {holding.value}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">
          No holdings available yet.
        </p>
      )}
    </section>
  )
}