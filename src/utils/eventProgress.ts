import type { AppLanguage } from '../i18n/types'
import type {
  CategoryProgress,
  EventBlocker,
  EventDocument,
  EventProgress,
  Requirement,
  RequirementCategory,
} from '../types/event'

const categoryOrder: RequirementCategory[] = [
  'permits',
  'operations',
  'staffing',
  'budget',
  'vendors',
  'security',
  'marketing',
  'documents',
]

function sortByDueDate(items: Requirement[]) {
  return [...items].sort(
    (left, right) =>
      new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime(),
  )
}

function buildCategoryProgress(requirements: Requirement[]): CategoryProgress[] {
  return categoryOrder
    .map((category) => {
      const group = requirements.filter((item) => item.category === category)

      if (group.length === 0) {
        return null
      }

      const completed = group.filter((item) => item.status === 'completed').length

      return {
        category,
        completed,
        total: group.length,
        readiness: Math.round((completed / group.length) * 100),
      }
    })
    .filter((item): item is CategoryProgress => item !== null)
}

function buildBlockers(
  requirements: Requirement[],
  documents: EventDocument[],
  language: AppLanguage,
): EventBlocker[] {
  const requirementBlockers = requirements
    .filter((item) => item.actionRequired && item.status !== 'completed')
    .map((item) => ({
      id: item.id,
      title: item.title,
      detail:
        item.status === 'waiting'
          ? language === 'de'
            ? 'Wartet auf externe Rückmeldung, bevor es weitergehen kann.'
            : 'Waiting on an external update before it can move forward.'
          : language === 'de'
            ? 'Veranstalter-Handlung für diese Anforderung noch erforderlich.'
            : 'Organizer action is still required for this requirement.',
    }))

  const documentBlockers = documents
    .filter((item) => item.status === 'missing')
    .map((item) => ({
      id: item.id,
      title: item.title,
      detail:
        language === 'de'
          ? 'Ein erforderliches Dokument ist als fehlend markiert.'
          : 'A required document is marked as missing.',
    }))

  return [...requirementBlockers, ...documentBlockers]
}

export function buildEventProgress(
  requirements: Requirement[],
  documents: EventDocument[],
  language: AppLanguage = 'de',
): EventProgress {
  const completedRequirements = requirements.filter(
    (item) => item.status === 'completed',
  ).length
  const uploadedDocuments = documents.filter(
    (item) => item.status === 'uploaded',
  ).length
  const totalUnits = requirements.length + documents.length
  const completedUnits = completedRequirements + uploadedDocuments

  return {
    readiness: totalUnits === 0 ? 0 : Math.round((completedUnits / totalUnits) * 100),
    completedRequirements,
    totalRequirements: requirements.length,
    uploadedDocuments,
    totalDocuments: documents.length,
    blockers: buildBlockers(requirements, documents, language),
    upcomingDeadlines: sortByDueDate(
      requirements.filter((item) => item.status !== 'completed'),
    ).slice(0, 5),
    nextActions: sortByDueDate(
      requirements.filter(
        (item) => item.actionRequired && item.status !== 'completed',
      ),
    ).slice(0, 4),
    categoryProgress: buildCategoryProgress(requirements),
  }
}
