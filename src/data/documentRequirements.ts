import type { EventFormValues, RequiredDocument } from '../types/event'

const mandatoryDocuments: RequiredDocument[] = [
  {
    id: 'doc-req-event-form',
    title: 'Meldung einer Veranstaltung',
    description: 'Vollständig ausgefülltes Formular zur Veranstaltungsanmeldung.',
    condition: 'mandatory',
  },
  {
    id: 'doc-req-liability-declaration',
    title: 'Veranstaltererklärung (Haftungsübernahme)',
    description: 'Haftungsübernahme für die Sondernutzung öffentlicher Flächen.',
    condition: 'mandatory',
  },
  {
    id: 'doc-req-liability-insurance',
    title: 'Veranstalterhaftpflichtversicherung',
    description: 'Nachweis einer gültigen Veranstalterhaftpflichtversicherung.',
    condition: 'mandatory',
  },
  {
    id: 'doc-req-site-plan',
    title: 'Lageplan / Aufbauplan',
    description: 'Maßstab 1:500, Format A3, alle Aufbauten maßstabsgerecht eingezeichnet.',
    condition: 'mandatory',
  },
  {
    id: 'doc-req-toilets',
    title: 'Toilettennachweis',
    description: 'Anzahl Damen- / Herren- / behindertengerechte Toiletten.',
    condition: 'mandatory',
  },
]

interface ConditionalDocument {
  document: RequiredDocument
  matches: (form: EventFormValues) => boolean
}

const conditionalDocuments: ConditionalDocument[] = [
  {
    document: {
      id: 'doc-req-special-use-permit',
      title: 'Sondernutzungsantrag',
      description:
        'Passend zum Typ: Infostand / Warenauslage / Straßencafé / Parkplatz.',
      condition: 'conditional',
    },
    matches: (form) => form.publicSpace,
  },
  {
    document: {
      id: 'doc-req-alcohol-license',
      title: 'Schankerlaubnis-Antrag',
      description: 'Erforderlich bei Alkoholausschank.',
      condition: 'conditional',
    },
    matches: (form) => form.alcohol,
  },
  {
    document: {
      id: 'doc-req-participant-list',
      title: 'Teilnehmerliste',
      description: 'Art & Größe der Stände, Fahrgeschäfte.',
      condition: 'conditional',
    },
    matches: (form) => form.foodVendors,
  },
  {
    document: {
      id: 'doc-req-steward-plan',
      title: 'Ordnereinsatzplan',
      description: 'Einsatzplan für Ordner und Sicherheitspersonal.',
      condition: 'conditional',
    },
    matches: (form) => form.expectedAttendance > 200,
  },
  {
    document: {
      id: 'doc-req-flying-structures',
      title: 'Liste & Plan Fliegende Bauten + Prüfbuch',
      description: 'Bei genehmigungspflichtigen Bauten (Zelte, Bühnen, Tribünen).',
      condition: 'conditional',
    },
    matches: (form) => form.flyingStructures,
  },
  {
    document: {
      id: 'doc-req-street-closure-sketch',
      title: 'Skizze Straßensperrung',
      description: 'Lageplan der geplanten Straßensperrungen mit Umleitungen.',
      condition: 'conditional',
    },
    matches: (form) => form.streetClosure,
  },
  {
    document: {
      id: 'doc-req-no-parking-sketch',
      title: 'Skizze Haltverbotszonen',
      description: 'Lageplan der erforderlichen Haltverbotszonen.',
      condition: 'conditional',
    },
    matches: (form) => form.noParking,
  },
  {
    document: {
      id: 'doc-req-procession-route',
      title: 'Streckenverlauf Umzug',
      description:
        'Skizze, tabellarischer Streckenverlauf und erwartete Teilnehmerzahl.',
      condition: 'conditional',
    },
    matches: (form) => form.procession,
  },
]

const highRiskDocuments: ConditionalDocument[] = [
  {
    document: {
      id: 'doc-req-security-concept',
      title: 'Sicherheitskonzept',
      description: 'Umfassendes Sicherheitskonzept für die Veranstaltung.',
      condition: 'high_risk',
    },
    matches: (form) => form.highRisk || form.expectedAttendance > 1000,
  },
  {
    document: {
      id: 'doc-req-rescue-fire',
      title: 'Rettungs- & Brandschutzkonzept',
      description: 'Konzept für Rettungswege und Brandschutzmaßnahmen.',
      condition: 'high_risk',
    },
    matches: (form) => form.highRisk || form.expectedAttendance > 1000,
  },
  {
    document: {
      id: 'doc-req-medical-concept',
      title: 'Sanitätskonzept',
      description: 'Planung der sanitätsdienstlichen Versorgung.',
      condition: 'high_risk',
    },
    matches: (form) => form.highRisk || form.expectedAttendance > 1000,
  },
  {
    document: {
      id: 'doc-req-steward-plan-extended',
      title: 'Ordnereinsatzplan (Großveranstaltung)',
      description: 'Erweiterter Einsatzplan für Großveranstaltungen.',
      condition: 'high_risk',
    },
    matches: (form) => form.highRisk || form.expectedAttendance > 1000,
  },
  {
    document: {
      id: 'doc-req-sound-concept',
      title: 'Beschallungskonzept',
      description: 'Konzept zur Beschallung bei Einsatz einer Tonanlage.',
      condition: 'high_risk',
    },
    matches: (form) => form.music && (form.highRisk || form.expectedAttendance > 500),
  },
  {
    document: {
      id: 'doc-req-stvo-declaration',
      title: 'Veranstaltererklärung gem. § 29 Abs. 2 StVO',
      description: 'Erklärung bei Nutzung öffentlicher Verkehrsflächen.',
      condition: 'high_risk',
    },
    matches: (form) =>
      form.streetClosure || form.procession,
  },
  {
    document: {
      id: 'doc-req-insurance-2600k',
      title: 'Versicherungsnachweis (Mindestdeckung 2.600.000 €)',
      description:
        'Nachweis einer Haftpflichtversicherung mit Mindestdeckungssumme.',
      condition: 'high_risk',
    },
    matches: (form) => form.highRisk || form.expectedAttendance > 1000,
  },
]

export function getRequiredDocuments(form: EventFormValues): RequiredDocument[] {
  const result: RequiredDocument[] = [...mandatoryDocuments]

  for (const entry of conditionalDocuments) {
    if (entry.matches(form)) {
      result.push(entry.document)
    }
  }

  for (const entry of highRiskDocuments) {
    if (entry.matches(form)) {
      result.push(entry.document)
    }
  }

  return result
}
