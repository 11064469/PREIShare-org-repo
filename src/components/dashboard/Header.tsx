type HeaderProps = {
  title?: string
  subtitle?: string
  userName?: string
}

export default function Header({ title, subtitle, userName = 'Investor' }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            PREIshare
          </p>
          {title ? (
            <h1 className="mt-1 text-xl font-bold text-slate-900">{title}</h1>
          ) : null}
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>

        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {userName}
        </div>
      </div>
    </header>
  )
}
