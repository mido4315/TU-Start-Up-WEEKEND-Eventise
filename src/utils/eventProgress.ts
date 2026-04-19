import type { AppLanguage } from '../i18n/types'
import { translate } from '../i18n/translate'
import type {
  CategoryProgress,
  EventBlocker,
  EventDocument,
  EventProgress,
  Requirement,
  RequirementCategory,
} from '../types/event'
import { getEventDocumentDisplay, getRequirementDisplay } from './localizedContent'

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
    .map((item) => {
      const display = getRequirementDisplay(item, language)

      return {
        id: item.id,
        title: display.title,
        detail:
          item.status === 'waiting'
            ? translate(language, 'blockers.waiting')
            : translate(language, 'blockers.actionRequired'),
      }
    })

  const documentBlockers = documents
    .filter((item) => item.status === 'missing')
    .map((item) => ({
      id: item.id,
      title: getEventDocumentDisplay(item, language).title,
      detail: translate(language, 'blockers.missingDocument'),
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
