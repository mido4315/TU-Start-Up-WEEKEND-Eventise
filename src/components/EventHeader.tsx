import { NavLink } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'
import type { Event, EventProgress } from '../types/event'
import { formatDate } from '../utils/format'
import { PageHeader } from './PageHeader'
import { ProgressBar } from './ProgressBar'

interface EventHeaderProps {
  event: Event
  progress: EventProgress
}

export function EventHeader({ event, progress }: EventHeaderProps) {
  const { language } = useLanguage()
  const isGerman = language === 'de'

  const tabs = [
    { label: isGerman ? 'Workspace' : 'Workspace', to: '' },
    { label: isGerman ? 'Checkliste' : 'Checklist', to: 'checklist' },
    { label: isGerman ? 'Dokumente' : 'Documents', to: 'documents' },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={isGerman ? 'Veranstaltungs-Workspace' : 'Event workspace'}
        title={event.name}
        description={`${formatDate(event.date, language)} ${isGerman ? 'in' : 'in'} ${event.location}`}
      />

      <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-panel backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {isGerman ? 'Teilnehmer' : 'Attendance'}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {event.expectedAttendance}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {isGerman ? 'Blocker' : 'Blockers'}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {progress.blockers.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {isGerman ? 'Dokumente' : 'Documents'}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {progress.uploadedDocuments}/{progress.totalDocuments || 0}{' '}
                {isGerman ? 'hochgeladen' : 'uploaded'}
              </p>
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-500">
              <span>{isGerman ? 'Bereitschaft' : 'Readiness'}</span>
              <span>{progress.readiness}%</span>
            </div>
            <ProgressBar value={progress.readiness} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.label}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white'
                  : 'rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50'
              }
              end={tab.to === ''}
              to={tab.to ? `/events/${event.id}/${tab.to}` : `/events/${event.id}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
