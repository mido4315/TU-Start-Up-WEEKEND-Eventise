import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'

export function NotFoundPage() {
  return (
    <EmptyState
      title="Seite nicht gefunden"
      description="Diese Route ist nicht Teil des Eventise MVP."
      action={
        <Link
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          to="/dashboard"
        >
          Dashboard öffnen
        </Link>
      }
    />
  )
}
