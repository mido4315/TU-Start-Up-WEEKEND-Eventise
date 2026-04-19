import { useTranslation } from '../i18n/useTranslation'
import type { Requirement } from '../types/event'
import { getCategoryLabel, requirementStatusOptions } from '../utils/constants'
import {
  formatDate,
  formatRelativeDate,
  formatRequirementStatus,
} from '../utils/format'
import { getRequirementDisplay } from '../utils/localizedContent'
import { Card } from './Card'
import { StatusBadge } from './StatusBadge'

interface RequirementItemProps {
  requirement: Requirement
  onStatusChange: (status: Requirement['status']) => void
  onNotesChange: (notes: string) => void
}

export function RequirementItem({
  requirement,
  onStatusChange,
  onNotesChange,
}: RequirementItemProps) {
  const { language, t } = useTranslation()
  const display = getRequirementDisplay(requirement, language)

  return (
    <Card className="border-slate-100 bg-white/85">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-950">
                {display.title}
              </h3>
              <StatusBadge
                label={getCategoryLabel(requirement.category, language)}
                tone="info"
              />
              {requirement.actionRequired && (
                <StatusBadge
                  label={t('requirementItem.userAction')}
                  tone="warning"
                />
              )}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {t('common.due')} {formatDate(requirement.dueDate, language)} ·{' '}
              {formatRelativeDate(requirement.dueDate, language)}
            </p>
          </div>

          <label className="text-sm font-medium text-slate-600">
            {t('common.status')}
            <select
              className="mt-2 block rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-brand-500"
              onChange={(event) =>
                onStatusChange(event.target.value as Requirement['status'])
              }
              value={requirement.status}
            >
              {requirementStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatRequirementStatus(status, language)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="text-sm font-medium text-slate-600">
          {t('common.notes')}
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white"
            defaultValue={display.notes}
            onBlur={(event) => onNotesChange(event.target.value)}
            placeholder={
              t('requirementItem.notesPlaceholder')
            }
          />
        </label>
      </div>
    </Card>
  )
}
