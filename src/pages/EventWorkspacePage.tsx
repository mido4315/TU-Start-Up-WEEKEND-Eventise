import { Link, useParams } from 'react-router-dom'
import { BlockerList } from '../components/BlockerList'
import { CategoryProgressList } from '../components/CategoryProgressList'
import { DeadlineList } from '../components/DeadlineList'
import { EmptyState } from '../components/EmptyState'
import { EventHeader } from '../components/EventHeader'
import { MetricCard } from '../components/MetricCard'
import { NextActionsPanel } from '../components/NextActionsPanel'
import { useEventWorkspace } from '../hooks/useEventWorkspace'
import { formatBooleanValue } from '../utils/format'

export function EventWorkspacePage() {
  const { id } = useParams()
  const { event, documents, progress } = useEventWorkspace(id)

  if (!event) {
    return (
      <EmptyState
        title="Veranstaltung nicht gefunden"
        description="Der angeforderte Workspace existiert nicht im lokalen Speicher."
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

  return (
    <div className="space-y-8">
      <EventHeader event={event} progress={progress} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail="Anforderungen und Dokumente bisher erledigt."
          label="Bereitschaft"
          value={`${progress.readiness}%`}
        />
        <MetricCard
          detail="Als erledigt markierte Anforderungen."
          label="Checklisten-Fortschritt"
          value={`${progress.completedRequirements}/${progress.totalRequirements}`}
        />
        <MetricCard
          detail="In den Workspace hochgeladene Dokumente."
          label="Dokumente"
          value={`${progress.uploadedDocuments}/${progress.totalDocuments || 0}`}
        />
        <MetricCard
          detail="Offene Blocker, die noch gelöst werden müssen."
          label="Blocker"
          value={String(progress.blockers.length)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
              Veranstaltungsübersicht
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                ['Öffentliche Fläche', formatBooleanValue(event.publicSpace)],
                ['Musik', formatBooleanValue(event.music)],
                ['Alkohol', formatBooleanValue(event.alcohol)],
                ['Stände', formatBooleanValue(event.foodVendors)],
                ['Förderung', formatBooleanValue(event.fundingNeeded)],
                ['Teilnehmer', String(event.expectedAttendance)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <CategoryProgressList items={progress.categoryProgress} />
          <DeadlineList items={progress.upcomingDeadlines} title="Anstehende Fristen für diese Veranstaltung" />
        </div>

        <div className="space-y-6">
          <NextActionsPanel actions={progress.nextActions} eventId={event.id} />
          <BlockerList blockers={progress.blockers} />

          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-panel backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
                  Aktuelle Dokumente
                </p>
                <h2 className="section-title mt-2 text-xl font-semibold text-slate-950">
                  Workspace-Dateien
                </h2>
              </div>
              <Link
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
                to={`/events/${event.id}/documents`}
              >
                Verwalten
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {documents.length === 0 ? (
                <p className="text-sm text-slate-500">Noch keine Dokumente hinzugefügt.</p>
              ) : (
                documents.slice(0, 3).map((document) => (
                  <div
                    key={document.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <p className="font-semibold text-slate-900">{document.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {document.type} · {document.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
