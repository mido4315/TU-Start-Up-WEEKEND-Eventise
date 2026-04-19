import type { Event, EventDocument, Requirement } from '../types/event'
import { generateRequirements } from '../utils/rulesEngine'

const riversideEvent: Event = {
  id: 'event-riverside-summer-market',
  organizerFirstName: 'Maria',
  organizerLastName: 'Hoffmann',
  organizerAddress: 'Königswall 3, 44137 Dortmund',
  organizerPhone: '0231 123456',
  organizerIdNumber: '',
  name: 'Sommermarkt am Phoenixsee',
  firstName: 'Mina',
  lastName: 'Schneider',
  date: '2026-06-14T10:00:00.000Z',
  location: 'Phoenixsee-Promenade, Dortmund',
  expectedAttendance: 420,
  publicSpace: true,
  venueType: 'public',
  streetClosure: false,
  noParking: true,
  transitImpact: false,
  affectedTransitLines: '',
  procession: false,
  processionRoute: '',
  music: true,
  alcohol: false,
  foodVendors: true,
  fundingNeeded: false,
  flyingStructures: false,
  highRisk: false,
  feeZone: 'zone_2',
  usageType: 'food_drink_stand',
  usageAreaSqm: 120,
  usageDays: 2,
  createdAt: '2026-03-01T10:00:00.000Z',
  updatedAt: '2026-04-10T15:30:00.000Z',
}

const studentEvent: Event = {
  id: 'event-student-night-street-festival',
  organizerFirstName: 'Jonas',
  organizerLastName: 'Weber',
  organizerAddress: 'Emil-Figge-Str. 50, 44227 Dortmund',
  organizerPhone: '0170 9876543',
  organizerIdNumber: '',
  name: 'Studenten-Straßenfest Nacht',
  firstName: 'Jonas',
  lastName: 'Weber',
  date: '2026-07-05T16:00:00.000Z',
  location: 'Campus Süd & Weststraße, Dortmund',
  expectedAttendance: 950,
  publicSpace: true,
  venueType: 'public',
  streetClosure: true,
  noParking: true,
  transitImpact: true,
  affectedTransitLines: 'U42, Bus 440',
  procession: false,
  processionRoute: '',
  music: true,
  alcohol: true,
  foodVendors: true,
  fundingNeeded: true,
  flyingStructures: true,
  highRisk: false,
  feeZone: 'zone_1',
  usageType: 'food_drink_stand',
  usageAreaSqm: 250,
  usageDays: 1,
  createdAt: '2026-03-08T09:15:00.000Z',
  updatedAt: '2026-04-14T11:20:00.000Z',
}

function applyRequirementOverrides(
  requirements: Requirement[],
  overrides: Record<string, Partial<Requirement>>,
) {
  return requirements.map((item) => ({
    ...item,
    ...(overrides[item.title] ?? {}),
  }))
}

export const seedEvents: Event[] = [riversideEvent, studentEvent]

export const seedRequirements: Requirement[] = [
  ...applyRequirementOverrides(generateRequirements(riversideEvent), {
    'Veranstaltungsort bestätigen': {
      status: 'completed',
      notes: 'Zugangsvereinbarung mit dem Promenaden-Büro unterzeichnet.',
    },
    'Budget & versteckte Kosten prüfen': {
      status: 'in_progress',
      notes: 'Reinigungsangebot vom städtischen Auftragnehmer ausstehend.',
    },
    'Personalplanung erstellen': {
      status: 'in_progress',
      notes: 'Schichten zugewiesen, Leitungspositionen noch offen.',
    },
    'Versicherungsschutz prüfen': {
      status: 'completed',
      notes: 'Makler hat Erweiterung der Haftpflicht bestätigt.',
    },
    'Marketingplan starten': {
      status: 'completed',
      notes: 'Newsletter und Plakatpaket sind live.',
    },
    'Ablaufplan Veranstaltungstag vorbereiten': {
      status: 'waiting',
      notes: 'Warte auf finale Ankunftszeiten der Anbieter.',
    },
    'Genehmigung Ordnungsamt / Stadt einholen': {
      status: 'in_progress',
      notes: 'Erstantrag eingereicht, Lageplan angefordert.',
    },
    'GEMA-Musiklizenz beantragen': {
      status: 'completed',
      notes: 'Antrag mit finaler Playlist-Schätzung eingereicht.',
    },
    'Standanbieter koordinieren': {
      status: 'in_progress',
      notes: 'Stromanschlussplan in Prüfung.',
    },
  }),
  ...applyRequirementOverrides(generateRequirements(studentEvent), {
    'Veranstaltungsort bestätigen': {
      status: 'waiting',
      notes: 'Campus-Sicherheit hat Sperrplan noch nicht genehmigt.',
    },
    'Budget & versteckte Kosten prüfen': {
      status: 'not_started',
      notes: 'Angebote für Entsorgung, Absperrung und Generatoren fehlen.',
    },
    'Personalplanung erstellen': {
      status: 'not_started',
      notes: 'Kein Bühnenmeister oder Freiwilligenkoordinator zugewiesen.',
    },
    'Marketingplan starten': {
      status: 'not_started',
      notes: 'Werbung blockiert bis Finanzierung geklärt.',
    },
    'Versicherungsschutz prüfen': {
      status: 'waiting',
      notes: 'Makler hat aktuelle Gefährdungsbeurteilung angefordert.',
    },
    'Ablaufplan Veranstaltungstag vorbereiten': {
      status: 'not_started',
      notes: 'Zeitplan hängt von Genehmigungen ab.',
    },
    'GEMA-Musiklizenz beantragen': {
      status: 'not_started',
    },
    'Schankerlaubnis beantragen': {
      status: 'not_started',
      notes: 'Veranstalter benötigt noch einen konzessionierten Ausschankpartner.',
    },
    'Genehmigung Ordnungsamt / Stadt einholen': {
      status: 'waiting',
      notes: 'Straßensperrungskonzept muss überarbeitet werden.',
    },
    'Sicherheitskonzept erstellen': {
      status: 'not_started',
      notes: 'Teilnehmerzahl erfordert verpflichtende Planung.',
    },
    'Förderantrag einreichen': {
      status: 'in_progress',
      notes: 'Präsentation entworfen, Budgetanlage fehlt noch.',
    },
    'Standanbieter koordinieren': {
      status: 'not_started',
      notes: 'Keine Shortlist oder Onboarding-Unterlagen vorhanden.',
    },
  }),
]

export const seedDocuments: EventDocument[] = [
  {
    id: 'doc-riverside-site-plan',
    eventId: riversideEvent.id,
    title: 'Lageplan',
    type: 'Betrieb',
    status: 'uploaded',
    notes: 'Zugänge und Standflächen eingezeichnet.',
    linkedRequirementIds: [
      `${riversideEvent.id}-veranstaltungsort-best-tigen`,
      `${riversideEvent.id}-genehmigung-ordnungsamt-stadt-einholen`,
    ],
  },
  {
    id: 'doc-riverside-insurance',
    eventId: riversideEvent.id,
    title: 'Versicherungsnachweis',
    type: 'Genehmigungen',
    status: 'uploaded',
    notes: 'Gültig über das Veranstaltungswochenende.',
    linkedRequirementIds: [`${riversideEvent.id}-versicherungsschutz-pr-fen`],
  },
  {
    id: 'doc-riverside-music-list',
    eventId: riversideEvent.id,
    title: 'Musikliste',
    type: 'Programm',
    status: 'pending',
    notes: 'Bandmanager bestätigt finale Setlist nächste Woche.',
    linkedRequirementIds: [`${riversideEvent.id}-gema-musiklizenz-beantragen`],
  },
  {
    id: 'doc-student-site-plan',
    eventId: studentEvent.id,
    title: 'Lageplan',
    type: 'Betrieb',
    status: 'missing',
    notes: 'Von der Stadt vor Genehmigungsprüfung gefordert.',
    linkedRequirementIds: [
      `${studentEvent.id}-veranstaltungsort-best-tigen`,
      `${studentEvent.id}-genehmigung-ordnungsamt-stadt-einholen`,
    ],
  },
  {
    id: 'doc-student-permit-form',
    eventId: studentEvent.id,
    title: 'Genehmigungsantrag',
    type: 'Genehmigungen',
    status: 'pending',
    notes: 'Veranstalterdaten ausgefüllt, Anlagen fehlen noch.',
    linkedRequirementIds: [`${studentEvent.id}-genehmigung-ordnungsamt-stadt-einholen`],
  },
  {
    id: 'doc-student-insurance',
    eventId: studentEvent.id,
    title: 'Versicherungsnachweis',
    type: 'Genehmigungen',
    status: 'missing',
    notes: 'Bestätigung vom Makler der Studierendenschaft ausstehend.',
    linkedRequirementIds: [`${studentEvent.id}-versicherungsschutz-pr-fen`],
  },
]
