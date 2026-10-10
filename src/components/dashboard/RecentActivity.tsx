export interface ActivityEntry {
  id: string
  description: string
  date: string
  type?: string
}

interface RecentActivityProps {
  title?: string
  activities?: ActivityEntry[]
  emptyMessage?: string
}

export default function RecentActivity({
  title = 'Recent Activity',
  activities = [],
  emptyMessage = 'No recent activity.',
}: RecentActivityProps) {
  return (
    <section
      aria-labelledby="recent-activity-title"
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="recent-activity-title" className="m-0 text-lg font-bold text-slate-900">
          {title}
        </h2>
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Updates
        </p>
      </div>

      {activities.length > 0 ? (
        <ol className="m-0 mt-4 list-none divide-y divide-slate-200 p-0">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium text-slate-800">{activity.description}</p>
                {activity.type ? (
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {activity.type}
                  </p>
                ) : null}
              </div>
              <time className="text-sm text-slate-500">{activity.date}</time>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">
          {emptyMessage}
        </p>
      )}
    </section>
  )
}