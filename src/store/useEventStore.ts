import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedDocuments, seedEvents, seedRequirements } from '../data/seed'
import type {
  AddDocumentInput,
  DocumentStatus,
  Event,
  EventDocument,
  EventFormValues,
  Requirement,
  RequirementStatus,
} from '../types/event'
import { generateRequirements } from '../utils/rulesEngine'

interface EventState {
  events: Event[]
  requirements: Requirement[]
  documents: EventDocument[]
  createEvent: (values: EventFormValues) => Event
  updateRequirementStatus: (
    requirementId: string,
    status: RequirementStatus,
  ) => void
  updateRequirementNotes: (requirementId: string, notes: string) => void
  addDocument: (eventId: string, input: AddDocumentInput) => void
  updateDocumentStatus: (documentId: string, status: DocumentStatus) => void
  updateDocumentNotes: (documentId: string, notes: string) => void
  updateDocumentLinks: (documentId: string, linkedRequirementIds: string[]) => void
}

function touchEvent(events: Event[], eventId: string) {
  return events.map((event) =>
    event.id === eventId
      ? {
          ...event,
          updatedAt: new Date().toISOString(),
        }
      : event,
  )
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: seedEvents,
      requirements: seedRequirements,
      documents: seedDocuments,
      createEvent: (values) => {
        const now = new Date().toISOString()
        const event: Event = {
          id: crypto.randomUUID(),
          ...values,
          createdAt: now,
          updatedAt: now,
        }

        const generatedRequirements = generateRequirements(event)

        set((state) => ({
          events: [event, ...state.events],
          requirements: [...generatedRequirements, ...state.requirements],
        }))

        return event
      },
      updateRequirementStatus: (requirementId, status) => {
        const requirement = get().requirements.find((item) => item.id === requirementId)

        if (!requirement) {
          return
        }

        set((state) => ({
          requirements: state.requirements.map((item) =>
            item.id === requirementId ? { ...item, status } : item,
          ),
          events: touchEvent(state.events, requirement.eventId),
        }))
      },
      updateRequirementNotes: (requirementId, notes) => {
        const requirement = get().requirements.find((item) => item.id === requirementId)

        if (!requirement) {
          return
        }

        set((state) => ({
          requirements: state.requirements.map((item) =>
            item.id === requirementId ? { ...item, notes } : item,
          ),
          events: touchEvent(state.events, requirement.eventId),
        }))
      },
      addDocument: (eventId, input) => {
        const document: EventDocument = {
          id: crypto.randomUUID(),
          eventId,
          ...input,
        }

        set((state) => ({
          documents: [document, ...state.documents],
          events: touchEvent(state.events, eventId),
        }))
      },
      updateDocumentStatus: (documentId, status) => {
        const document = get().documents.find((item) => item.id === documentId)

        if (!document) {
          return
        }

        set((state) => ({
          documents: state.documents.map((item) =>
            item.id === documentId ? { ...item, status } : item,
          ),
          events: touchEvent(state.events, document.eventId),
        }))
      },
      updateDocumentNotes: (documentId, notes) => {
        const document = get().documents.find((item) => item.id === documentId)

        if (!document) {
          return
        }

        set((state) => ({
          documents: state.documents.map((item) =>
            item.id === documentId ? { ...item, notes } : item,
          ),
          events: touchEvent(state.events, document.eventId),
        }))
      },
      updateDocumentLinks: (documentId, linkedRequirementIds) => {
        const document = get().documents.find((item) => item.id === documentId)

        if (!document) {
          return
        }

        set((state) => ({
          documents: state.documents.map((item) =>
            item.id === documentId ? { ...item, linkedRequirementIds } : item,
          ),
          events: touchEvent(state.events, document.eventId),
        }))
      },
    }),
    {
      name: 'eventise-store',
      partialize: (state) => ({
        events: state.events,
        requirements: state.requirements,
        documents: state.documents,
      }),
    },
  ),
)
