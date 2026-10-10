import type { ReactNode } from 'react'
import Header from './Header'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'

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
        <Sidebar />

        <div className="flex-1">
          <div className="px-4 pt-4 lg:hidden">
            <MobileNav />
          </div>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
