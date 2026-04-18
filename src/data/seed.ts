import type { Event, EventDocument, Requirement } from '../types/event'
import { generateRequirements } from '../utils/rulesEngine'

const riversideEvent: Event = {
  id: 'event-riverside-summer-market',
  name: 'Riverside Summer Market',
  date: '2026-06-14T10:00:00.000Z',
  location: 'Riverside Promenade, Berlin',
  expectedAttendance: 420,
  publicSpace: true,
  music: true,
  alcohol: false,
  foodVendors: true,
  fundingNeeded: false,
  createdAt: '2026-03-01T10:00:00.000Z',
  updatedAt: '2026-04-10T15:30:00.000Z',
}

const studentEvent: Event = {
  id: 'event-student-night-street-festival',
  name: 'Student Night Street Festival',
  date: '2026-07-05T16:00:00.000Z',
  location: 'Campus Square and West Street, Potsdam',
  expectedAttendance: 950,
  publicSpace: true,
  music: true,
  alcohol: true,
  foodVendors: true,
  fundingNeeded: true,
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
    'Confirm venue logistics': {
      status: 'completed',
      notes: 'Signed access agreement with the promenade office.',
    },
    'Build budget and hidden cost review': {
      status: 'in_progress',
      notes: 'Cleanup quote still pending from city contractor.',
    },
    'Create staffing plan': {
      status: 'in_progress',
      notes: 'Volunteer shifts assigned, lead roles still open.',
    },
    'Review insurance coverage': {
      status: 'completed',
      notes: 'Broker confirmed public liability extension.',
    },
    'Launch marketing plan': {
      status: 'completed',
      notes: 'Community newsletter and poster pack are live.',
    },
    'Prepare event-day run of show': {
      status: 'waiting',
      notes: 'Waiting on final vendor arrival windows.',
    },
    'Request city or Ordnungsamt approval': {
      status: 'in_progress',
      notes: 'Initial application submitted, site map requested.',
    },
    'Obtain GEMA music license': {
      status: 'completed',
      notes: 'Application filed with the final playlist estimate.',
    },
    'Coordinate food vendors': {
      status: 'in_progress',
      notes: 'Vendor power plan under review.',
    },
  }),
  ...applyRequirementOverrides(generateRequirements(studentEvent), {
    'Confirm venue logistics': {
      status: 'waiting',
      notes: 'Campus security has not approved the closure map yet.',
    },
    'Build budget and hidden cost review': {
      status: 'not_started',
      notes: 'Still missing waste, fencing, and generator quotes.',
    },
    'Create staffing plan': {
      status: 'not_started',
      notes: 'No stage manager or volunteer coordinator assigned.',
    },
    'Launch marketing plan': {
      status: 'not_started',
      notes: 'Promotion is blocked until funding is clearer.',
    },
    'Review insurance coverage': {
      status: 'waiting',
      notes: 'Broker requested the current site risk assessment.',
    },
    'Prepare event-day run of show': {
      status: 'not_started',
      notes: 'Timeline depends on permit approvals.',
    },
    'Obtain GEMA music license': {
      status: 'not_started',
    },
    'Secure alcohol permit': {
      status: 'not_started',
      notes: 'Organizer still needs a licensed serving partner.',
    },
    'Request city or Ordnungsamt approval': {
      status: 'waiting',
      notes: 'Street closure concept needs revision.',
    },
    'Prepare security plan': {
      status: 'not_started',
      notes: 'Expected attendance triggers mandatory planning.',
    },
    'Submit funding application': {
      status: 'in_progress',
      notes: 'Deck drafted, budget annex still missing.',
    },
    'Coordinate food vendors': {
      status: 'not_started',
      notes: 'No shortlist or vendor onboarding pack yet.',
    },
  }),
]

export const seedDocuments: EventDocument[] = [
  {
    id: 'doc-riverside-site-plan',
    eventId: riversideEvent.id,
    title: 'Site plan',
    type: 'Operations',
    status: 'uploaded',
    notes: 'Annotated access points and stall footprints uploaded.',
    linkedRequirementIds: [
      `${riversideEvent.id}-confirm-venue-logistics`,
      `${riversideEvent.id}-request-city-or-ordnungsamt-approval`,
    ],
  },
  {
    id: 'doc-riverside-insurance',
    eventId: riversideEvent.id,
    title: 'Insurance certificate',
    type: 'Compliance',
    status: 'uploaded',
    notes: 'Valid through the event weekend.',
    linkedRequirementIds: [`${riversideEvent.id}-review-insurance-coverage`],
  },
  {
    id: 'doc-riverside-music-list',
    eventId: riversideEvent.id,
    title: 'Music list',
    type: 'Program',
    status: 'pending',
    notes: 'Band manager will confirm the final set order next week.',
    linkedRequirementIds: [`${riversideEvent.id}-obtain-gema-music-license`],
  },
  {
    id: 'doc-student-site-plan',
    eventId: studentEvent.id,
    title: 'Site plan',
    type: 'Operations',
    status: 'missing',
    notes: 'Required by the city before permit review continues.',
    linkedRequirementIds: [
      `${studentEvent.id}-confirm-venue-logistics`,
      `${studentEvent.id}-request-city-or-ordnungsamt-approval`,
    ],
  },
  {
    id: 'doc-student-permit-form',
    eventId: studentEvent.id,
    title: 'Permit form',
    type: 'Permits',
    status: 'pending',
    notes: 'Basic organizer details are filled, attachments still missing.',
    linkedRequirementIds: [`${studentEvent.id}-request-city-or-ordnungsamt-approval`],
  },
  {
    id: 'doc-student-insurance',
    eventId: studentEvent.id,
    title: 'Insurance certificate',
    type: 'Compliance',
    status: 'missing',
    notes: 'Pending confirmation from the student union broker.',
    linkedRequirementIds: [`${studentEvent.id}-review-insurance-coverage`],
  },
]
