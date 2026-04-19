import { Link } from 'react-router-dom'
import { DeadlineList } from '../components/DeadlineList'
import { EmptyState } from '../components/EmptyState'
import { EventCard } from '../components/EventCard'
import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { useTranslation } from '../i18n/useTranslation'
import { useEventStore } from '../store/useEventStore'
import { buildEventProgress } from '../utils/eventProgress'

export function HomePage() {
  const events = useEventStore((state) => state.events)
  const requirements = useEventStore((state) => state.requirements)
  const documents = useEventStore((state) => state.documents)
  const { t } = useTranslation()

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
          eventsWithProgress.reduce((total, { progress }) => total + progress.readiness, 0) /
            eventsWithProgress.length,
        )

  const upcomingDeadlines = eventsWithProgress
    .flatMap(({ event, progress }) =>
      progress.upcomingDeadlines.map((item) => ({ ...item, eventName: event.name })),
    )
    .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime())
    .slice(0, 6)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Eventise"
        title={t('home.title')}
        description={t('home.description')}
        actions={
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/events/new"
          >
            {t('common.newEvent')}
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard
          detail={t('home.eventsDetail')}
          label={t('home.eventsLabel')}
          value={String(events.length)}
        />
        <MetricCard
          detail={t('home.readinessDetail')}
          label={t('home.readinessLabel')}
          value={`${averageReadiness}%`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
        <section className="space-y-4">
          {eventsWithProgress.length === 0 ? (
            <EmptyState
              title={t('home.emptyTitle')}
              description={t('home.emptyDescription')}
              action={
                <Link
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  to="/events/new"
                >
                  {t('common.createEvent')}
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
        </div>
      </div>
    </div>
  )
}
