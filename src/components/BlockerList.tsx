import type { EventBlocker } from '../types/event'
import { Card } from './Card'
import { EmptyState } from './EmptyState'
import { StatusBadge } from './StatusBadge'

interface BlockerListProps {
  blockers: EventBlocker[]
  title?: string
}

export function BlockerList({
  blockers,
  title = 'Current blockers',
}: BlockerListProps) {
  return (
    <Card title={title} eyebrow="Risks">
      {blockers.length === 0 ? (
        <EmptyState
          title="No blockers right now"
          description="The event has no active blockers based on its current requirements and documents."
        />
      ) : (
        <div className="space-y-3">
          {blockers.map((blocker) => (
            <article
              key={blocker.id}
              className="rounded-2xl border border-rose-100 bg-rose-50/80 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">{blocker.title}</h3>
                <StatusBadge label="Blocker" tone="danger" />
              </div>
              <p className="mt-2 text-sm text-slate-600">{blocker.detail}</p>
            </article>
          ))}
        </div>
      )}
    </Card>
  )
}
