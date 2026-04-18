import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'
import type { Requirement } from '../types/event'
import { formatDate } from '../utils/format'
import { Card } from './Card'
import { StatusBadge } from './StatusBadge'

interface NextActionsPanelProps {
  eventId: string
  actions: Requirement[]
}

export function NextActionsPanel({ eventId, actions }: NextActionsPanelProps) {
  const { language } = useLanguage()
  const isGerman = language === 'de'

  return (
    <Card
      title={isGerman ? 'Nächste Schritte' : 'Next actions'}
      eyebrow={isGerman ? 'Umsetzung' : 'Execution'}
      action={
        <Link
          className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
          to={`/events/${eventId}/checklist`}
        >
          {isGerman ? 'Checkliste öffnen' : 'Open checklist'}
        </Link>
      }
    >
      {actions.length === 0 ? (
        <p className="text-sm text-slate-500">
          {isGerman
            ? 'Alle offenen Punkte sind derzeit erledigt.'
            : 'Everything requiring action is complete for now.'}
        </p>
      ) : (
        <div className="space-y-3">
          {actions.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <StatusBadge
                  label={isGerman ? 'Handlung erforderlich' : 'Action required'}
                  tone="warning"
                />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {isGerman ? 'Fällig' : 'Due'} {formatDate(item.dueDate, language)}
              </p>
            </article>
          ))}
        </div>
      )}
    </Card>
  )
}
