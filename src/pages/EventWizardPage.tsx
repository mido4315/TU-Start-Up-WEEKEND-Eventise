import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { MapLocationPicker } from '../components/MapLocationPicker'
import { PageHeader } from '../components/PageHeader'
import { getRequiredDocuments } from '../data/documentRequirements'
import { useTranslation } from '../i18n/useTranslation'
import { useEventStore } from '../store/useEventStore'
import type { EventFormValues, FeeZone, UsageType } from '../types/event'
import { getCategoryLabel } from '../utils/constants'
import { calculateFee, dortmundContacts, feeRates } from '../utils/fees'
import { formatBooleanValue, formatDate } from '../utils/format'
import {
  getContactLabel,
  getRequiredDocumentDisplay,
  getRequirementDisplay,
} from '../utils/localizedContent'
import { generateRequirements } from '../utils/rulesEngine'

const TOTAL_STEPS = 7

const initialForm: EventFormValues = {
  organizerFirstName: '',
  organizerLastName: '',
  organizerAddress: '',
  organizerPhone: '',
  organizerIdNumber: '',
  name: '',
  firstName: '',
  lastName: '',
  date: '2026-08-22T12:00:00.000Z',
  location: '',
  expectedAttendance: 250,
  publicSpace: false,
  venueType: 'public',
  streetClosure: false,
  noParking: false,
  transitImpact: false,
  affectedTransitLines: '',
  procession: false,
  processionRoute: '',
  music: false,
  alcohol: false,
  foodVendors: false,
  fundingNeeded: false,
  flyingStructures: false,
  highRisk: false,
  feeZone: 'zone_2',
  usageType: 'other',
  usageAreaSqm: 50,
  usageDays: 1,
}

function Toggle({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean
  label: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      className={`rounded-3xl border p-5 text-left transition ${
        active
          ? 'border-slate-950 bg-slate-950 text-white'
          : 'border-slate-200 bg-white text-slate-900 hover:border-brand-300 hover:bg-brand-50'
      }`}
      onClick={onClick}
      type="button"
    >
      <p className="font-semibold">{label}</p>
      <p className={`mt-2 text-sm ${active ? 'text-slate-200' : 'text-slate-600'}`}>
        {description}
      </p>
    </button>
  )
}

function LabeledInput({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  )
}

const inputClass =
  'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500'

const selectClass =
  'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500'

export function EventWizardPage() {
  const navigate = useNavigate()
  const createEvent = useEventStore((state) => state.createEvent)
  const { language, t, tList } = useTranslation()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<EventFormValues>(initialForm)
  const [mapPickerTarget, setMapPickerTarget] = useState<'location' | 'organizerAddress' | null>(
    null,
  )

  const previewRequirements = generateRequirements({ ...form, id: 'preview-event' })
  const requiredDocs = getRequiredDocuments(form)
  const feeEstimate = calculateFee(form.usageType, form.feeZone, form.usageAreaSqm, form.usageDays)
  const locale = language === 'de' ? 'de-DE' : 'en-US'
  const stepLabels = [
    t('wizard.steps.organizer'),
    t('wizard.steps.basics'),
    t('wizard.steps.traffic'),
    t('wizard.steps.risks'),
    t('wizard.steps.documents'),
    t('wizard.steps.fees'),
    t('wizard.steps.review'),
  ]

  const update = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const toggle = (key: keyof EventFormValues) =>
    setForm((current) => ({
      ...current,
      [key]: !current[key as keyof EventFormValues],
    }))

  const getToggleCopy = (key: string) => {
    const [label, description] = tList(`wizard.toggles.${key}`)
    return { label: label ?? key, description: description ?? '' }
  }

  const formatFee = (value: number) =>
    value.toLocaleString(locale, { style: 'currency', currency: 'EUR' })

  const mockLocations = [
    {
      id: 'A',
      name: t('wizard.mapPicker.locations.marketSquare.name'),
      detail: t('wizard.mapPicker.locations.marketSquare.detail'),
      position: [51.5147, 7.4653] as [number, number],
    },
    {
      id: 'B',
      name: t('wizard.mapPicker.locations.riversidePark.name'),
      detail: t('wizard.mapPicker.locations.riversidePark.detail'),
      position: [51.4916, 7.5285] as [number, number],
    },
    {
      id: 'C',
      name: t('wizard.mapPicker.locations.communityHall.name'),
      detail: t('wizard.mapPicker.locations.communityHall.detail'),
      position: [51.5296, 7.4624] as [number, number],
    },
  ]

  const selectedMapValue =
    mapPickerTarget === 'organizerAddress' ? form.organizerAddress : form.location

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('wizard.eyebrow')}
        title={t('wizard.title')}
        description={t('wizard.description')}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card
          title={t('wizard.step', {
            step,
            total: TOTAL_STEPS,
            label: stepLabels[step - 1],
          })}
          eyebrow={t('wizard.assistant')}
        >
          <div className="mb-6 flex gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((item) => (
              <div
                key={item}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  item <= step ? 'bg-slate-950' : 'bg-brand-100'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="grid gap-4">
              <p className="text-sm text-slate-600">
                {t('wizard.organizerIntro')}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput label={t('wizard.organizerFields.firstName')}>
                  <input
                    className={inputClass}
                    onChange={(e) => update('organizerFirstName', e.target.value)}
                    placeholder={t('wizard.organizerPlaceholders.firstName')}
                    value={form.organizerFirstName}
                  />
                </LabeledInput>
                <LabeledInput label={t('wizard.organizerFields.lastName')}>
                  <input
                    className={inputClass}
                    onChange={(e) => update('organizerLastName', e.target.value)}
                    placeholder={t('wizard.organizerPlaceholders.lastName')}
                    value={form.organizerLastName}
                  />
                </LabeledInput>
              </div>

              <div className="text-sm font-medium text-slate-700">
                <p>{t('wizard.organizerFields.address')}</p>
                <button
                  className={`${inputClass} flex min-h-[52px] items-center justify-between gap-3 text-left ${
                    form.organizerAddress ? 'text-slate-900' : 'text-slate-400'
                  }`}
                  onClick={() => setMapPickerTarget('organizerAddress')}
                  type="button"
                >
                  <span>
                    {form.organizerAddress || t('wizard.mapPicker.emptyAddress')}
                  </span>
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
                    {t('wizard.mapPicker.open')}
                  </span>
                </button>
              </div>

              <LabeledInput label={t('wizard.organizerFields.phone')}>
                <input
                  className={inputClass}
                  onChange={(e) => update('organizerPhone', e.target.value)}
                  placeholder={t('wizard.organizerPlaceholders.phone')}
                  type="tel"
                  value={form.organizerPhone}
                />
              </LabeledInput>

              <LabeledInput label={t('wizard.organizerFields.idNumber')}>
                <input
                  className={inputClass}
                  onChange={(e) => update('organizerIdNumber', e.target.value)}
                  placeholder={t('wizard.organizerPlaceholders.idNumber')}
                  value={form.organizerIdNumber}
                />
              </LabeledInput>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-slate-700">
                <span className="font-semibold">{t('wizard.organizerPrivacyTitle')}</span>{' '}
                {t('wizard.organizerPrivacyText')}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              <LabeledInput label={t('wizard.fields.eventName')}>
                <input
                  className={inputClass}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder={t('wizard.fields.eventNamePlaceholder')}
                  required
                  value={form.name}
                />
              </LabeledInput>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput label={t('wizard.fields.firstName')}>
                  <input
                    className={inputClass}
                    onChange={(event) => update('firstName', event.target.value)}
                    placeholder={t('wizard.fields.firstNamePlaceholder')}
                    required
                    value={form.firstName}
                  />
                </LabeledInput>

                <LabeledInput label={t('wizard.fields.lastName')}>
                  <input
                    className={inputClass}
                    onChange={(event) => update('lastName', event.target.value)}
                    placeholder={t('wizard.fields.lastNamePlaceholder')}
                    required
                    value={form.lastName}
                  />
                </LabeledInput>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput label={t('wizard.fields.dateTime')}>
                  <input
                    className={inputClass}
                    onChange={(event) => update('date', new Date(event.target.value).toISOString())}
                    type="datetime-local"
                    value={form.date.slice(0, 16)}
                  />
                </LabeledInput>

                <LabeledInput label={t('wizard.fields.attendance')}>
                  <input
                    className={inputClass}
                    min={1}
                    onChange={(event) => update('expectedAttendance', Number(event.target.value))}
                    type="number"
                    value={form.expectedAttendance}
                  />
                </LabeledInput>
              </div>

              <div className="text-sm font-medium text-slate-700">
                <p>{t('wizard.fields.location')}</p>
                <button
                  className={`${inputClass} flex min-h-[52px] items-center justify-between gap-3 text-left ${
                    form.location ? 'text-slate-900' : 'text-slate-400'
                  }`}
                  onClick={() => setMapPickerTarget('location')}
                  type="button"
                >
                  <span>{form.location || t('wizard.mapPicker.emptyLocation')}</span>
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
                    {t('wizard.mapPicker.open')}
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  {t('wizard.fields.venueType')}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Toggle
                    active={form.venueType === 'public'}
                    {...getToggleCopy('publicVenue')}
                    onClick={() => {
                      update('venueType', 'public')
                      update('publicSpace', true)
                    }}
                  />
                  <Toggle
                    active={form.venueType === 'private'}
                    {...getToggleCopy('privateVenue')}
                    onClick={() => {
                      update('venueType', 'private')
                      update('publicSpace', false)
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  {t('wizard.fields.traffic')}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Toggle
                    active={form.streetClosure}
                    {...getToggleCopy('streetClosure')}
                    onClick={() => toggle('streetClosure')}
                  />
                  <Toggle
                    active={form.noParking}
                    {...getToggleCopy('noParking')}
                    onClick={() => toggle('noParking')}
                  />
                  <Toggle
                    active={form.transitImpact}
                    {...getToggleCopy('transitImpact')}
                    onClick={() => toggle('transitImpact')}
                  />
                  <Toggle
                    active={form.procession}
                    {...getToggleCopy('procession')}
                    onClick={() => toggle('procession')}
                  />
                </div>
              </div>

              {form.transitImpact && (
                <LabeledInput label={t('wizard.fields.transitLines')}>
                  <input
                    className={inputClass}
                    onChange={(event) => update('affectedTransitLines', event.target.value)}
                    placeholder={t('wizard.fields.transitLinesPlaceholder')}
                    value={form.affectedTransitLines}
                  />
                </LabeledInput>
              )}

              {form.procession && (
                <LabeledInput label={t('wizard.fields.processionRoute')}>
                  <textarea
                    className={`${inputClass} min-h-[80px] resize-y`}
                    onChange={(event) => update('processionRoute', event.target.value)}
                    placeholder={t('wizard.fields.processionRoutePlaceholder')}
                    value={form.processionRoute}
                  />
                </LabeledInput>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-3 md:grid-cols-2">
              {([
                'music',
                'alcohol',
                'foodVendors',
                'fundingNeeded',
                'flyingStructures',
                'highRisk',
              ] as const).map((key) => (
                <Toggle
                  key={key}
                  active={form[key] as boolean}
                  {...getToggleCopy(key)}
                  onClick={() => toggle(key)}
                />
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <p className="text-sm text-slate-600">{t('wizard.documentsIntro')}</p>

              {(['mandatory', 'conditional', 'high_risk'] as const).map((condition) => {
                const docs = requiredDocs.filter((document) => document.condition === condition)
                if (docs.length === 0) return null
                const heading =
                  condition === 'mandatory'
                    ? t('wizard.docGroups.mandatory')
                    : condition === 'conditional'
                      ? t('wizard.docGroups.conditional')
                      : t('wizard.docGroups.highRisk')
                const tone =
                  condition === 'mandatory'
                    ? 'border-slate-200 bg-slate-50/80'
                    : condition === 'conditional'
                      ? 'border-brand-100 bg-brand-50/70'
                      : 'border-amber-200 bg-amber-50/70'
                return (
                  <div key={condition}>
                    <p className="mb-3 text-sm font-semibold text-slate-900">{heading}</p>
                    <div className="grid gap-3">
                      {docs.map((doc) => {
                        const display = getRequiredDocumentDisplay(doc, language)

                        return (
                          <div key={doc.id} className={`rounded-2xl border p-4 ${tone}`}>
                            <p className="font-semibold text-slate-900">{display.title}</p>
                            <p className="mt-1 text-sm text-slate-600">{display.description}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">{t('wizard.feeIntro')}</p>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput label={t('wizard.fields.feeZone')}>
                  <select
                    className={selectClass}
                    onChange={(event) => update('feeZone', event.target.value as FeeZone)}
                    value={form.feeZone}
                  >
                    {(['zone_1', 'zone_2', 'zone_3'] as FeeZone[]).map((value) => (
                      <option key={value} value={value}>
                        {t(`fees.zones.${value}`)}
                      </option>
                    ))}
                  </select>
                </LabeledInput>

                <LabeledInput label={t('wizard.fields.usageType')}>
                  <select
                    className={selectClass}
                    onChange={(event) => update('usageType', event.target.value as UsageType)}
                    value={form.usageType}
                  >
                    {([
                      'tables_seating',
                      'food_drink_stand',
                      'info_promo_pavilion',
                      'product_display',
                      'other',
                    ] as UsageType[]).map((value) => (
                      <option key={value} value={value}>
                        {t(`fees.usageTypes.${value}`)}
                      </option>
                    ))}
                  </select>
                </LabeledInput>

                {form.usageType !== 'other' && (
                  <>
                    <LabeledInput label={t('wizard.fields.area')}>
                      <input
                        className={inputClass}
                        min={1}
                        onChange={(event) => update('usageAreaSqm', Number(event.target.value))}
                        type="number"
                        value={form.usageAreaSqm}
                      />
                    </LabeledInput>

                    <LabeledInput label={t('wizard.fields.days')}>
                      <input
                        className={inputClass}
                        min={1}
                        onChange={(event) => update('usageDays', Number(event.target.value))}
                        type="number"
                        value={form.usageDays}
                      />
                    </LabeledInput>
                  </>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  {t('wizard.estimatedFee')}
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {formatFee(feeEstimate.total)}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {feeEstimate.isFlat
                    ? t('wizard.minimumFee')
                    : `${feeEstimate.rate.toLocaleString(locale, {
                        minimumFractionDigits: 2,
                      })} ${t('fees.unitPerDay')} x ${form.usageAreaSqm} m² x ${form.usageDays} ${t('wizard.fields.days').toLowerCase()}`}
                  {!feeEstimate.isFlat && feeEstimate.total === 30.68 && t('wizard.minimumApplied')}
                </p>
              </div>

              <div className="overflow-x-auto">
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  {t('wizard.feeTable')}
                </p>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                      {tList('wizard.feeTableColumns').map((column) => (
                        <th key={column} className="pb-2 pr-4">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {feeRates.map((rate) => (
                      <tr key={rate.usageType} className="border-b border-slate-100">
                        <td className="py-2 pr-4 font-medium text-slate-700">
                          {t(`fees.usageTypes.${rate.usageType}`)}
                        </td>
                        <td className="py-2 pr-4 text-slate-600">
                          {rate.zone1.toLocaleString(locale, { minimumFractionDigits: 2 })}{' '}
                          {t('fees.unitPerDay')}
                        </td>
                        <td className="py-2 pr-4 text-slate-600">
                          {rate.zone2.toLocaleString(locale, { minimumFractionDigits: 2 })}{' '}
                          {t('fees.unitPerDay')}
                        </td>
                        <td className="py-2 text-slate-600">
                          {rate.zone3.toLocaleString(locale, { minimumFractionDigits: 2 })}{' '}
                          {rate.usageType === 'other' ? t('fees.unitFlat') : t('fees.unitPerDay')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  {t('wizard.organizerReviewTitle')}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {([
                    [
                      t('wizard.organizerReviewLabels.firstName'),
                      form.organizerFirstName || t('wizard.organizerReviewMissing'),
                    ],
                    [
                      t('wizard.organizerReviewLabels.lastName'),
                      form.organizerLastName || t('wizard.organizerReviewMissing'),
                    ],
                    [
                      t('wizard.organizerReviewLabels.address'),
                      form.organizerAddress || t('wizard.organizerReviewMissing'),
                    ],
                    [
                      t('wizard.organizerReviewLabels.phone'),
                      form.organizerPhone || t('wizard.organizerReviewMissing'),
                    ],
                    [
                      t('wizard.organizerReviewLabels.idNumber'),
                      form.organizerIdNumber || t('wizard.organizerReviewNoId'),
                    ],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
                      <p className="mt-2 font-medium text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {([
                  [t('wizard.fields.eventName'), form.name || t('wizard.review.noName')],
                  [
                    t('wizard.review.organizer'),
                    `${form.firstName} ${form.lastName}`.trim() ||
                      t('wizard.review.noOrganizer'),
                  ],
                  [t('wizard.review.date'), formatDate(form.date, language)],
                  [t('wizard.review.location'), form.location || t('wizard.review.noLocation')],
                  [t('common.attendance'), String(form.expectedAttendance)],
                  [t('wizard.review.venue'), form.venueType === 'public' ? t('wizard.review.public') : t('wizard.review.private')],
                  [t('wizard.review.streetClosure'), formatBooleanValue(form.streetClosure, language)],
                  [t('wizard.review.noParking'), formatBooleanValue(form.noParking, language)],
                  [
                    t('wizard.review.transit'),
                    form.transitImpact
                      ? `${t('common.yes')} - ${form.affectedTransitLines || t('wizard.review.linesNeeded')}`
                      : t('common.no'),
                  ],
                  [t('wizard.review.procession'), formatBooleanValue(form.procession, language)],
                  [t('workspacePage.music'), formatBooleanValue(form.music, language)],
                  [t('workspacePage.alcohol'), formatBooleanValue(form.alcohol, language)],
                  [t('workspacePage.vendors'), formatBooleanValue(form.foodVendors, language)],
                  [t('wizard.review.flyingStructures'), formatBooleanValue(form.flyingStructures, language)],
                  [t('wizard.review.highRisk'), formatBooleanValue(form.highRisk, language)],
                  [t('wizard.review.documents'), t('wizard.review.documentsCount', { count: requiredDocs.length })],
                  [t('wizard.review.fee'), formatFee(feeEstimate.total)],
                ] as [string, string][]).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {label}
                    </p>
                    <p className="mt-2 font-medium text-slate-900">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {t('wizard.generatedRequirements')}
                </p>
                <div className="mt-3 grid gap-3">
                  {previewRequirements.map((item) => {
                    const display = getRequirementDisplay(item, language)

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4"
                      >
                        <p className="font-semibold text-slate-900">{display.title}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {getCategoryLabel(item.category, language)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  {t('wizard.deadlinesTitle')}
                </p>
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold">{t('wizard.standardEvent')}</span>{' '}
                    {t('wizard.standardEventText')}{' '}
                    <span className="font-semibold">{t('wizard.eightWeeks')}</span>{' '}
                    {t('wizard.before')}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold">{t('wizard.largeEvent')}</span>{' '}
                    {t('wizard.largeEventText')}{' '}
                    <span className="font-semibold">{t('wizard.sixMonths')}</span>{' '}
                    {t('wizard.before')}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  {t('wizard.contactTitle')}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {getContactLabel('eventRegistration', language)}
                    </p>
                    <a
                      className="mt-2 block font-medium text-brand-700 hover:underline"
                      href={`mailto:${dortmundContacts.eventRegistration.email}`}
                    >
                      {dortmundContacts.eventRegistration.email}
                    </a>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {getContactLabel('specialUse', language)}
                    </p>
                    <a
                      className="mt-2 block font-medium text-brand-700 hover:underline"
                      href={`mailto:${dortmundContacts.specialUse.email}`}
                    >
                      {dortmundContacts.specialUse.email}
                    </a>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {t('wizard.phone')}
                    </p>
                    <p className="mt-2 font-medium text-slate-900">
                      {dortmundContacts.phones.join(' / ')}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {t('wizard.address')}
                    </p>
                    <p className="mt-2 font-medium text-slate-900">
                      {t('wizard.authorityLabel')}: {dortmundContacts.address}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {t('wizard.faxLabel')}: {dortmundContacts.fax}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <button
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={step === 1}
              onClick={() => setStep((current) => current - 1)}
              type="button"
            >
              {t('common.back')}
            </button>

            {step < TOTAL_STEPS ? (
              <button
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                onClick={() => setStep((current) => current + 1)}
                type="button"
              >
                {t('common.next')}
              </button>
            ) : (
              <button
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                onClick={() => {
                  const createdEvent = createEvent(form)
                  navigate(`/events/${createdEvent.id}`)
                }}
                type="button"
              >
                {t('wizard.submit')}
              </button>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <details className="group rounded-3xl border border-white/70 bg-white/80 shadow-panel backdrop-blur">
            <summary className="flex cursor-pointer list-none items-center justify-between p-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/70">
                  {t('wizard.rulesEngine')}
                </p>
                <h2 className="section-title text-xl font-semibold text-slate-900">
                  {t('wizard.rulesTitle')}
                </h2>
              </div>
              <span className="ml-3 shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition group-open:bg-slate-100">
                <span className="group-open:hidden">{t('wizard.show')}</span>
                <span className="hidden group-open:inline">{t('wizard.hide')}</span>
              </span>
            </summary>
            <div className="space-y-3 px-5 pb-5 text-sm text-slate-700">
              {tList('wizard.rules').map((rule) => (
                <div
                  key={rule}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                >
                  {rule}
                </div>
              ))}
            </div>
          </details>

          {step >= 5 && (
            <Card
              title={t('wizard.requiredDocumentsTitle', { count: requiredDocs.length })}
              eyebrow={t('wizard.documentCheck')}
            >
              <div className="space-y-2 text-sm">
                {requiredDocs.map((doc) => {
                  const display = getRequiredDocumentDisplay(doc, language)

                  return (
                    <div key={doc.id} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                          doc.condition === 'mandatory'
                            ? 'bg-slate-400'
                            : doc.condition === 'conditional'
                              ? 'bg-brand-400'
                              : 'bg-amber-400'
                        }`}
                      />
                      <span className="text-slate-700">{display.title}</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>
      </div>

      {mapPickerTarget && (
        <MapLocationPicker
          closeLabel={t('wizard.mapPicker.close')}
          hideLocationList={mapPickerTarget === 'organizerAddress'}
          locations={mockLocations}
          onClose={() => setMapPickerTarget(null)}
          onSelect={(location) => {
            if (mapPickerTarget === 'organizerAddress') {
              update('organizerAddress', location)
            } else {
              update('location', location)
            }
            setMapPickerTarget(null)
          }}
          selectLabel={t('wizard.mapPicker.select')}
          selectedLocation={selectedMapValue}
          subtitle={t('wizard.mapPicker.subtitle')}
          title={t('wizard.mapPicker.title')}
        />
      )}
    </div>
  )
}
