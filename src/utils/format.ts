import type { DocumentStatus, RequirementStatus } from '../types/event'

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

export function formatBooleanValue(value: boolean) {
  return value ? 'Ja' : 'Nein'
}

export function formatRequirementStatus(status: RequirementStatus) {
  return status.replace(/_/g, ' ')
}

export function formatDocumentStatus(status: DocumentStatus) {
  return status
}

export function formatRelativeDate(value: string) {
  const today = new Date()
  const target = new Date(value)
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
  const targetUtc = Date.UTC(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  )
  const diffDays = Math.round((targetUtc - todayUtc) / 86400000)

  if (diffDays === 0) {
    return 'Heute fällig'
  }

  if (diffDays > 0) {
    return `Fällig in ${diffDays} Tag${diffDays === 1 ? '' : 'en'}`
  }

  const overdue = Math.abs(diffDays)
  return `${overdue} Tag${overdue === 1 ? '' : 'e'} überfällig`
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
