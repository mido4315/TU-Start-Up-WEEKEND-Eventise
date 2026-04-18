import { useLanguage } from '../i18n/useLanguage'
import { useEventStore } from '../store/useEventStore'
import { buildEventProgress } from '../utils/eventProgress'

export function useEventWorkspace(eventId?: string) {
  const { language } = useLanguage()
  const events = useEventStore((state) => state.events)
  const requirements = useEventStore((state) => state.requirements)
  const documents = useEventStore((state) => state.documents)

  const event = events.find((item) => item.id === eventId)
  const eventRequirements = requirements.filter((item) => item.eventId === eventId)
  const eventDocuments = documents.filter((item) => item.eventId === eventId)
  const progress = buildEventProgress(eventRequirements, eventDocuments, language)

  return {
    event,
    requirements: eventRequirements,
    documents: eventDocuments,
    progress,
  }
}
