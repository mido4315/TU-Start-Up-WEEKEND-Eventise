import { NavLink } from 'react-router-dom'
import type { Event, EventProgress } from '../types/event'
import { formatDate } from '../utils/format'
import { PageHeader } from './PageHeader'
import { ProgressBar } from './ProgressBar'

interface EventHeaderProps {
  event: Event
  progress: EventProgress
}

const tabs = [
  { label: 'Workspace', to: '' },
  { label: 'Checklist', to: 'checklist' },
  { label: 'Documents', to: 'documents' },
]

export function EventHeader({ event, progress }: EventHeaderProps) {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Event workspace"
        title={event.name}
        description={`${formatDate(event.date)} in ${event.location}`}
      />

      <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-panel backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Attendance
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {event.expectedAttendance}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Blockers
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {progress.blockers.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Documents
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {progress.uploadedDocuments}/{progress.totalDocuments || 0} uploaded
              </p>
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-500">
              <span>Readiness</span>
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
