interface MockLocation {
  id: string
  name: string
  detail: string
  x: string
  y: string
}

interface MapLocationPickerProps {
  closeLabel: string
  locations: MockLocation[]
  onClose: () => void
  onSelect: (location: string) => void
  selectLabel: string
  selectedLocation: string
  subtitle: string
  title: string
}

export function MapLocationPicker({
  closeLabel,
  locations,
  onClose,
  onSelect,
  selectLabel,
  selectedLocation,
  subtitle,
  title,
}: MapLocationPickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="section-title text-2xl font-semibold text-slate-950">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          </div>
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            {closeLabel}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-[#dfe9d7]">
            <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 bg-[#bfd3b5]" />
            <div className="absolute left-1/3 top-0 h-full w-12 -translate-x-1/2 bg-[#f3dfb7]" />
            <div className="absolute bottom-8 left-8 h-24 w-32 rounded-full bg-[#9fc7c0]" />
            <div className="absolute right-10 top-8 h-28 w-28 rounded-xl bg-[#c9d8ef]" />
            <div className="absolute bottom-10 right-12 h-20 w-40 rounded-xl bg-[#bdd7a8]" />

            {locations.map((location) => {
              const isSelected = selectedLocation === location.name

              return (
                <button
                  aria-label={`${selectLabel} ${location.name}`}
                  className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 text-sm font-black shadow-lg transition hover:scale-105 ${
                    isSelected
                      ? 'border-slate-950 bg-brand-500 text-white'
                      : 'border-white bg-slate-950 text-white'
                  }`}
                  key={location.id}
                  onClick={() => onSelect(location.name)}
                  style={{ left: location.x, top: location.y }}
                  type="button"
                >
                  {location.id}
                </button>
              )
            })}
          </div>

          <div className="grid gap-2">
            {locations.map((location) => {
              const isSelected = selectedLocation === location.name

              return (
                <button
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-brand-300 hover:bg-brand-50'
                  }`}
                  key={location.id}
                  onClick={() => onSelect(location.name)}
                  type="button"
                >
                  <p className="font-semibold">{location.name}</p>
                  <p className={`mt-1 text-sm ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                    {location.detail}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
