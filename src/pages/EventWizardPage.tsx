import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { getRequiredDocuments } from '../data/documentRequirements'
import type { EventFormValues, FeeZone, UsageType } from '../types/event'
import { categoryLabels } from '../utils/constants'
import { calculateFee, dortmundContacts, feeRates, feeZoneLabels, usageTypeLabels } from '../utils/fees'
import { formatDate } from '../utils/format'
import { generateRequirements } from '../utils/rulesEngine'
import { useEventStore } from '../store/useEventStore'

const TOTAL_STEPS = 6

const initialForm: EventFormValues = {
  name: '',
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

const stepLabels = [
  'Grunddaten',
  'Fläche & Verkehr',
  'Risikofaktoren',
  'Unterlagen',
  'Gebühren',
  'Übersicht & Einreichen',
]

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
  children: React.ReactNode
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
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<EventFormValues>(initialForm)

  const previewRequirements = generateRequirements({ ...form, id: 'preview-event' })
  const requiredDocs = getRequiredDocuments(form)
  const feeEstimate = calculateFee(form.usageType, form.feeZone, form.usageAreaSqm, form.usageDays)

  const update = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const toggle = (key: keyof EventFormValues) =>
    setForm((current) => ({
      ...current,
      [key]: !current[key as keyof EventFormValues],
    }))

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Neue Veranstaltung"
        title="Veranstaltung anlegen und Checkliste generieren"
        description="Grunddaten erfassen, Risikofaktoren markieren und die automatisch erzeugten Anforderungen prüfen."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card title={`Schritt ${step} von ${TOTAL_STEPS} – ${stepLabels[step - 1]}`} eyebrow="Assistent">
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
              <LabeledInput label="Veranstaltungsname">
                <input
                  className={inputClass}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Laternenumzug, Straßenfest, Sommernachtsfest…"
                  required
                  value={form.name}
                />
              </LabeledInput>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput label="Datum & Uhrzeit">
                  <input
                    className={inputClass}
                    onChange={(e) => update('date', new Date(e.target.value).toISOString())}
                    type="datetime-local"
                    value={form.date.slice(0, 16)}
                  />
                </LabeledInput>

                <LabeledInput label="Erwartete Teilnehmerzahl">
                  <input
                    className={inputClass}
                    min={1}
                    onChange={(e) => update('expectedAttendance', Number(e.target.value))}
                    type="number"
                    value={form.expectedAttendance}
                  />
                </LabeledInput>
              </div>

              <LabeledInput label="Veranstaltungsort">
                <input
                  className={inputClass}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="Marktplatz, Stadthalle, Vereinsgelände…"
                  required
                  value={form.location}
                />
              </LabeledInput>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  Flächenart
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Toggle
                    active={form.venueType === 'public'}
                    label="Öffentliche Fläche"
                    description="Straßenbereich, Platz oder Park in städtischem Besitz."
                    onClick={() => {
                      update('venueType', 'public')
                      update('publicSpace', true)
                    }}
                  />
                  <Toggle
                    active={form.venueType === 'private'}
                    label="Private Fläche"
                    description="Vereinsgelände, Privatgrundstück oder gemietete Halle."
                    onClick={() => {
                      update('venueType', 'private')
                      update('publicSpace', false)
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  Verkehr & Infrastruktur
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Toggle
                    active={form.streetClosure}
                    label="Straßensperrung erforderlich"
                    description="Skizze beifügen. Zusätzliche Kosten möglich."
                    onClick={() => toggle('streetClosure')}
                  />
                  <Toggle
                    active={form.noParking}
                    label="Haltverbote erforderlich"
                    description="Skizze beifügen. Kosten für Beschilderung möglich."
                    onClick={() => toggle('noParking')}
                  />
                  <Toggle
                    active={form.transitImpact}
                    label="ÖPNV betroffen"
                    description="Betroffene Linien angeben."
                    onClick={() => toggle('transitImpact')}
                  />
                  <Toggle
                    active={form.procession}
                    label="Umzug / Aufzug geplant"
                    description="Streckenverlauf und Teilnehmerzahl angeben."
                    onClick={() => toggle('procession')}
                  />
                </div>
              </div>

              {form.transitImpact && (
                <LabeledInput label="Betroffene ÖPNV-Linien">
                  <input
                    className={inputClass}
                    onChange={(e) => update('affectedTransitLines', e.target.value)}
                    placeholder="z. B. U42, Bus 440, Straßenbahn 403"
                    value={form.affectedTransitLines}
                  />
                </LabeledInput>
              )}

              {form.procession && (
                <LabeledInput label="Streckenverlauf / Beschreibung Umzug">
                  <textarea
                    className={inputClass + ' min-h-[80px] resize-y'}
                    onChange={(e) => update('processionRoute', e.target.value)}
                    placeholder="Start am Friedensplatz → Hansastraße → Westenhellweg → Alter Markt"
                    value={form.processionRoute}
                  />
                </LabeledInput>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-3 md:grid-cols-2">
              {([
                {
                  key: 'music' as const,
                  label: 'Musik / Beschallung',
                  description: 'Kann GEMA-Lizenz und Beschallungskonzept erfordern.',
                },
                {
                  key: 'alcohol' as const,
                  label: 'Alkoholausschank',
                  description: 'Schankerlaubnis und Anbieterpflichten erforderlich.',
                },
                {
                  key: 'foodVendors' as const,
                  label: 'Stände / Imbiss',
                  description: 'Anbieterkoordination und Teilnehmerliste.',
                },
                {
                  key: 'fundingNeeded' as const,
                  label: 'Förderung benötigt',
                  description: 'Förderantrag oder Sponsoring-Tracking.',
                },
                {
                  key: 'flyingStructures' as const,
                  label: 'Fliegende Bauten',
                  description: 'Zelte, Bühnen, Tribünen – Prüfbuch erforderlich.',
                },
                {
                  key: 'highRisk' as const,
                  label: 'Erhöhtes Risiko / Großveranstaltung',
                  description: 'Löst Sicherheits-, Rettungs- und Sanitätskonzept aus.',
                },
              ]).map((item) => (
                <Toggle
                  key={item.key}
                  active={form[item.key] as boolean}
                  label={item.label}
                  description={item.description}
                  onClick={() => toggle(item.key)}
                />
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <p className="text-sm text-slate-600">
                Basierend auf Ihren Angaben werden folgende Unterlagen benötigt.
                Die Liste aktualisiert sich automatisch.
              </p>

              {(['mandatory', 'conditional', 'high_risk'] as const).map((condition) => {
                const docs = requiredDocs.filter((d) => d.condition === condition)
                if (docs.length === 0) return null
                const heading =
                  condition === 'mandatory'
                    ? 'Pflichtunterlagen'
                    : condition === 'conditional'
                      ? 'Zusätzlich je nach Veranstaltungstyp'
                      : 'Großveranstaltung / erhöhtes Risiko'
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
                      {docs.map((doc) => (
                        <div key={doc.id} className={`rounded-2xl border p-4 ${tone}`}>
                          <p className="font-semibold text-slate-900">{doc.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{doc.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Orientierung nach dem städtischen Gebührentarif für Sondernutzungen.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput label="Gebührenzone">
                  <select
                    className={selectClass}
                    onChange={(e) => update('feeZone', e.target.value as FeeZone)}
                    value={form.feeZone}
                  >
                    {(Object.entries(feeZoneLabels) as [FeeZone, string][]).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </LabeledInput>

                <LabeledInput label="Nutzungsart">
                  <select
                    className={selectClass}
                    onChange={(e) => update('usageType', e.target.value as UsageType)}
                    value={form.usageType}
                  >
                    {(Object.entries(usageTypeLabels) as [UsageType, string][]).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </LabeledInput>

                {form.usageType !== 'other' && (
                  <>
                    <LabeledInput label="Fläche (m²)">
                      <input
                        className={inputClass}
                        min={1}
                        onChange={(e) => update('usageAreaSqm', Number(e.target.value))}
                        type="number"
                        value={form.usageAreaSqm}
                      />
                    </LabeledInput>

                    <LabeledInput label="Anzahl Tage">
                      <input
                        className={inputClass}
                        min={1}
                        onChange={(e) => update('usageDays', Number(e.target.value))}
                        type="number"
                        value={form.usageDays}
                      />
                    </LabeledInput>
                  </>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Geschätzte Gebühr
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {feeEstimate.total.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {feeEstimate.isFlat
                    ? 'Mindestgebühr (einmalig)'
                    : `${feeEstimate.rate.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                      })} €/m²/Tag × ${form.usageAreaSqm} m² × ${form.usageDays} Tag(e)`}
                  {!feeEstimate.isFlat && feeEstimate.total === 30.68 && ' (Mindestgebühr greift)'}
                </p>
              </div>

              <div className="overflow-x-auto">
                <p className="mb-3 text-sm font-semibold text-slate-900">Gebührentarif-Übersicht</p>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                      <th className="pb-2 pr-4">Nutzungsart</th>
                      <th className="pb-2 pr-4">Zone I</th>
                      <th className="pb-2 pr-4">Zone II</th>
                      <th className="pb-2">Zone III</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeRates.map((rate) => (
                      <tr key={rate.usageType} className="border-b border-slate-100">
                        <td className="py-2 pr-4 font-medium text-slate-700">
                          {usageTypeLabels[rate.usageType]}
                        </td>
                        <td className="py-2 pr-4 text-slate-600">
                          {rate.zone1.toLocaleString('de-DE', { minimumFractionDigits: 2 })} {rate.unit}
                        </td>
                        <td className="py-2 pr-4 text-slate-600">
                          {rate.zone2.toLocaleString('de-DE', { minimumFractionDigits: 2 })} {rate.unit}
                        </td>
                        <td className="py-2 text-slate-600">
                          {rate.zone3.toLocaleString('de-DE', { minimumFractionDigits: 2 })} {rate.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                {([
                  ['Name', form.name || 'Noch kein Name'],
                  ['Datum', formatDate(form.date)],
                  ['Ort', form.location || 'Noch kein Ort'],
                  ['Teilnehmer', String(form.expectedAttendance)],
                  ['Fläche', form.venueType === 'public' ? 'Öffentlich' : 'Privat'],
                  ['Straßensperrung', form.streetClosure ? 'Ja' : 'Nein'],
                  ['Haltverbote', form.noParking ? 'Ja' : 'Nein'],
                  ['ÖPNV betroffen', form.transitImpact ? `Ja – ${form.affectedTransitLines || '(Linien angeben)'}` : 'Nein'],
                  ['Umzug', form.procession ? 'Ja' : 'Nein'],
                  ['Musik', form.music ? 'Ja' : 'Nein'],
                  ['Alkohol', form.alcohol ? 'Ja' : 'Nein'],
                  ['Stände', form.foodVendors ? 'Ja' : 'Nein'],
                  ['Fliegende Bauten', form.flyingStructures ? 'Ja' : 'Nein'],
                  ['Hohes Risiko', form.highRisk ? 'Ja' : 'Nein'],
                  ['Unterlagen', `${requiredDocs.length} Dokumente`],
                  ['Geschätzte Gebühr', feeEstimate.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })],
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
                  Generierte Anforderungen
                </p>
                <div className="mt-3 grid gap-3">
                  {previewRequirements.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4"
                    >
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {categoryLabels[item.category]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-900">Fristen</p>
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold">Standardveranstaltung:</span>{' '}
                    Anmeldung mindestens <span className="font-semibold">8 Wochen</span> vorher.
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold">Großveranstaltung:</span>{' '}
                    Anmeldung mindestens <span className="font-semibold">6 Monate</span> vorher.
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-900">Kontakt & Einreichung</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {dortmundContacts.eventRegistration.label}
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
                      {dortmundContacts.specialUse.label}
                    </p>
                    <a
                      className="mt-2 block font-medium text-brand-700 hover:underline"
                      href={`mailto:${dortmundContacts.specialUse.email}`}
                    >
                      {dortmundContacts.specialUse.email}
                    </a>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Telefon</p>
                    <p className="mt-2 font-medium text-slate-900">
                      {dortmundContacts.phones.join(' / ')}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Adresse</p>
                    <p className="mt-2 font-medium text-slate-900">
                      Ordnungsamt – {dortmundContacts.address}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">Fax: {dortmundContacts.fax}</p>
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
              Zurück
            </button>

            {step < TOTAL_STEPS ? (
              <button
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                onClick={() => setStep((current) => current + 1)}
                type="button"
              >
                Weiter
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
                Veranstaltung anlegen
              </button>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <details className="group rounded-3xl border border-white/70 bg-white/80 shadow-panel backdrop-blur">
            <summary className="flex cursor-pointer list-none items-center justify-between p-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/70">
                  Rules Engine
                </p>
                <h2 className="section-title text-xl font-semibold text-slate-900">Regelwerk</h2>
              </div>
              <span className="ml-3 shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition group-open:bg-slate-100">
                <span className="group-open:hidden">Einblenden</span>
                <span className="hidden group-open:inline">Ausblenden</span>
              </span>
            </summary>
            <div className="space-y-3 px-5 pb-5 text-sm text-slate-700">
              {[
                'Musik = ja → GEMA-Lizenz + ggf. Beschallungskonzept',
                'Alkohol = ja → Schankerlaubnis erforderlich',
                'Öffentliche Fläche = ja → Ordnungsamt-Genehmigung + Sondernutzungsantrag',
                'Straßensperrung = ja → Sperrungsantrag + Skizze',
                'Haltverbote = ja → Einrichtungsantrag + Skizze',
                'ÖPNV betroffen = ja → Abstimmung Verkehrsbetriebe',
                'Umzug = ja → Anmeldung + Streckenverlauf',
                'Teilnehmer > 500 → Sicherheitskonzept',
                'Großveranstaltung / hohes Risiko → Rettungs-, Brand- & Sanitätskonzept',
                'Fliegende Bauten = ja → Prüfbuch erforderlich',
                'Förderung = ja → Förderantrag',
                'Stände = ja → Anbieterkoordination + Teilnehmerliste',
              ].map((rule) => (
                <div
                  key={rule}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                >
                  {rule}
                </div>
              ))}
            </div>
          </details>

          {step >= 4 && (
            <Card
              title={`${requiredDocs.length} Unterlagen erforderlich`}
              eyebrow="Dokumenten-Check"
            >
              <div className="space-y-2 text-sm">
                {requiredDocs.map((doc) => (
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
                    <span className="text-slate-700">{doc.title}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
