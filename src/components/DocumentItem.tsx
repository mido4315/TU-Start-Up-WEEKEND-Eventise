import { useLanguage } from '../i18n/useLanguage'
import type { EventDocument, Requirement } from '../types/event'
import { documentStatusOptions } from '../utils/constants'
import { formatDocumentStatus } from '../utils/format'
import { Card } from './Card'
import { StatusBadge } from './StatusBadge'

interface DocumentItemProps {
  document: EventDocument
  requirements: Requirement[]
  onStatusChange: (status: EventDocument['status']) => void
  onNotesChange: (notes: string) => void
  onLinksChange: (linkedRequirementIds: string[]) => void
}

export function DocumentItem({
  document,
  requirements,
  onStatusChange,
  onNotesChange,
  onLinksChange,
}: DocumentItemProps) {
  const { language } = useLanguage()
  const isGerman = language === 'de'

  return (
    <Card className="border-slate-100 bg-white/85">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-950">{document.title}</h3>
              <StatusBadge
                label={formatDocumentStatus(document.status, language)}
                tone={
                  document.status === 'uploaded'
                    ? 'success'
                    : document.status === 'missing'
                      ? 'danger'
                      : 'warning'
                }
              />
            </div>
            <p className="mt-2 text-sm text-slate-600">{document.type}</p>
          </div>

          <label className="text-sm font-medium text-slate-600">
            {isGerman ? 'Status' : 'Status'}
            <select
              className="mt-2 block rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-brand-500"
              onChange={(event) =>
                onStatusChange(event.target.value as EventDocument['status'])
              }
              value={document.status}
            >
              {documentStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatDocumentStatus(status, language)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="text-sm font-medium text-slate-600">
          {isGerman ? 'Notizen' : 'Notes'}
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white"
            defaultValue={document.notes}
            onBlur={(event) => onNotesChange(event.target.value)}
            placeholder={
              isGerman
                ? 'Upload-Status, Zuständigkeit oder fehlende Details vermerken…'
                : 'Track upload status, owner, or missing details…'
            }
          />
        </label>

        <details className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">
            {isGerman ? 'Verknüpfte Anforderungen' : 'Linked requirements'} (
            {document.linkedRequirementIds.length})
          </summary>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {requirements.map((requirement) => {
              const checked = document.linkedRequirementIds.includes(requirement.id)

              return (
                <label
                  key={requirement.id}
                  className="flex items-start gap-3 rounded-2xl border border-white bg-white/80 p-3 text-sm text-slate-700"
                >
                  <input
                    checked={checked}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    onChange={(event) => {
                      const nextLinks = event.target.checked
                        ? [...document.linkedRequirementIds, requirement.id]
                        : document.linkedRequirementIds.filter(
                            (item) => item !== requirement.id,
                          )

                      onLinksChange(nextLinks)
                    }}
                    type="checkbox"
                  />
                  <span>{requirement.title}</span>
                </label>
              )
            })}
          </div>
        </details>
      </div>
    </Card>
  )
}
