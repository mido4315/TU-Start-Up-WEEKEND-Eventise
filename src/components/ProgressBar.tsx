import { cn } from '../utils/format'

interface ProgressBarProps {
  value: number
  className?: string
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div className={cn('h-2.5 rounded-full bg-brand-100/80', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 via-emerald-500 to-emerald-400 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
