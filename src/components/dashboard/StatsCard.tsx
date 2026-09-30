interface StatsCardProps {
  title: string
  value: string | number
  hint?: string
}

export default function StatsCard({ title, value, hint }: StatsCardProps) {
  return (
    <article className="feature-card dashboard-widget rounded-lg border border-[var(--line)] p-5">
      <h2 className="m-0 text-sm font-semibold text-[var(--sea-ink-soft)]">
        {title}
      </h2>
      <p className="mb-0 mt-3 text-3xl font-extrabold text-[var(--sea-ink)]">
        {value}
      </p>
      {hint ? (
        <p className="mb-0 mt-2 text-sm text-[var(--sea-ink-soft)]">{hint}</p>
      ) : null}
    </article>
  )
}