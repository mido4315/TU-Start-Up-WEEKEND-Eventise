import { Link } from 'react-router-dom'
import type { Event, EventProgress } from '../types/event'
import { formatDate } from '../utils/format'
import { Card } from './Card'
import { ProgressBar } from './ProgressBar'
import { StatusBadge } from './StatusBadge'

interface EventCardProps {
  event: Event
  progress: EventProgress
}

export function EventCard({ event, progress }: EventCardProps) {
  return (
    <Card className="h-full">
      <div className="flex h-full flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">{formatDate(event.date)}</p>
            <h3 className="section-title mt-2 text-2xl font-semibold text-slate-950">
              {event.name}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{event.location}</p>
          </div>
          <StatusBadge
            label={`${progress.readiness}% ready`}
            tone={progress.readiness >= 70 ? 'success' : progress.readiness >= 40 ? 'warning' : 'danger'}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-500">
            <span>Readiness</span>
            <span>{progress.completedRequirements}/{progress.totalRequirements} requirements complete</span>
          </div>
          <ProgressBar value={progress.readiness} />
        </div>

        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50/80 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Blockers</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {progress.blockers.length}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50/80 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Attendance</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {event.expectedAttendance}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            to={`/events/${event.id}`}
          >
            Open workspace
          </Link>
          <Link
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
            to={`/events/${event.id}/documents`}
          >
            Documents
          </Link>
        </div>
      </div>
    </Card>
  )
}
