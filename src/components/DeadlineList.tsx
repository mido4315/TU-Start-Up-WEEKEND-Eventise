import { useTranslation } from '../i18n/useTranslation'
import type { Requirement } from '../types/event'
import { formatDate, formatRelativeDate } from '../utils/format'
import { getRequirementDisplay } from '../utils/localizedContent'
import { Card } from './Card'

interface DeadlineListProps {
  title?: string
  items: Array<Requirement & { eventName?: string }>
}

export function DeadlineList({ title, items }: DeadlineListProps) {
  const { language, t } = useTranslation()

  return (
    <Card
      title={title ?? t('deadlines.title')}
      eyebrow={t('deadlines.eyebrow')}
    >
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          {t('deadlines.empty')}
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {getRequirementDisplay(item, language).title}
                </p>
                {item.eventName && (
                  <p className="mt-1 text-sm text-slate-500">{item.eventName}</p>
                )}
              </div>
              <div className="text-sm text-slate-600 md:text-right">
                <p>{formatDate(item.dueDate, language)}</p>
                <p>{formatRelativeDate(item.dueDate, language)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
