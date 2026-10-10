type MetricCardProps = {
  label: string
  value: string | number
  helperText?: string
  changeText?: string
}

export default function MetricCard({
  label,
  value,
  helperText,
  changeText,
}: MetricCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>

      {(helperText || changeText) && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          {helperText ? <span className="text-slate-500">{helperText}</span> : null}
          {changeText ? (
            <span className="font-medium text-emerald-600">{changeText}</span>
          ) : null}
        </div>
      )}
    </article>
  )
}
