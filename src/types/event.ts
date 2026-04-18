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
  | 'documents'

export type VenueType = 'public' | 'private'

export type FeeZone = 'zone_1' | 'zone_2' | 'zone_3'

export type UsageType =
  | 'tables_seating'
  | 'food_drink_stand'
  | 'info_promo_pavilion'
  | 'product_display'
  | 'other'

export interface Event {
  id: string
  name: string
  date: string
  location: string
  expectedAttendance: number
  publicSpace: boolean
  venueType: VenueType
  streetClosure: boolean
  noParking: boolean
  transitImpact: boolean
  affectedTransitLines: string
  procession: boolean
  processionRoute: string
  music: boolean
  alcohol: boolean
  foodVendors: boolean
  fundingNeeded: boolean
  flyingStructures: boolean
  highRisk: boolean
  feeZone: FeeZone
  usageType: UsageType
  usageAreaSqm: number
  usageDays: number
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
  venueType: VenueType
  streetClosure: boolean
  noParking: boolean
  transitImpact: boolean
  affectedTransitLines: string
  procession: boolean
  processionRoute: string
  music: boolean
  alcohol: boolean
  foodVendors: boolean
  fundingNeeded: boolean
  flyingStructures: boolean
  highRisk: boolean
  feeZone: FeeZone
  usageType: UsageType
  usageAreaSqm: number
  usageDays: number
}

export interface RequiredDocument {
  id: string
  title: string
  description: string
  condition: 'mandatory' | 'conditional' | 'high_risk'
}

export interface FeeRate {
  usageType: UsageType
  zone1: number
  zone2: number
  zone3: number
  unit: string
}

export interface AddDocumentInput {
  title: string
  type: string
  status: DocumentStatus
  notes: string
  linkedRequirementIds: string[]
}
