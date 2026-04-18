import { useState } from 'react'
import type { AddDocumentInput, Requirement } from '../types/event'

interface AddDocumentFormProps {
  requirements: Requirement[]
  onSubmit: (input: AddDocumentInput) => void
}

const initialState: AddDocumentInput = {
  title: '',
  type: 'Operations',
  status: 'pending',
  notes: '',
  linkedRequirementIds: [],
}

export function AddDocumentForm({
  requirements,
  onSubmit,
}: AddDocumentFormProps) {
  const [form, setForm] = useState<AddDocumentInput>(initialState)

  return (
    <form
      className="space-y-4 rounded-3xl border border-brand-100 bg-brand-50/70 p-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(form)
        setForm(initialState)
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Document title
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Site plan"
            required
            value={form.title}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Type
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
            onChange={(event) =>
              setForm((current) => ({ ...current, type: event.target.value }))
            }
            placeholder="Compliance"
            required
            value={form.type}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr,2fr]">
        <label className="text-sm font-medium text-slate-700">
          Status
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value as AddDocumentInput['status'],
              }))
            }
            value={form.status}
          >
            <option value="pending">pending</option>
            <option value="uploaded">uploaded</option>
            <option value="missing">missing</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Notes
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
            placeholder="What is included, who owns it, and what is still missing?"
            value={form.notes}
          />
        </label>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700">Link to requirements</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {requirements.map((requirement) => {
            const checked = form.linkedRequirementIds.includes(requirement.id)

            return (
              <label
                key={requirement.id}
                className="flex items-start gap-3 rounded-2xl border border-white bg-white/80 p-3 text-sm text-slate-700"
              >
                <input
                  checked={checked}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      linkedRequirementIds: event.target.checked
                        ? [...current.linkedRequirementIds, requirement.id]
                        : current.linkedRequirementIds.filter(
                            (item) => item !== requirement.id,
                          ),
                    }))
                  }
                  type="checkbox"
                />
                <span>{requirement.title}</span>
              </label>
            )
          })}
        </div>
      </div>

      <button
        className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        type="submit"
      >
        Add document
      </button>
    </form>
  )
}
