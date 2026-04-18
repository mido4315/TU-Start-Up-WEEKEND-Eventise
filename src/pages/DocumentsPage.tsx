import { Link, useParams } from 'react-router-dom'
import { AddDocumentForm } from '../components/AddDocumentForm'
import { DocumentItem } from '../components/DocumentItem'
import { EmptyState } from '../components/EmptyState'
import { EventHeader } from '../components/EventHeader'
import { useEventWorkspace } from '../hooks/useEventWorkspace'
import { useEventStore } from '../store/useEventStore'

export function DocumentsPage() {
  const { id } = useParams()
  const { event, requirements, documents, progress } = useEventWorkspace(id)
  const addDocument = useEventStore((state) => state.addDocument)
  const updateDocumentLinks = useEventStore((state) => state.updateDocumentLinks)
  const updateDocumentNotes = useEventStore((state) => state.updateDocumentNotes)
  const updateDocumentStatus = useEventStore((state) => state.updateDocumentStatus)

  if (!event) {
    return (
      <EmptyState
        title="Veranstaltung nicht gefunden"
        description="Der angeforderte Dokumenten-Workspace existiert nicht im lokalen Speicher."
        action={
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/dashboard"
          >
            Zum Dashboard
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
            Dokument hinzufügen
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold text-slate-950">
            Nachweise zur Arbeit zuordnen
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Dateien anlegen, als hochgeladen oder fehlend markieren und mit den zugehörigen Checklisten-Einträgen verknüpfen.
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
              title="Noch keine Dokumente"
              description="Erstes Dokument hinzufügen, um Genehmigungen, Versicherungen, Pläne und weitere Dateien mit Anforderungen zu verknüpfen."
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
