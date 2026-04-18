import { Link, useParams } from 'react-router-dom'
import { BlockerList } from '../components/BlockerList'
import { CategoryProgressList } from '../components/CategoryProgressList'
import { DeadlineList } from '../components/DeadlineList'
import { EmptyState } from '../components/EmptyState'
import { EventHeader } from '../components/EventHeader'
import { MetricCard } from '../components/MetricCard'
import { NextActionsPanel } from '../components/NextActionsPanel'
import { useLanguage } from '../i18n/useLanguage'
import { useEventWorkspace } from '../hooks/useEventWorkspace'
import { formatBooleanValue } from '../utils/format'

export function EventWorkspacePage() {
  const { id } = useParams()
  const { event, documents, progress } = useEventWorkspace(id)
  const { language } = useLanguage()
  const isGerman = language === 'de'

  if (!event) {
    return (
      <EmptyState
        title={isGerman ? 'Veranstaltung nicht gefunden' : 'Event not found'}
        description={
          isGerman
            ? 'Der angeforderte Workspace existiert nicht im lokalen Speicher.'
            : 'The requested workspace does not exist in local storage.'
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

  return (
    <div className="space-y-8">
      <EventHeader event={event} progress={progress} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={
            isGerman
              ? 'Anforderungen und Dokumente bisher erledigt.'
              : 'Requirements and documents completed so far.'
          }
          label={isGerman ? 'Bereitschaft' : 'Readiness'}
          value={`${progress.readiness}%`}
        />
        <MetricCard
          detail={
            isGerman
              ? 'Als erledigt markierte Anforderungen.'
              : 'Requirements marked as completed.'
          }
          label={isGerman ? 'Checklisten-Fortschritt' : 'Checklist progress'}
          value={`${progress.completedRequirements}/${progress.totalRequirements}`}
        />
        <MetricCard
          detail={
            isGerman
              ? 'In den Workspace hochgeladene Dokumente.'
              : 'Documents uploaded to the workspace.'
          }
          label={isGerman ? 'Dokumente' : 'Documents'}
          value={`${progress.uploadedDocuments}/${progress.totalDocuments || 0}`}
        />
        <MetricCard
          detail={
            isGerman
              ? 'Offene Blocker, die noch gelöst werden müssen.'
              : 'Open blockers that still need to be resolved.'
          }
          label={isGerman ? 'Blocker' : 'Blockers'}
          value={String(progress.blockers.length)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
              {isGerman ? 'Veranstaltungsübersicht' : 'Event summary'}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                [isGerman ? 'Öffentliche Fläche' : 'Public space', formatBooleanValue(event.publicSpace, language)],
                [isGerman ? 'Musik' : 'Music', formatBooleanValue(event.music, language)],
                [isGerman ? 'Alkohol' : 'Alcohol', formatBooleanValue(event.alcohol, language)],
                [isGerman ? 'Stände' : 'Vendors', formatBooleanValue(event.foodVendors, language)],
                [isGerman ? 'Förderung' : 'Funding', formatBooleanValue(event.fundingNeeded, language)],
                [isGerman ? 'Teilnehmer' : 'Attendance', String(event.expectedAttendance)],
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
          <DeadlineList
            items={progress.upcomingDeadlines}
            title={
              isGerman
                ? 'Anstehende Fristen für diese Veranstaltung'
                : 'Upcoming deadlines for this event'
            }
          />
        </div>

        <div className="space-y-6">
          <NextActionsPanel actions={progress.nextActions} eventId={event.id} />
          <BlockerList blockers={progress.blockers} />

          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-panel backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
                  {isGerman ? 'Aktuelle Dokumente' : 'Current documents'}
                </p>
                <h2 className="section-title mt-2 text-xl font-semibold text-slate-950">
                  {isGerman ? 'Workspace-Dateien' : 'Workspace files'}
                </h2>
              </div>
              <Link
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
                to={`/events/${event.id}/documents`}
              >
                {isGerman ? 'Verwalten' : 'Manage'}
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {documents.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {isGerman ? 'Noch keine Dokumente hinzugefügt.' : 'No documents added yet.'}
                </p>
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
