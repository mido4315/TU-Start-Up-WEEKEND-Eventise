import type {
  DocumentStatus,
  RequirementCategory,
  RequirementStatus,
} from '../types/event'

export const requirementStatusOptions: RequirementStatus[] = [
  'not_started',
  'in_progress',
  'waiting',
  'completed',
]

export const documentStatusOptions: DocumentStatus[] = [
  'pending',
  'uploaded',
  'missing',
]

export const categoryLabels: Record<RequirementCategory, string> = {
  permits: 'Genehmigungen',
  operations: 'Betrieb & Logistik',
  staffing: 'Personal',
  budget: 'Budget',
  vendors: 'Stände & Anbieter',
  security: 'Sicherheit',
  marketing: 'Marketing',
  documents: 'Unterlagen',
}

export const badgeTones = {
  neutral: 'bg-white/70 text-slate-700 border-slate-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
} as const
