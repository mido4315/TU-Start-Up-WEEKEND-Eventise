import type { ReactNode } from 'react'
import { Card } from './Card'

interface MetricCardProps {
  label: string
  value: string
  detail: string
  icon?: ReactNode
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: MetricCardProps) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 section-title text-4xl font-semibold text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-sm text-slate-600">{detail}</p>
        </div>
        {icon && <div className="text-2xl text-brand-700">{icon}</div>}
      </div>
    </Card>
  )
}
