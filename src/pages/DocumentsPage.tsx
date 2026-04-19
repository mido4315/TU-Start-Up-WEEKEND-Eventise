import { Link, useParams } from 'react-router-dom'
import { AddDocumentForm } from '../components/AddDocumentForm'
import { DocumentItem } from '../components/DocumentItem'
import { EmptyState } from '../components/EmptyState'
import { EventHeader } from '../components/EventHeader'
import { useTranslation } from '../i18n/useTranslation'
import { useEventWorkspace } from '../hooks/useEventWorkspace'
import { useEventStore } from '../store/useEventStore'

export function DocumentsPage() {
  const { id } = useParams()
  const { event, requirements, documents, progress } = useEventWorkspace(id)
  const addDocument = useEventStore((state) => state.addDocument)
  const updateDocumentLinks = useEventStore((state) => state.updateDocumentLinks)
  const updateDocumentNotes = useEventStore((state) => state.updateDocumentNotes)
  const updateDocumentStatus = useEventStore((state) => state.updateDocumentStatus)
  const { t } = useTranslation()

  if (!event) {
    return (
      <EmptyState
        title={t('common.eventNotFound')}
        description={t('documentsPage.missingDescription')}
        action={
          <Link
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/dashboard"
          >
            {t('common.backToDashboard')}
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
            {t('documentsPage.addEyebrow')}
          </p>
          <h2 className="section-title mt-2 text-2xl font-semibold text-slate-950">
            {t('documentsPage.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t('documentsPage.description')}
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
              title={t('documentsPage.emptyTitle')}
              description={t('documentsPage.emptyDescription')}
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
