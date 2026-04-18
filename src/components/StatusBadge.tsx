import { badgeTones } from '../utils/constants'
import { cn } from '../utils/format'

type BadgeTone = keyof typeof badgeTones

interface StatusBadgeProps {
  label: string
  tone?: BadgeTone
}

export function StatusBadge({
  label,
  tone = 'neutral',
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize',
        badgeTones[tone],
      )}
    >
      {label}
    </span>
  )
}
