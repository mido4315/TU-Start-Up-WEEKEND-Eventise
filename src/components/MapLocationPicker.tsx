import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

interface MockLocation {
  id: string
  name: string
  detail: string
  position: [number, number]
}

interface MapLocationPickerProps {
  closeLabel: string
  hideLocationList?: boolean
  locations: MockLocation[]
  onClose: () => void
  onSelect: (location: string) => void
  selectLabel: string
  selectedLocation: string
  subtitle: string
  title: string
}

const markerIcon = new L.Icon({
  iconAnchor: [12, 41],
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export function MapLocationPicker({
  closeLabel,
  hideLocationList = false,
  locations,
  onClose,
  onSelect,
  selectLabel,
  selectedLocation,
  subtitle,
  title,
}: MapLocationPickerProps) {
  const center: [number, number] = [51.5136, 7.4653]

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

        <div className={`grid gap-4 ${hideLocationList ? '' : 'lg:grid-cols-[1.2fr,0.8fr]'}`}>
          <div className="min-h-[360px] overflow-hidden rounded-2xl border border-slate-200">
            <MapContainer
              center={center}
              className="h-[360px] w-full"
              scrollWheelZoom
              zoom={13}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locations.map((location) => (
                <Marker
                  icon={markerIcon}
                  key={location.id}
                  position={location.position}
                >
                  <Popup>
                    <button
                      className="font-semibold text-brand-700"
                      onClick={() => onSelect(location.name)}
                      type="button"
                    >
                      {selectLabel} {location.name}
                    </button>
                    <p className="mt-1 text-sm text-slate-600">{location.detail}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {!hideLocationList && (
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
          )}
        </div>
      </div>
    </div>
  )
}
