import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import type { EventFormValues } from '../types/event'
import { categoryLabels } from '../utils/constants'
import { formatBooleanValue, formatDate } from '../utils/format'
import { generateRequirements } from '../utils/rulesEngine'
import { useEventStore } from '../store/useEventStore'

const initialForm: EventFormValues = {
  name: '',
  date: '2026-08-22T12:00:00.000Z',
  location: '',
  expectedAttendance: 250,
  publicSpace: false,
  music: false,
  alcohol: false,
  foodVendors: false,
  fundingNeeded: false,
}

export function EventWizardPage() {
  const navigate = useNavigate()
  const createEvent = useEventStore((state) => state.createEvent)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<EventFormValues>(initialForm)

  const previewRequirements = generateRequirements({
    ...form,
    id: 'preview-event',
  })

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="New event"
        title="Create an event and generate its operational checklist"
        description="Capture the basics, flag risk factors, and preview the requirements Eventise will create for organizers."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card title={`Step ${step} of 3`} eyebrow="Wizard">
          <div className="mb-6 flex gap-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`h-2 flex-1 rounded-full ${
                  item <= step ? 'bg-slate-950' : 'bg-brand-100'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="grid gap-4">
              <label className="text-sm font-medium text-slate-700">
                Event name
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Neighborhood Lantern Walk"
                  required
                  value={form.name}
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Date
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        date: new Date(event.target.value).toISOString(),
                      }))
                    }
                    type="datetime-local"
                    value={form.date.slice(0, 16)}
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Expected attendance
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
                    min={1}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        expectedAttendance: Number(event.target.value),
                      }))
                    }
                    type="number"
                    value={form.expectedAttendance}
                  />
                </label>
              </div>

              <label className="text-sm font-medium text-slate-700">
                Location
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, location: event.target.value }))
                  }
                  placeholder="Main square, community hall, or neighborhood park"
                  required
                  value={form.location}
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 md:grid-cols-2">
              {[
                {
                  key: 'publicSpace',
                  label: 'Uses public space',
                  description: 'Triggers municipal approval requirements.',
                },
                {
                  key: 'music',
                  label: 'Includes music',
                  description: 'May require GEMA licensing.',
                },
                {
                  key: 'alcohol',
                  label: 'Includes alcohol',
                  description: 'Adds permit and vendor compliance work.',
                },
                {
                  key: 'foodVendors',
                  label: 'Includes food vendors',
                  description: 'Adds vendor coordination and logistics.',
                },
                {
                  key: 'fundingNeeded',
                  label: 'Needs funding',
                  description: 'Adds grant or sponsor application tracking.',
                },
              ].map((toggle) => (
                <button
                  key={toggle.key}
                  className={`rounded-3xl border p-5 text-left transition ${
                    form[toggle.key as keyof EventFormValues]
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-brand-300 hover:bg-brand-50'
                  }`}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      [toggle.key]: !current[toggle.key as keyof EventFormValues],
                    }))
                  }
                  type="button"
                >
                  <p className="font-semibold">{toggle.label}</p>
                  <p
                    className={`mt-2 text-sm ${
                      form[toggle.key as keyof EventFormValues]
                        ? 'text-slate-200'
                        : 'text-slate-600'
                    }`}
                  >
                    {toggle.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['Name', form.name || 'Untitled event'],
                  ['Date', formatDate(form.date)],
                  ['Location', form.location || 'No location yet'],
                  ['Attendance', String(form.expectedAttendance)],
                  ['Public space', formatBooleanValue(form.publicSpace)],
                  ['Music', formatBooleanValue(form.music)],
                  ['Alcohol', formatBooleanValue(form.alcohol)],
                  ['Food vendors', formatBooleanValue(form.foodVendors)],
                  ['Funding needed', formatBooleanValue(form.fundingNeeded)],
                ].map(([label, value]) => (
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
                  Requirement preview
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
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <button
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={step === 1}
              onClick={() => setStep((current) => current - 1)}
              type="button"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                onClick={() => setStep((current) => current + 1)}
                type="button"
              >
                Continue
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
                Create event workspace
              </button>
            )}
          </div>
        </Card>

        <Card title="Generated planning logic" eyebrow="Rules engine">
          <div className="space-y-3 text-sm text-slate-700">
            {[
              'music = true → GEMA license required',
              'alcohol = true → alcohol permit required',
              'public space = true → city or Ordnungsamt approval required',
              'attendance > 500 → security planning required',
              'funding needed = true → funding application required',
              'food vendors = true → vendor coordination required',
            ].map((rule) => (
              <div
                key={rule}
                className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
              >
                {rule}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
