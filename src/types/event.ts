export type RequirementStatus =
  | 'not_started'
  | 'in_progress'
  | 'waiting'
  | 'completed'

export type DocumentStatus = 'pending' | 'uploaded' | 'missing'

export type RequirementCategory =
  | 'permits'
  | 'operations'
  | 'staffing'
  | 'budget'
  | 'vendors'
  | 'security'
  | 'marketing'

export interface Event {
  id: string
  name: string
  date: string
  location: string
  expectedAttendance: number
  publicSpace: boolean
  music: boolean
  alcohol: boolean
  foodVendors: boolean
  fundingNeeded: boolean
  createdAt: string
  updatedAt: string
}

export interface Requirement {
  id: string
  eventId: string
  title: string
  category: RequirementCategory
  status: RequirementStatus
  dueDate: string
  notes: string
  actionRequired: boolean
}

export interface EventDocument {
  id: string
  eventId: string
  title: string
  type: string
  status: DocumentStatus
  notes: string
  linkedRequirementIds: string[]
}

export interface CategoryProgress {
  category: RequirementCategory
  completed: number
  total: number
  readiness: number
}

export interface EventBlocker {
  id: string
  title: string
  detail: string
}

export interface EventProgress {
  readiness: number
  completedRequirements: number
  totalRequirements: number
  uploadedDocuments: number
  totalDocuments: number
  blockers: EventBlocker[]
  upcomingDeadlines: Requirement[]
  nextActions: Requirement[]
  categoryProgress: CategoryProgress[]
}

export interface EventFormValues {
  name: string
  date: string
  location: string
  expectedAttendance: number
  publicSpace: boolean
  music: boolean
  alcohol: boolean
  foodVendors: boolean
  fundingNeeded: boolean
}

export interface AddDocumentInput {
  title: string
  type: string
  status: DocumentStatus
  notes: string
  linkedRequirementIds: string[]
}
