import { Link, useParams } from 'react-router-dom'
import { BlockerList } from '../components/BlockerList'
import { CategoryProgressList } from '../components/CategoryProgressList'
import { DeadlineList } from '../components/DeadlineList'
import { EmptyState } from '../components/EmptyState'
import { EventHeader } from '../components/EventHeader'
import { MetricCard } from '../components/MetricCard'
import { NextActionsPanel } from '../components/NextActionsPanel'
import { useTranslation } from '../i18n/useTranslation'
import { useEventWorkspace } from '../hooks/useEventWorkspace'
import { formatBooleanValue, formatDocumentStatus } from '../utils/format'
import { getEventDocumentDisplay } from '../utils/localizedContent'

export function EventWorkspacePage() {
  const { id } = useParams()
  const { event, documents, progress } = useEventWorkspace(id)
  const { language, t } = useTranslation()

  if (!event) {
    return (
      <EmptyState
        title={t('common.eventNotFound')}
        description={t('workspacePage.missingDescription')}
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={
            t('workspacePage.readinessDetail')
          }
          label={t('common.readiness')}
          value={`${progress.readiness}%`}
        />
        <MetricCard
          detail={
            t('workspacePage.checklistDetail')
          }
          label={t('workspacePage.checklistProgress')}
          value={`${progress.completedRequirements}/${progress.totalRequirements}`}
        />
        <MetricCard
          detail={
            t('workspacePage.documentsDetail')
          }
          label={t('common.documents')}
          value={`${progress.uploadedDocuments}/${progress.totalDocuments || 0}`}
        />
        <MetricCard
          detail={
            t('workspacePage.blockersDetail')
          }
          label={t('common.blockers')}
          value={String(progress.blockers.length)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
              {t('workspacePage.summary')}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                [
                  t('workspacePage.organizer'),
                  `${event.firstName ?? ''} ${event.lastName ?? ''}`.trim() ||
                    t('workspacePage.noOrganizer'),
                ],
                [t('workspacePage.publicSpace'), formatBooleanValue(event.publicSpace, language)],
                [t('workspacePage.music'), formatBooleanValue(event.music, language)],
                [t('workspacePage.alcohol'), formatBooleanValue(event.alcohol, language)],
                [t('workspacePage.vendors'), formatBooleanValue(event.foodVendors, language)],
                [t('workspacePage.funding'), formatBooleanValue(event.fundingNeeded, language)],
                [t('common.attendance'), String(event.expectedAttendance)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <CategoryProgressList items={progress.categoryProgress} />
          <DeadlineList
            items={progress.upcomingDeadlines}
            title={
              t('workspacePage.eventDeadlines')
            }
          />
        </div>

        <div className="space-y-6">
          <NextActionsPanel actions={progress.nextActions} eventId={event.id} />
          <BlockerList blockers={progress.blockers} />

          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-panel backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/80">
                  {t('workspacePage.currentDocuments')}
                </p>
                <h2 className="section-title mt-2 text-xl font-semibold text-slate-950">
                  {t('workspacePage.workspaceFiles')}
                </h2>
              </div>
              <Link
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
                to={`/events/${event.id}/documents`}
              >
                {t('common.manage')}
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {documents.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {t('workspacePage.noDocuments')}
                </p>
              ) : (
                documents.slice(0, 3).map((document) => {
                  const display = getEventDocumentDisplay(document, language)

                  return (
                    <div
                      key={document.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <p className="font-semibold text-slate-900">{display.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {display.type} | {formatDocumentStatus(document.status, language)}
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
