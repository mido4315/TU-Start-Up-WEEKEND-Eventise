import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import type { Requirement } from '../types/event'
import { formatDate } from '../utils/format'
import { getRequirementDisplay } from '../utils/localizedContent'
import { Card } from './Card'
import { StatusBadge } from './StatusBadge'

interface NextActionsPanelProps {
  eventId: string
  actions: Requirement[]
}

export function NextActionsPanel({ eventId, actions }: NextActionsPanelProps) {
  const { language, t } = useTranslation()

  return (
    <Card
      title={t('nextActions.title')}
      eyebrow={t('nextActions.eyebrow')}
      action={
        <Link
          className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
          to={`/events/${eventId}/checklist`}
        >
          {t('nextActions.openChecklist')}
        </Link>
      }
    >
      {actions.length === 0 ? (
        <p className="text-sm text-slate-500">
          {t('nextActions.empty')}
        </p>
      ) : (
        <div className="space-y-3">
          {actions.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">
                  {getRequirementDisplay(item, language).title}
                </h3>
                <StatusBadge
                  label={t('nextActions.actionRequired')}
                  tone="warning"
                />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {t('common.due')} {formatDate(item.dueDate, language)}
              </p>
            </article>
          ))}
        </div>
      )}
    </Card>
  )
}
