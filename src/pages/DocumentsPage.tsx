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
        title="Event not found"
        description="The documents workspace you requested does not exist in the local store."
        action={
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/dashboard"
          >
            Back to dashboard
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
            Add document
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold text-slate-950">
            Keep evidence attached to the work
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Add mock files, mark them uploaded or missing, and connect them back to the checklist items they support.
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
              title="No documents yet"
              description="Add the first document to start tying permits, insurance, plans, and other files to event requirements."
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
