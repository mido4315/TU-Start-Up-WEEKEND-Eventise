import { useTranslation } from '../i18n/useTranslation'
import type { CategoryProgress } from '../types/event'
import { getCategoryLabel } from '../utils/constants'
import { Card } from './Card'
import { ProgressBar } from './ProgressBar'

interface CategoryProgressListProps {
  items: CategoryProgress[]
}

export function CategoryProgressList({ items }: CategoryProgressListProps) {
  const { language, t } = useTranslation()

  return (
    <Card
      title={t('categoryProgress.title')}
      eyebrow={t('common.readiness')}
    >
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.category}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-medium text-slate-900">
                {getCategoryLabel(item.category, language)}
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
