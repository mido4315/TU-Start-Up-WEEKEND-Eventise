import { Link } from 'react-router-dom'
import { BlockerList } from '../components/BlockerList'
import { DeadlineList } from '../components/DeadlineList'
import { EmptyState } from '../components/EmptyState'
import { EventCard } from '../components/EventCard'
import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { useLanguage } from '../i18n/useLanguage'
import { useEventStore } from '../store/useEventStore'
import { buildEventProgress } from '../utils/eventProgress'

export function HomePage() {
  const events = useEventStore((state) => state.events)
  const requirements = useEventStore((state) => state.requirements)
  const documents = useEventStore((state) => state.documents)
  const { language } = useLanguage()
  const isGerman = language === 'de'

  const eventsWithProgress = [...events]
    .map((event) => ({
      event,
      progress: buildEventProgress(
        requirements.filter((item) => item.eventId === event.id),
        documents.filter((item) => item.eventId === event.id),
        language,
      ),
    }))
    .sort(
      (left, right) =>
        new Date(left.event.date).getTime() - new Date(right.event.date).getTime(),
    )

  const averageReadiness =
    eventsWithProgress.length === 0
      ? 0
      : Math.round(
          eventsWithProgress.reduce((total, { progress }) => total + progress.readiness, 0) /
            eventsWithProgress.length,
        )

  const upcomingDeadlines = eventsWithProgress
    .flatMap(({ event, progress }) =>
      progress.upcomingDeadlines.map((item) => ({ ...item, eventName: event.name })),
    )
    .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime())
    .slice(0, 6)

  const blockers = eventsWithProgress.flatMap(({ event, progress }) =>
    progress.blockers.map((blocker) => ({
      ...blocker,
      detail: `${event.name}: ${blocker.detail}`,
    })),
  )

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Eventise"
        title={
          isGerman ? 'Alle Veranstaltungen auf einen Blick' : 'All events in one place'
        }
        description={
          isGerman
            ? 'Bereitschaft, Blocker, Fristen und nächste Schritte – Genehmigungen, Anbieter, Personal und Unterlagen an einem Ort.'
            : 'Readiness, blockers, deadlines, and next steps – permits, vendors, staffing, and documents in one place.'
        }
        actions={
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/events/new"
          >
            {isGerman ? 'Neue Veranstaltung' : 'New event'}
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          detail={
            isGerman
              ? 'Gespeicherte Veranstaltungen im Workspace.'
              : 'Saved events in the workspace.'
          }
          label={isGerman ? 'Veranstaltungen' : 'Events'}
          value={String(events.length)}
        />
        <MetricCard
          detail={
            isGerman
              ? 'Durchschnittlicher Fortschritt über Checkliste und Dokumente.'
              : 'Average progress across checklist and documents.'
          }
          label={isGerman ? 'Durchschn. Bereitschaft' : 'Avg. readiness'}
          value={`${averageReadiness}%`}
        />
        <MetricCard
          detail={
            isGerman
              ? 'Offene Blocker, die noch Nachverfolgung erfordern.'
              : 'Open blockers that still need follow-up.'
          }
          label={isGerman ? 'Aktive Blocker' : 'Active blockers'}
          value={String(blockers.length)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
        <section className="space-y-4">
          {eventsWithProgress.length === 0 ? (
            <EmptyState
              title={isGerman ? 'Noch keine Veranstaltungen' : 'No events yet'}
              description={
                isGerman
                  ? 'Erste Veranstaltung anlegen, um Anforderungen, Fristen und Dokumenten-Tracking zu generieren.'
                  : 'Create your first event to generate requirements, deadlines, and document tracking.'
              }
              action={
                <Link
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  to="/events/new"
                >
                  {isGerman ? 'Veranstaltung anlegen' : 'Create event'}
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {eventsWithProgress.map(({ event, progress }) => (
                <EventCard key={event.id} event={event} progress={progress} />
              ))}
            </div>
          )}
        </section>

        <div className="space-y-6">
          <DeadlineList items={upcomingDeadlines} />
          <BlockerList blockers={blockers} />
        </div>
      </div>
    </div>
  )
}
