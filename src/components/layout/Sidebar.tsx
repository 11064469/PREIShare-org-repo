import NavItems from './NavItems'

export default function Sidebar() {
  return (
    <aside className="border-b border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 md:min-h-screen md:border-r md:border-b-0 md:px-5 md:py-8">
      <NavItems />
    </aside>
  )
}