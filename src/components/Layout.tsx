import { Link, NavLink, Outlet } from 'react-router-dom'
import { useEventStore } from '../store/useEventStore'
import { cn } from '../utils/format'

const navItems = [
  { label: 'Overview', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'New event', to: '/events/new' },
]

export function Layout() {
  const eventCount = useEventStore((state) => state.events.length)

  return (
    <div className="app-shell panel-grid">
      <div className="flex min-h-screen w-full max-w-[1800px] flex-col lg:flex-row">
        <aside className="border-b border-brand-900/30 bg-brand-800 px-5 py-6 text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:border-brand-900/30">
          <Link className="inline-block" to="/">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-200/80">
              Eventise
            </p>
            <h1 className="section-title mt-3 text-3xl font-semibold">Local event control room</h1>
          </Link>

          <p className="mt-4 text-sm text-slate-300">
            Keep permits, logistics, services, documents, and progress in one place.
          </p>

          <div className="mt-8 rounded-3xl border border-brand-200/20 bg-brand-200/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Workspace status
            </p>
            <p className="section-title mt-3 text-4xl font-semibold">{eventCount}</p>
            <p className="mt-2 text-sm text-slate-300">
              Active events saved locally with persistent progress tracking.
            </p>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    isActive
                      ? 'bg-brand-100 text-slate-950'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white',
                  )
                }
                end={item.to === '/'}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-brand-200/20 bg-brand-200/10 p-4 text-sm text-slate-200">
            Local MVP mode is enabled. Changes persist in `localStorage`, so refreshes keep the latest event state.
          </div>
        </aside>

        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
