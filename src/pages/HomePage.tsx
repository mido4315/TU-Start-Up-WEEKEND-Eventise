import { Link } from 'react-router-dom'
import { EventCard } from '../components/EventCard'
import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { useEventStore } from '../store/useEventStore'
import { buildEventProgress } from '../utils/eventProgress'

export function HomePage() {
  const events = useEventStore((state) => state.events)
  const requirements = useEventStore((state) => state.requirements)
  const documents = useEventStore((state) => state.documents)

  const averageReadiness =
    events.length === 0
      ? 0
      : Math.round(
          events.reduce((total, event) => {
            const progress = buildEventProgress(
              requirements.filter((item) => item.eventId === event.id),
              documents.filter((item) => item.eventId === event.id),
            )

            return total + progress.readiness
          }, 0) / events.length,
        )

  const totalBlockers = events.reduce((total, event) => {
    const progress = buildEventProgress(
      requirements.filter((item) => item.eventId === event.id),
      documents.filter((item) => item.eventId === event.id),
    )

    return total + progress.blockers.length
  }, 0)

  const featuredEvents = [...events]
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
    .slice(0, 2)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Eventise MVP"
        title="Leitstelle für lokale Veranstaltungsorganisation"
        description="Genehmigungen, Logistik, Anbieter, Personal, Unterlagen und Bereitschaft an einem Ort planen – ohne Backend."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              to="/events/new"
            >
              Veranstaltung anlegen
            </Link>
            <Link
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
              to="/dashboard"
            >
              Dashboard öffnen
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          detail="Gespeicherte Veranstaltungen, sofort im Workspace verfügbar."
          label="Erfasste Veranstaltungen"
          value={String(events.length)}
        />
        <MetricCard
          detail="Durchschnittlicher Fortschritt über Anforderungen und Dokumente."
          label="Durchschn. Bereitschaft"
          value={`${averageReadiness}%`}
        />
        <MetricCard
          detail="Offene Blocker über aktuelle Beispieldaten und neue Veranstaltungen."
          label="Aktive Blocker"
          value={String(totalBlockers)}
        />
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr,0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
            Was dieses MVP abdeckt
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              'Veranstaltungen mit geführtem Assistenten anlegen.',
              'Genehmigungs- und Logistik-Anforderungen automatisch generieren.',
              'Bereitschaft, Blocker, Fristen und Kategorie-Fortschritt verfolgen.',
              'Unterlagen verwalten und mit Checklisten-Einträgen verknüpfen.',
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-brand-100 bg-brand-50/80 p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
            Typische Herausforderungen
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              'Genehmigungen',
              'Veranstaltungsorte',
              'Anbieter',
              'Personal',
              'Zeitplanung',
              'Logistik',
              'Budget',
              'Ticketing',
              'Sicherheit',
              'Versicherung',
              'Marketing',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-brand-200 bg-white px-3 py-2 text-sm text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
              Beispiel-Veranstaltungen
            </p>
            <h2 className="section-title mt-2 text-2xl font-semibold text-slate-950">
              Direkt mit Beispieldaten arbeiten
            </h2>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {featuredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              progress={buildEventProgress(
                requirements.filter((item) => item.eventId === event.id),
                documents.filter((item) => item.eventId === event.id),
              )}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
