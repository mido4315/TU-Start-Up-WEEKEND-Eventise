import type {
  Event,
  EventFormValues,
  Requirement,
  RequirementCategory,
} from '../types/event'
import { slugify } from './format'

interface RequirementTemplate {
  title: string
  category: RequirementCategory
  actionRequired: boolean
  dueDaysBeforeEvent: number
  notes?: string
}

const baseTemplates: RequirementTemplate[] = [
  {
    title: 'Confirm venue logistics',
    category: 'operations',
    actionRequired: true,
    dueDaysBeforeEvent: 70,
    notes: 'Lock venue contact, access window, and site constraints.',
  },
  {
    title: 'Build budget and hidden cost review',
    category: 'budget',
    actionRequired: true,
    dueDaysBeforeEvent: 60,
    notes: 'Include cleanup, overtime, fencing, power, and contingency costs.',
  },
  {
    title: 'Create staffing plan',
    category: 'staffing',
    actionRequired: true,
    dueDaysBeforeEvent: 35,
    notes: 'Cover setup crew, check-in, runners, and teardown.',
  },
  {
    title: 'Launch marketing plan',
    category: 'marketing',
    actionRequired: true,
    dueDaysBeforeEvent: 28,
    notes: 'Define channels, timeline, and audience goals.',
  },
  {
    title: 'Review insurance coverage',
    category: 'permits',
    actionRequired: true,
    dueDaysBeforeEvent: 30,
    notes: 'Confirm organizer liability coverage and required certificates.',
  },
  {
    title: 'Prepare event-day run of show',
    category: 'operations',
    actionRequired: false,
    dueDaysBeforeEvent: 14,
    notes: 'Document setup, opening, peak, and teardown checkpoints.',
  },
]

export function offsetDate(date: string, daysBeforeEvent: number) {
  const eventDate = new Date(date)
  eventDate.setDate(eventDate.getDate() - daysBeforeEvent)
  return eventDate.toISOString()
}

function buildRequirement(
  eventId: string,
  template: RequirementTemplate,
  eventDate: string,
): Requirement {
  return {
    id: `${eventId}-${slugify(template.title)}`,
    eventId,
    title: template.title,
    category: template.category,
    status: 'not_started',
    dueDate: offsetDate(eventDate, template.dueDaysBeforeEvent),
    notes: template.notes ?? '',
    actionRequired: template.actionRequired,
  }
}

export function generateRequirements(
  event: Pick<
    EventFormValues | Event,
    | 'date'
    | 'music'
    | 'alcohol'
    | 'publicSpace'
    | 'expectedAttendance'
    | 'fundingNeeded'
    | 'foodVendors'
  > & { id: string },
) {
  const templates = [...baseTemplates]

  if (event.music) {
    templates.push({
      title: 'Obtain GEMA music license',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 45,
      notes: 'Submit the expected repertoire and usage details.',
    })
  }

  if (event.alcohol) {
    templates.push({
      title: 'Secure alcohol permit',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 55,
      notes: 'Confirm serving rules, closing times, and vendor responsibilities.',
    })
  }

  if (event.publicSpace) {
    templates.push({
      title: 'Request city or Ordnungsamt approval',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 75,
      notes: 'Coordinate location access, public safety, and occupancy rules.',
    })
  }

  if (event.expectedAttendance > 500) {
    templates.push({
      title: 'Prepare security plan',
      category: 'security',
      actionRequired: true,
      dueDaysBeforeEvent: 50,
      notes: 'Outline staffing, ingress, emergency routes, and crowd control.',
    })
  }

  if (event.fundingNeeded) {
    templates.push({
      title: 'Submit funding application',
      category: 'budget',
      actionRequired: true,
      dueDaysBeforeEvent: 90,
      notes: 'Prepare sponsor ask, grant timeline, and fallback scenarios.',
    })
  }

  if (event.foodVendors) {
    templates.push({
      title: 'Coordinate food vendors',
      category: 'vendors',
      actionRequired: true,
      dueDaysBeforeEvent: 40,
      notes: 'Track vendor contracts, power needs, and compliance paperwork.',
    })
  }

  return templates.map((template) => buildRequirement(event.id, template, event.date))
}
