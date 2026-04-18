import { Link, useParams } from 'react-router-dom'
import { AddDocumentForm } from '../components/AddDocumentForm'
import { DocumentItem } from '../components/DocumentItem'
import { EmptyState } from '../components/EmptyState'
import { EventHeader } from '../components/EventHeader'
import { useLanguage } from '../i18n/useLanguage'
import { useEventWorkspace } from '../hooks/useEventWorkspace'
import { useEventStore } from '../store/useEventStore'

export function DocumentsPage() {
  const { id } = useParams()
  const { event, requirements, documents, progress } = useEventWorkspace(id)
  const addDocument = useEventStore((state) => state.addDocument)
  const updateDocumentLinks = useEventStore((state) => state.updateDocumentLinks)
  const updateDocumentNotes = useEventStore((state) => state.updateDocumentNotes)
  const updateDocumentStatus = useEventStore((state) => state.updateDocumentStatus)
  const { language } = useLanguage()
  const isGerman = language === 'de'

  if (!event) {
    return (
      <EmptyState
        title={isGerman ? 'Veranstaltung nicht gefunden' : 'Event not found'}
        description={
          isGerman
            ? 'Der angeforderte Dokumenten-Workspace existiert nicht im lokalen Speicher.'
            : 'The requested documents workspace does not exist in local storage.'
        }
        action={
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/dashboard"
          >
            {isGerman ? 'Zum Dashboard' : 'Back to dashboard'}
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-8">
      <EventHeader event={event} progress={progress} />

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-panel backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
            {isGerman ? 'Dokument hinzufügen' : 'Add document'}
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold text-slate-950">
            {isGerman ? 'Nachweise zur Arbeit zuordnen' : 'Attach documents to the work'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isGerman
              ? 'Dateien anlegen, als hochgeladen oder fehlend markieren und mit den zugehörigen Checklisten-Einträgen verknüpfen.'
              : 'Add files, mark them uploaded or missing, and link them to the related checklist items.'}
          </p>

          <div className="mt-5">
            <AddDocumentForm
              onSubmit={(input) => addDocument(event.id, input)}
              requirements={requirements}
            />
          </div>
        </div>

        <div className="space-y-4">
          {documents.length === 0 ? (
            <EmptyState
              title={isGerman ? 'Noch keine Dokumente' : 'No documents yet'}
              description={
                isGerman
                  ? 'Erstes Dokument hinzufügen, um Genehmigungen, Versicherungen, Pläne und weitere Dateien mit Anforderungen zu verknüpfen.'
                  : 'Add the first document to link permits, insurance, plans, and other files to requirements.'
              }
            />
          ) : (
            documents.map((document) => (
              <DocumentItem
                key={document.id}
                document={document}
                onLinksChange={(linkedRequirementIds) =>
                  updateDocumentLinks(document.id, linkedRequirementIds)
                }
                onNotesChange={(notes) => updateDocumentNotes(document.id, notes)}
                onStatusChange={(status) => updateDocumentStatus(document.id, status)}
                requirements={requirements}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
