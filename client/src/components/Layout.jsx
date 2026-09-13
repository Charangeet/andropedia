import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/members', label: 'Members' },
  { to: '/data-entry', label: 'Data Entry' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="bg-paper border-b border-hairline">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-3 sm:gap-8 h-16">
          <span className="flex items-center gap-2 font-semibold text-[18px] shrink-0 tracking-[-0.025em] text-ink">
            <img src="/logo.png" alt="Andropedia" className="h-8 w-8 rounded-md object-cover" />
            <span>ANDROPEDIA</span>
          </span>
          <nav className="flex gap-1 overflow-x-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-buttons text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'bg-ink text-surface-alt' : 'text-mid-gray hover:bg-canvas hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
