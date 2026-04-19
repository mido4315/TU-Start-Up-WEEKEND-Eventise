import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { useTranslation } from '../i18n/useTranslation'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <EmptyState
      title={t('notFound.title')}
      description={t('notFound.description')}
      action={
        <Link
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          to="/dashboard"
        >
          {t('common.openDashboard')}
        </Link>
      }
    />
  )
}
