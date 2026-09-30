import type { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0">
        <Header />
        <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-6xl bg-[var(--foam)] px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          {children}
        </main>
      </div>
    </div>
  )
}