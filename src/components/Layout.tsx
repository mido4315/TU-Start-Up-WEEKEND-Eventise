import { Link, NavLink, Outlet } from 'react-router-dom'
import { useEventStore } from '../store/useEventStore'
import { cn } from '../utils/format'

const navItems = [
  { label: 'Übersicht', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Neue Veranstaltung', to: '/events/new' },
]

export function Layout() {
  const eventCount = useEventStore((state) => state.events.length)

  return (
    <div className="app-shell panel-grid">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-white/60 bg-slate-950 px-6 py-6 text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:border-white/10">
          <Link className="inline-block" to="/">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-200/80">
              Eventise
            </p>
            <h1 className="section-title mt-3 text-3xl font-semibold">Veranstaltungs-Leitstelle</h1>
          </Link>

          <p className="mt-4 text-sm text-slate-300">
            Genehmigungen, Logistik, Anbieter, Unterlagen und Fortschritt an einem Ort.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Workspace-Status
            </p>
            <p className="section-title mt-3 text-4xl font-semibold">{eventCount}</p>
            <p className="mt-2 text-sm text-slate-300">
              Aktive Veranstaltungen lokal gespeichert mit persistentem Fortschritts-Tracking.
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
            Lokaler MVP-Modus aktiv. Änderungen werden in localStorage gespeichert und bleiben nach Neuladen erhalten.
          </div>
        </aside>

        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
