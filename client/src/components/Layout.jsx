import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'
import SearchBox from './SearchBox'

const publicLinks = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/members', label: 'Members' },
  { to: '/compare', label: 'Compare' },
  { to: '/rsvp', label: 'RSVP' },
]

const coordinatorLinks = [
  { to: '/data-entry', label: 'Data Entry' },
  { to: '/events', label: 'Events' },
  { to: '/settings', label: 'Settings' },
  { to: '/audit-log', label: 'Audit Log' },
]

export default function Layout() {
  const [theme, toggleTheme] = useTheme()
  const { authenticated, logout } = useAuth()
  const navigate = useNavigate()

  const links = authenticated ? [...publicLinks, ...coordinatorLinks] : publicLinks

  async function handleLogout() {
    await logout()
    navigate('/')
  }

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

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <SearchBox />
            {authenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-buttons text-sm font-medium text-mid-gray hover:bg-canvas hover:text-ink transition-colors whitespace-nowrap"
              >
                Log out
              </button>
            ) : (
              <NavLink
                to="/login"
                className="px-3 py-2 rounded-buttons text-sm font-medium text-mid-gray hover:bg-canvas hover:text-ink transition-colors whitespace-nowrap"
              >
                Log in
              </NavLink>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-buttons text-mid-gray hover:bg-canvas hover:text-ink transition-colors"
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
