import type { ReactNode } from 'react'
import Header from './Header'

type AppShellProps = {
  children: ReactNode
  title?: string
  subtitle?: string
  userName?: string
}

export default function AppShell({
  children,
  title,
  subtitle,
  userName = 'Investor',
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header title={title} subtitle={subtitle} userName={userName} />

      <div className="mx-auto flex w-full max-w-7xl">
        <aside
          className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block"
          aria-label="Dashboard navigation placeholder"
        />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
