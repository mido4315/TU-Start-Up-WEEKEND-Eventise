import type { CategoryProgress } from '../types/event'
import { categoryLabels } from '../utils/constants'
import { Card } from './Card'
import { ProgressBar } from './ProgressBar'

interface CategoryProgressListProps {
  items: CategoryProgress[]
}

export function CategoryProgressList({
  items,
}: CategoryProgressListProps) {
  return (
    <Card title="Fortschritt nach Kategorie" eyebrow="Bereitschaft">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.category}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-medium text-slate-900">
                {categoryLabels[item.category]}
              </p>
              <p className="text-sm text-slate-500">
                {item.completed}/{item.total}
              </p>
            </div>
            <ProgressBar value={item.readiness} />
          </div>
        ))}
      </div>
    </Card>
  )
}
