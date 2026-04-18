import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
            {eyebrow}
          </p>
        )}
        <h1 className="section-title text-3xl font-semibold text-slate-950 md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base text-slate-600 md:text-lg">{description}</p>
      </div>
      {actions}
    </div>
  )
}
