import type { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-workspace">
        <Header />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  )
}