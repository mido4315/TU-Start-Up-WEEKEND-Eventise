import { Link } from 'react-router-dom'
import { BlockerList } from '../components/BlockerList'
import { DeadlineList } from '../components/DeadlineList'
import { EmptyState } from '../components/EmptyState'
import { EventCard } from '../components/EventCard'
import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { useEventStore } from '../store/useEventStore'
import { buildEventProgress } from '../utils/eventProgress'

export function DashboardPage() {
  const events = useEventStore((state) => state.events)
  const requirements = useEventStore((state) => state.requirements)
  const documents = useEventStore((state) => state.documents)

  const eventsWithProgress = [...events]
    .map((event) => ({
      event,
      progress: buildEventProgress(
        requirements.filter((item) => item.eventId === event.id),
        documents.filter((item) => item.eventId === event.id),
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
          eventsWithProgress.reduce(
            (total, entry) => total + entry.progress.readiness,
            0,
          ) / eventsWithProgress.length,
        )

  const upcomingDeadlines = eventsWithProgress
    .flatMap(({ event, progress }) =>
      progress.upcomingDeadlines.map((item) => ({ ...item, eventName: event.name })),
    )
    .sort(
      (left, right) =>
        new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime(),
    )
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
        eyebrow="Dashboard"
        title="Alle Veranstaltungen auf einen Blick"
        description="Bereitschaft, Blocker, Fristen und nächste Schritte für Veranstalter, die Genehmigungen, Anbieter, Personal und Unterlagen koordinieren."
        actions={
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/events/new"
          >
            Neue Veranstaltung
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          detail="Veranstaltungen im lokalen MVP-Workspace."
          label="Alle Veranstaltungen"
          value={String(events.length)}
        />
        <MetricCard
          detail="Durchschnittlicher Fortschritt über Checkliste und Dokumente."
          label="Durchschn. Bereitschaft"
          value={`${averageReadiness}%`}
        />
        <MetricCard
          detail="Offene Blocker, die noch Nachverfolgung erfordern."
          label="Blocker"
          value={String(blockers.length)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
        <section className="space-y-4">
          {eventsWithProgress.length === 0 ? (
            <EmptyState
              title="Noch keine Veranstaltungen"
              description="Erste Veranstaltung anlegen, um Anforderungen, Fristen und Dokumenten-Tracking zu generieren."
              action={
                <Link
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  to="/events/new"
                >
                  Veranstaltung anlegen
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
