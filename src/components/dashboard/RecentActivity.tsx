export interface ActivityEntry {
  id: string
  description: string
  date: string
}

export const MOCK_RECENT_ACTIVITY: ActivityEntry[] = [
  { id: 'distribution', description: 'Distribution posted', date: 'Jun 12' },
  { id: 'statement', description: 'Portfolio statement updated', date: 'Jun 08' },
  { id: 'opportunity', description: 'New opportunity added', date: 'Jun 03' },
  { id: 'profile', description: 'Profile details reviewed', date: 'May 28' },
]

interface RecentActivityProps {
  activities?: ActivityEntry[]
}

export default function RecentActivity({
  activities = MOCK_RECENT_ACTIVITY,
}: RecentActivityProps) {
  return (
    <section
      aria-labelledby="recent-activity-title"
      className="feature-card dashboard-widget rounded-lg border border-[var(--line)] p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="recent-activity-title"
          className="m-0 text-lg font-bold text-[var(--sea-ink)]"
        >
          Recent Activity
        </h2>
        <p className="m-0 text-xs font-semibold text-[var(--sea-ink-soft)]">
          Sample data
        </p>
      </div>
      <ol className="m-0 mt-4 list-none divide-y divide-[var(--line)] p-0">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="dashboard-activity-entry flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0"
          >
            <span className="font-medium text-[var(--sea-ink)]">
              {activity.description}
            </span>
            <time className="text-sm text-[var(--sea-ink-soft)]">
              {activity.date}
            </time>
          </li>
        ))}
      </ol>
    </section>
  )
}