import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '../utils/format'

interface CardProps extends PropsWithChildren {
  className?: string
  title?: string
  eyebrow?: string
  action?: ReactNode
}

export function Card({
  className,
  title,
  eyebrow,
  action,
  children,
}: CardProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-white/70 bg-white/80 p-5 shadow-panel backdrop-blur',
        className,
      )}
    >
      {(title || eyebrow || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/70">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="section-title text-xl font-semibold text-slate-900">
                {title}
              </h2>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
