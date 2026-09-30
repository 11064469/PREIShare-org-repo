export interface PortfolioHolding {
  property: string
  type: string
  investedAmount: string
  currentValue: string
  status: string
}

export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  {
    property: 'Harbor Flats',
    type: 'Residential',
    investedAmount: '$25,000',
    currentValue: '$27,500',
    status: 'Active',
  },
  {
    property: 'Cedar Commerce Center',
    type: 'Commercial',
    investedAmount: '$15,000',
    currentValue: '$16,200',
    status: 'Active',
  },
  {
    property: 'Willow Creek Homes',
    type: 'Residential',
    investedAmount: '$10,000',
    currentValue: '$10,400',
    status: 'Fully funded',
  },
]

interface PortfolioTableProps {
  holdings?: PortfolioHolding[]
}

export default function PortfolioTable({
  holdings = MOCK_PORTFOLIO_HOLDINGS,
}: PortfolioTableProps) {
  return (
    <section
      aria-labelledby="portfolio-holdings-title"
      className="feature-card dashboard-widget rounded-lg border border-[var(--line)] p-5"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="portfolio-holdings-title"
          className="m-0 text-lg font-bold text-[var(--sea-ink)]"
        >
          Portfolio Holdings
        </h2>
        <p className="m-0 text-xs font-semibold text-[var(--sea-ink-soft)]">
          Sample data
        </p>
      </div>

      {holdings.length === 0 ? (
        <p className="m-0 py-6 text-sm text-[var(--sea-ink-soft)]">
          No portfolio holdings to display.
        </p>
      ) : (
        <div
          className="dashboard-table-scroll overflow-x-auto"
          role="region"
          aria-label="Portfolio holdings table"
          tabIndex={0}
        >
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--sea-ink-soft)]">
                <th scope="col" className="px-3 py-3 font-semibold">
                  Property
                </th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Type
                </th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">
                  Invested Amount
                </th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">
                  Current Value
                </th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr
                  key={holding.property}
                  className="border-b border-[var(--line)] last:border-0"
                >
                  <th
                    scope="row"
                    className="px-3 py-3 font-semibold text-[var(--sea-ink)]"
                  >
                    {holding.property}
                  </th>
                  <td className="px-3 py-3 text-[var(--sea-ink-soft)]">
                    {holding.type}
                  </td>
                  <td className="px-3 py-3 text-right text-[var(--sea-ink)]">
                    {holding.investedAmount}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-[var(--sea-ink)]">
                    {holding.currentValue}
                  </td>
                  <td className="px-3 py-3 text-[var(--sea-ink-soft)]">
                    {holding.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}