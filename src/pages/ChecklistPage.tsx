import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { EventHeader } from '../components/EventHeader'
import { RequirementItem } from '../components/RequirementItem'
import { useEventWorkspace } from '../hooks/useEventWorkspace'
import { useEventStore } from '../store/useEventStore'

export function ChecklistPage() {
  const { id } = useParams()
  const { event, requirements, progress } = useEventWorkspace(id)
  const updateRequirementNotes = useEventStore((state) => state.updateRequirementNotes)
  const updateRequirementStatus = useEventStore(
    (state) => state.updateRequirementStatus,
  )

  if (!event) {
    return (
      <EmptyState
        title="Veranstaltung nicht gefunden"
        description="Die angeforderte Checkliste existiert nicht im lokalen Speicher."
        action={
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/dashboard"
          >
            Zum Dashboard
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
              Checkliste
            </p>
            <h2 className="section-title mt-2 text-2xl font-semibold text-slate-950">
              Generierte Anforderungen
            </h2>
          </div>
          <p className="text-sm text-slate-600">
            Status und Notizen aktualisieren, während die Arbeit von Planung zur Umsetzung fortschreitet.
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
