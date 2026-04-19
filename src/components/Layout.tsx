import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { cn } from '../utils/format'

function FlagIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 21V4m0 0h9l-1.5 3L18 10H6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export function Layout() {
  const { language, setLanguage, t } = useTranslation()

  const navItems = [
    { label: t('layout.overview'), to: '/' },
    { label: t('layout.newEvent'), to: '/events/new' },
  ]

  return (
    <div className="app-shell panel-grid">
      <div className="fixed right-4 top-4 z-50">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 p-1.5 shadow-lg backdrop-blur">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-800">
            <FlagIcon />
          </span>
          <button
            className={cn(
              'rounded-full px-3 py-2 text-xs font-semibold transition',
              language === 'de'
                ? 'bg-slate-950 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            )}
            onClick={() => setLanguage('de')}
            type="button"
          >
            DE
          </button>
          <button
            className={cn(
              'rounded-full px-3 py-2 text-xs font-semibold transition',
              language === 'en'
                ? 'bg-slate-950 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            )}
            onClick={() => setLanguage('en')}
            type="button"
          >
            EN
          </button>
        </div>
      </div>

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
