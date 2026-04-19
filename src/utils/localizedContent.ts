import type { AppLanguage } from '../i18n/types'
import { translate, translateList } from '../i18n/translate'
import type { EventDocument, RequiredDocument, Requirement } from '../types/event'

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function getRequirementTranslationKey(title: string) {
  const value = normalize(title)

  if (value.includes('veranstaltungsort')) return 'confirmVenue'
  if (value.includes('budget')) return 'budgetReview'
  if (value.includes('personalplanung')) return 'staffingPlan'
  if (value.includes('marketingplan')) return 'marketingPlan'
  if (value.includes('versicherungsschutz')) return 'insuranceReview'
  if (value.includes('ablaufplan')) return 'runOfShow'
  if (value.includes('pflichtunterlagen')) return 'requiredDocs'
  if (value.includes('gema')) return 'gemaLicense'
  if (value.includes('schankerlaubnis')) return 'alcoholPermit'
  if (value.includes('ordnungsamt') || value.includes('stadt')) return 'cityApproval'
  if (value.includes('sondernutzung')) return 'specialUse'
  if (value.includes('strassensperr') || value.includes('straßensperr')) return 'streetClosure'
  if (value.includes('haltverbot')) return 'noParking'
  if (value.includes('pnv')) return 'transitCoordination'
  if (value.includes('umzug') || value.includes('aufzug')) return 'processionRegistration'
  if (value.includes('sicherheitskonzept')) return 'securityConcept'
  if (value.includes('rettungs')) return 'rescueFireConcept'
  if (value.includes('sanitat') || value.includes('sanitÃ')) return 'medicalConcept'
  if (value.includes('forder') || value.includes('förder')) return 'fundingApplication'
  if (value.includes('standanbieter')) return 'vendorCoordination'
  if (value.includes('fliegende')) return 'temporaryStructures'

  return null
}

export function getRequirementDisplay(
  requirement: Pick<Requirement, 'title' | 'notes'>,
  language: AppLanguage,
) {
  const key = getRequirementTranslationKey(requirement.title)

  if (language === 'de' || !key) {
    return {
      title: requirement.title,
      notes: requirement.notes,
    }
  }

  const translated = translateList(language, `requirements.${key}`)

  return {
    title: translated[0] ?? requirement.title,
    notes: translated[1] ?? requirement.notes,
  }
}

export function getRequiredDocumentDisplay(
  document: Pick<RequiredDocument, 'id' | 'title' | 'description'>,
  language: AppLanguage,
) {
  if (language === 'de') {
    return {
      title: document.title,
      description: document.description,
    }
  }

  const translated = translateList(language, `requiredDocuments.${document.id}`)

  return {
    title: translated[0] ?? document.title,
    description: translated[1] ?? document.description,
  }
}

function getEventDocumentKey(document: Pick<EventDocument, 'title'>) {
  const value = normalize(document.title)

  if (value.includes('lageplan')) return 'sitePlan'
  if (value.includes('versicherung')) return 'insurance'
  if (value.includes('musik')) return 'musicList'
  if (value.includes('genehmigung')) return 'permitForm'

  return null
}

export function getEventDocumentDisplay(
  document: Pick<EventDocument, 'title' | 'type'>,
  language: AppLanguage,
) {
  if (language === 'de') {
    return {
      title: document.title,
      type: document.type,
    }
  }

  const key = getEventDocumentKey(document)
  const translated = key ? translateList(language, `eventDocuments.${key}`) : []

  return {
    title: translated[0] ?? document.title,
    type: translated[1] ?? document.type,
  }
}

export function translateRequirementTitle(title: string, language: AppLanguage) {
  return getRequirementDisplay({ title, notes: '' }, language).title
}

export function getContactLabel(
  contact: 'eventRegistration' | 'specialUse',
  language: AppLanguage,
) {
  return translate(language, `contacts.${contact}`)
}
