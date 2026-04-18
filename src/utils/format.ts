import type { AppLanguage } from '../i18n/types'
import type { DocumentStatus, RequirementStatus } from '../types/event'

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function formatDate(value: string, language: AppLanguage = 'de') {
  return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatBooleanValue(
  value: boolean,
  language: AppLanguage = 'de',
) {
  return value ? (language === 'de' ? 'Ja' : 'Yes') : language === 'de' ? 'Nein' : 'No'
}

export function formatRequirementStatus(
  status: RequirementStatus,
  language: AppLanguage = 'de',
) {
  const labels: Record<AppLanguage, Record<RequirementStatus, string>> = {
    de: {
      not_started: 'nicht gestartet',
      in_progress: 'in Bearbeitung',
      waiting: 'wartet',
      completed: 'erledigt',
    },
    en: {
      not_started: 'not started',
      in_progress: 'in progress',
      waiting: 'waiting',
      completed: 'completed',
    },
  }

  return labels[language][status]
}

export function formatDocumentStatus(
  status: DocumentStatus,
  language: AppLanguage = 'de',
) {
  const labels: Record<AppLanguage, Record<DocumentStatus, string>> = {
    de: {
      pending: 'ausstehend',
      uploaded: 'hochgeladen',
      missing: 'fehlend',
    },
    en: {
      pending: 'pending',
      uploaded: 'uploaded',
      missing: 'missing',
    },
  }

  return labels[language][status]
}

export function formatRelativeDate(
  value: string,
  language: AppLanguage = 'de',
) {
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
    return language === 'de' ? 'Heute fällig' : 'Due today'
  }

  if (diffDays > 0) {
    if (language === 'de') {
      return `Fällig in ${diffDays} Tag${diffDays === 1 ? '' : 'en'}`
    }

    return `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`
  }

  const overdue = Math.abs(diffDays)

  if (language === 'de') {
    return `${overdue} Tag${overdue === 1 ? '' : 'e'} überfällig`
  }

  return `${overdue} day${overdue === 1 ? '' : 's'} overdue`
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
