import { Link, NavLink, Outlet } from 'react-router-dom'
import { cn } from '../utils/format'

const navItems = [
  { label: 'Übersicht', to: '/' },
  { label: 'Neue Veranstaltung', to: '/events/new' },
]

export function Layout() {
  return (
    <div className="app-shell panel-grid">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="overflow-visible border-b border-white/20 bg-[#1A3526] px-5 py-6 text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:border-white/10">
          <Link
            className="relative left-1/2 flex w-fit -translate-x-1/2 flex-col items-center gap-1 text-center"
            to="/"
          >
            <img
              alt="Eventise"
              className="h-80 w-80 max-w-none shrink-0 drop-shadow-lg"
              src="/logo.png"
            />
          </Link>

          <nav className="mt-6 flex flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    isActive
                      ? 'bg-brand-500 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                  )
                }
                end={item.to === '/'}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
