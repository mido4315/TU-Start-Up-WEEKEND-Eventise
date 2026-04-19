import type {
  CategoryProgress,
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

export function buildEventProgress(
  requirements: Requirement[],
  documents: EventDocument[],
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
