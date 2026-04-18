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
    title: 'Veranstaltungsort bestätigen',
    category: 'operations',
    actionRequired: true,
    dueDaysBeforeEvent: 70,
    notes: 'Ansprechpartner, Zugangszeiten und Auflagen klären.',
  },
  {
    title: 'Budget & versteckte Kosten prüfen',
    category: 'budget',
    actionRequired: true,
    dueDaysBeforeEvent: 60,
    notes: 'Reinigung, Überstunden, Absperrung, Strom und Rücklagen berücksichtigen.',
  },
  {
    title: 'Personalplanung erstellen',
    category: 'staffing',
    actionRequired: true,
    dueDaysBeforeEvent: 35,
    notes: 'Aufbau, Einlass, Springer und Abbau planen.',
  },
  {
    title: 'Marketingplan starten',
    category: 'marketing',
    actionRequired: true,
    dueDaysBeforeEvent: 28,
    notes: 'Kanäle, Zeitplan und Zielgruppe festlegen.',
  },
  {
    title: 'Versicherungsschutz prüfen',
    category: 'permits',
    actionRequired: true,
    dueDaysBeforeEvent: 30,
    notes: 'Veranstalterhaftpflicht und Nachweise bestätigen.',
  },
  {
    title: 'Ablaufplan Veranstaltungstag vorbereiten',
    category: 'operations',
    actionRequired: false,
    dueDaysBeforeEvent: 14,
    notes: 'Aufbau, Eröffnung, Hauptphase und Abbau dokumentieren.',
  },
  {
    title: 'Pflichtunterlagen zusammenstellen',
    category: 'documents',
    actionRequired: true,
    dueDaysBeforeEvent: 56,
    notes: 'Meldung, Veranstaltererklärung, Versicherung, Lageplan, Toilettennachweis.',
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

type GenerateInput = Pick<
  EventFormValues | Event,
  | 'date'
  | 'music'
  | 'alcohol'
  | 'publicSpace'
  | 'expectedAttendance'
  | 'fundingNeeded'
  | 'foodVendors'
  | 'streetClosure'
  | 'noParking'
  | 'transitImpact'
  | 'procession'
  | 'flyingStructures'
  | 'highRisk'
> & { id: string }

export function generateRequirements(event: GenerateInput) {
  const templates = [...baseTemplates]

  if (event.music) {
    templates.push({
      title: 'GEMA-Musiklizenz beantragen',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 45,
      notes: 'Repertoire und Nutzungsdetails einreichen.',
    })
  }

  if (event.alcohol) {
    templates.push({
      title: 'Schankerlaubnis beantragen',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 55,
      notes: 'Ausschankregeln, Sperrzeiten und Verantwortlichkeiten klären.',
    })
  }

  if (event.publicSpace) {
    templates.push({
      title: 'Genehmigung Ordnungsamt / Stadt einholen',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 75,
      notes: 'Standortzugang, Sicherheit und Auflagen koordinieren.',
    })
    templates.push({
      title: 'Sondernutzungsantrag stellen',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 56,
      notes: 'Passend zum Typ: Infostand / Warenauslage / Straßencafé / Parkplatz.',
    })
  }

  if (event.streetClosure) {
    templates.push({
      title: 'Straßensperrung beantragen',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 60,
      notes: 'Skizze mit Umleitungen beifügen. Zusätzliche Kosten möglich.',
    })
  }

  if (event.noParking) {
    templates.push({
      title: 'Haltverbotszonen einrichten',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 42,
      notes: 'Skizze beifügen. Kosten für Beschilderung möglich.',
    })
  }

  if (event.transitImpact) {
    templates.push({
      title: 'ÖPNV-Abstimmung durchführen',
      category: 'operations',
      actionRequired: true,
      dueDaysBeforeEvent: 56,
      notes: 'Betroffene Linien angeben und Abstimmung mit Verkehrsbetrieben.',
    })
  }

  if (event.procession) {
    templates.push({
      title: 'Umzug / Aufzug anmelden',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 56,
      notes: 'Skizze, tabellarischer Streckenverlauf und Teilnehmerzahl beifügen.',
    })
  }

  if (event.expectedAttendance > 500) {
    templates.push({
      title: 'Sicherheitskonzept erstellen',
      category: 'security',
      actionRequired: true,
      dueDaysBeforeEvent: 50,
      notes: 'Personal, Zugang, Fluchtwege und Crowd-Management planen.',
    })
  }

  if (event.highRisk || event.expectedAttendance > 1000) {
    templates.push({
      title: 'Rettungs- & Brandschutzkonzept erstellen',
      category: 'security',
      actionRequired: true,
      dueDaysBeforeEvent: 56,
      notes: 'Rettungswege, Feuerwehrzufahrten und Brandschutzmaßnahmen.',
    })
    templates.push({
      title: 'Sanitätskonzept erstellen',
      category: 'security',
      actionRequired: true,
      dueDaysBeforeEvent: 42,
      notes: 'Sanitätsdienstliche Versorgung sicherstellen.',
    })
  }

  if (event.fundingNeeded) {
    templates.push({
      title: 'Förderantrag einreichen',
      category: 'budget',
      actionRequired: true,
      dueDaysBeforeEvent: 90,
      notes: 'Sponsoring-Konzept, Budgetanlage und Rückfallplan vorbereiten.',
    })
  }

  if (event.foodVendors) {
    templates.push({
      title: 'Standanbieter koordinieren',
      category: 'vendors',
      actionRequired: true,
      dueDaysBeforeEvent: 40,
      notes: 'Verträge, Stromanschlüsse und Nachweise verfolgen.',
    })
  }

  if (event.flyingStructures) {
    templates.push({
      title: 'Fliegende Bauten prüfen lassen',
      category: 'permits',
      actionRequired: true,
      dueDaysBeforeEvent: 42,
      notes: 'Liste, Plan und Prüfbuch für genehmigungspflichtige Bauten.',
    })
  }

  return templates.map((template) => buildRequirement(event.id, template, event.date))
}
