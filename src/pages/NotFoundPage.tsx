import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { useLanguage } from '../i18n/useLanguage'

export function NotFoundPage() {
  const { language } = useLanguage()
  const isGerman = language === 'de'

  return (
    <EmptyState
      title={isGerman ? 'Seite nicht gefunden' : 'Page not found'}
      description={
        isGerman
          ? 'Diese Route ist nicht Teil des Eventise MVP.'
          : 'This route is not part of the Eventise MVP.'
      }
      action={
        <Link
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          to="/dashboard"
        >
          {isGerman ? 'Dashboard öffnen' : 'Open dashboard'}
        </Link>
      }
    />
  )
}
