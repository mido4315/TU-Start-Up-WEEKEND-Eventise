import type { AppLanguage } from '../i18n/types'
import { translate } from '../i18n/translate'
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
  return value ? translate(language, 'common.yes') : translate(language, 'common.no')
}

export function formatRequirementStatus(
  status: RequirementStatus,
  language: AppLanguage = 'de',
) {
  return translate(language, `statuses.requirements.${status}`)
}

export function formatDocumentStatus(
  status: DocumentStatus,
  language: AppLanguage = 'de',
) {
  return translate(language, `statuses.documents.${status}`)
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
    return translate(language, 'deadlines.today')
  }

  if (diffDays > 0) {
    return translate(language, 'deadlines.inDays', {
      count: diffDays,
      plural: language === 'de' ? (diffDays === 1 ? '' : 'en') : diffDays === 1 ? '' : 's',
    })
  }

  const overdue = Math.abs(diffDays)

  return translate(language, 'deadlines.overdue', {
    count: overdue,
    plural: language === 'de' ? (overdue === 1 ? '' : 'e') : overdue === 1 ? '' : 's',
  })
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
