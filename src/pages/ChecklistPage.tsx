import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { EventHeader } from '../components/EventHeader'
import { RequirementItem } from '../components/RequirementItem'
import { useLanguage } from '../i18n/useLanguage'
import { useEventWorkspace } from '../hooks/useEventWorkspace'
import { useEventStore } from '../store/useEventStore'

export function ChecklistPage() {
  const { id } = useParams()
  const { event, requirements, progress } = useEventWorkspace(id)
  const updateRequirementNotes = useEventStore((state) => state.updateRequirementNotes)
  const updateRequirementStatus = useEventStore(
    (state) => state.updateRequirementStatus,
  )
  const { language } = useLanguage()
  const isGerman = language === 'de'

  if (!event) {
    return (
      <EmptyState
        title={isGerman ? 'Veranstaltung nicht gefunden' : 'Event not found'}
        description={
          isGerman
            ? 'Die angeforderte Checkliste existiert nicht im lokalen Speicher.'
            : 'The requested checklist does not exist in local storage.'
        }
        action={
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/dashboard"
          >
            {isGerman ? 'Zum Dashboard' : 'Back to dashboard'}
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
              {isGerman ? 'Checkliste' : 'Checklist'}
            </p>
            <h2 className="section-title mt-2 text-2xl font-semibold text-slate-950">
              {isGerman ? 'Generierte Anforderungen' : 'Generated requirements'}
            </h2>
          </div>
          <p className="text-sm text-slate-600">
            {isGerman
              ? 'Status und Notizen aktualisieren, während die Arbeit von Planung zur Umsetzung fortschreitet.'
              : 'Update statuses and notes as work moves from planning to execution.'}
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
