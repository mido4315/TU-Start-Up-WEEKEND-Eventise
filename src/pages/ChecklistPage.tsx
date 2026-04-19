import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { EventHeader } from '../components/EventHeader'
import { RequirementItem } from '../components/RequirementItem'
import { useTranslation } from '../i18n/useTranslation'
import { useEventWorkspace } from '../hooks/useEventWorkspace'
import { useEventStore } from '../store/useEventStore'

export function ChecklistPage() {
  const { id } = useParams()
  const { event, requirements, progress } = useEventWorkspace(id)
  const updateRequirementNotes = useEventStore((state) => state.updateRequirementNotes)
  const updateRequirementStatus = useEventStore(
    (state) => state.updateRequirementStatus,
  )
  const { t } = useTranslation()

  if (!event) {
    return (
      <EmptyState
        title={t('common.eventNotFound')}
        description={t('checklistPage.missingDescription')}
        action={
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/dashboard"
          >
            {t('common.backToDashboard')}
          </Link>
        }
      />
    )
  }

  const sortedRequirements = [...requirements].sort(
    (left, right) =>
      new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime(),
  )

  return (
    <div className="space-y-8">
      <EventHeader event={event} progress={progress} />

      <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-panel backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
              {t('common.checklist')}
            </p>
            <h2 className="section-title mt-2 text-2xl font-semibold text-slate-950">
              {t('checklistPage.title')}
            </h2>
          </div>
          <p className="text-sm text-slate-600">
            {t('checklistPage.description')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedRequirements.map((requirement) => (
          <RequirementItem
            key={requirement.id}
            onNotesChange={(notes) => updateRequirementNotes(requirement.id, notes)}
            onStatusChange={(status) => updateRequirementStatus(requirement.id, status)}
            requirement={requirement}
          />
        ))}
      </div>
    </div>
  )
}
