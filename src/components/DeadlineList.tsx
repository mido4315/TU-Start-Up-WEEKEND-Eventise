import type { Requirement } from '../types/event'
import { formatDate, formatRelativeDate } from '../utils/format'
import { Card } from './Card'

interface DeadlineListProps {
  title?: string
  items: Array<Requirement & { eventName?: string }>
}

export function DeadlineList({
  title = 'Upcoming deadlines',
  items,
}: DeadlineListProps) {
  return (
    <Card title={title} eyebrow="Timeline">
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No upcoming deadlines to show yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.title}</p>
                {item.eventName && (
                  <p className="mt-1 text-sm text-slate-500">{item.eventName}</p>
                )}
              </div>
              <div className="text-sm text-slate-600 md:text-right">
                <p>{formatDate(item.dueDate)}</p>
                <p>{formatRelativeDate(item.dueDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
