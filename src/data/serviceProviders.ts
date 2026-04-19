export type ServiceBadge = 'top' | 'beliebt' | 'neu' | 'empfohlen'

export interface ServiceProvider {
  id: string
  name: string
  tagline: string
  rating: number
  reviewCount: number
  priceFrom: string
  badge?: ServiceBadge
  highlights: string[]
}

export interface ServiceCategory {
  key: 'insurance' | 'logistics' | 'security' | 'sanitary' | 'catering'
  label: string
  icon: string
  description: string
  providers: ServiceProvider[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    key: 'insurance',
    label: 'Versicherung',
    icon: '🛡️',
    description: 'Veranstalterhaftpflicht, Ausfall- und Wetterversicherung.',
    providers: [
      {
        id: 'ins-eventprotect',
        name: 'EventProtect Deutschland',
        tagline: 'Rundum-Schutz für Veranstaltungen jeder Größe.',
        rating: 4.8,
        reviewCount: 1240,
        priceFrom: 'ab 149 €',
        badge: 'top',
        highlights: ['Haftpflicht bis 5 Mio. €', 'Ausfallversicherung', 'Online-Abschluss'],
      },
      {
        id: 'ins-allianz',
        name: 'Allianz Veranstaltungsschutz',
        tagline: 'Deutschlands bekannteste Versicherung für Events.',
        rating: 4.6,
        reviewCount: 3870,
        priceFrom: 'ab 189 €',
        badge: 'beliebt',
        highlights: ['24h-Hotline', 'Wetterschutz optional', 'Schnelle Schadensregulierung'],
      },
      {
        id: 'ins-hdi',
        name: 'HDI Eventversicherung',
        tagline: 'Maßgeschneiderter Schutz für Veranstalter.',
        rating: 4.4,
        reviewCount: 892,
        priceFrom: 'ab 129 €',
        highlights: ['Individuelle Pakete', 'Jubiläen & Firmenfeiern', 'Beratung inklusive'],
      },
      {
        id: 'ins-axa',
        name: 'AXA Events',
        tagline: 'International erprobt – lokal verfügbar.',
        rating: 4.3,
        reviewCount: 654,
        priceFrom: 'ab 159 €',
        badge: 'neu',
        highlights: ['EU-weite Deckung', 'Digitale Police', 'Kombipakete'],
      },
    ],
  },
  {
    key: 'logistics',
    label: 'Logistik',
    icon: '🚛',
    description: 'Auf- und Abbau, Materiallieferung, Bühnentechnik und Equipment-Transport.',
    providers: [
      {
        id: 'log-prolovent',
        name: 'ProLogEvent GmbH',
        tagline: 'Alles aus einer Hand – von der Planung bis zum Abbau.',
        rating: 4.9,
        reviewCount: 420,
        priceFrom: 'auf Anfrage',
        badge: 'top',
        highlights: ['Lager in Dortmund', 'Eigene LKW-Flotte', 'Montage-Team vor Ort'],
      },
      {
        id: 'log-setup',
        name: 'SetUp & Go Eventlogistik',
        tagline: 'Schnell. Zuverlässig. Termingerecht.',
        rating: 4.6,
        reviewCount: 318,
        priceFrom: 'ab 890 €',
        badge: 'beliebt',
        highlights: ['Same-Day-Delivery', 'Zelt & Möbel-Verleih', 'Aufbauteam inklusive'],
      },
      {
        id: 'log-ruhr',
        name: 'EventMover Ruhr',
        tagline: 'Regionale Stärke für Events im Ruhrgebiet.',
        rating: 4.4,
        reviewCount: 185,
        priceFrom: 'ab 650 €',
        highlights: ['Kurzfristig buchbar', 'Regionale Routen', 'Stapler & Hebebühnen'],
      },
      {
        id: 'log-quickbuild',
        name: 'QuickBuild Events',
        tagline: 'Modulare Aufbau-Lösungen für jeden Anlass.',
        rating: 4.2,
        reviewCount: 97,
        priceFrom: 'ab 490 €',
        badge: 'neu',
        highlights: ['Modulare Systeme', 'Kleine Budgets', 'Flexible Zeiten'],
      },
    ],
  },
  {
    key: 'security',
    label: 'Security',
    icon: '🔐',
    description: 'Ordnerdienst, Einlasskontrolle, Personenschutz und Objektsicherung.',
    providers: [
      {
        id: 'sec-secureevent',
        name: 'SecureEvent GmbH',
        tagline: 'Geprüfte Sicherheitskräfte – IHK-zertifiziert.',
        rating: 4.8,
        reviewCount: 731,
        priceFrom: 'ab 22 €/h pro Kraft',
        badge: 'top',
        highlights: ['§34a zertifiziert', 'Einsatzleiter inklusive', 'Notfallkonzept'],
      },
      {
        id: 'sec-eagle',
        name: 'Eagle Security Services',
        tagline: 'Erfahrener Partner für Großveranstaltungen.',
        rating: 4.6,
        reviewCount: 509,
        priceFrom: 'ab 24 €/h pro Kraft',
        badge: 'empfohlen',
        highlights: ['Erfahrung mit 5.000+ Pers.', 'Leitstelle 24/7', 'Funksystem inkl.'],
      },
      {
        id: 'sec-ruhr',
        name: 'Rhein-Ruhr Security',
        tagline: 'Regional verwurzelt und schnell verfügbar.',
        rating: 4.4,
        reviewCount: 274,
        priceFrom: 'ab 20 €/h pro Kraft',
        highlights: ['Kurzfristig buchbar', 'Detektive & Ordner', 'Parkplatzmanagement'],
      },
      {
        id: 'sec-proguard',
        name: 'ProGuard Event Security',
        tagline: 'Diskreter Schutz für exklusive Veranstaltungen.',
        rating: 4.3,
        reviewCount: 142,
        priceFrom: 'ab 26 €/h pro Kraft',
        highlights: ['VIP-Begleitung', 'Zivilkräfte verfügbar', 'Dresscode-konform'],
      },
    ],
  },
  {
    key: 'sanitary',
    label: 'Sanitätsdienst',
    icon: '🚑',
    description: 'Medizinische Absicherung, Erstversorgung und Sanitätspersonal.',
    providers: [
      {
        id: 'san-malteser',
        name: 'Malteser Hilfsdienst',
        tagline: 'Erfahrener Sanitätsdienst mit langer Tradition.',
        rating: 4.9,
        reviewCount: 2150,
        priceFrom: 'nach Konzept',
        badge: 'top',
        highlights: ['Sanitätspersonal & Notarzt', 'Sanitätswachen', 'Großveranstaltungserfahrung'],
      },
      {
        id: 'san-johanniter',
        name: 'Johanniter Unfallhilfe',
        tagline: 'Professionelle Erstversorgung für Ihr Event.',
        rating: 4.8,
        reviewCount: 1890,
        priceFrom: 'nach Konzept',
        badge: 'beliebt',
        highlights: ['Landesweit verfügbar', 'Rettungsfahrzeuge', 'Sanitätskonzept-Erstellung'],
      },
      {
        id: 'san-drk',
        name: 'DRK Sanitätsdienst',
        tagline: 'Das Rote Kreuz – zuverlässig bei jedem Event.',
        rating: 4.8,
        reviewCount: 3100,
        priceFrom: 'nach Konzept',
        badge: 'empfohlen',
        highlights: ['Blutspende-Kooperation', 'Bundesweit', 'Notarzt auf Anfrage'],
      },
      {
        id: 'san-firstmed',
        name: 'FirstMed Event GmbH',
        tagline: 'Privater Sanitätsdienst mit hohem Standard.',
        rating: 4.5,
        reviewCount: 312,
        priceFrom: 'ab 390 €',
        highlights: ['Schnelle Verfügbarkeit', 'Individuelle Pakete', 'Defibrillator inkl.'],
      },
    ],
  },
  {
    key: 'catering',
    label: 'Gastronomie',
    icon: '🍽️',
    description: 'Catering, Food Trucks, Getränkeversorgung und Servicepersonal.',
    providers: [
      {
        id: 'cat-eventküche',
        name: 'EventKüche Dortmund',
        tagline: 'Frische Küche direkt auf Ihr Veranstaltungsgelände.',
        rating: 4.8,
        reviewCount: 548,
        priceFrom: 'ab 18 €/Person',
        badge: 'top',
        highlights: ['Regionale Zutaten', 'Vollservice & Abbau', 'Allergene dokumentiert'],
      },
      {
        id: 'cat-foodfest',
        name: 'FoodFest Catering GmbH',
        tagline: 'Food-Truck-Vielfalt trifft professionellen Service.',
        rating: 4.6,
        reviewCount: 381,
        priceFrom: 'ab 12 €/Person',
        badge: 'beliebt',
        highlights: ['4 Food Trucks', 'Vegan & Halal Option', 'Getränkepakete'],
      },
      {
        id: 'cat-genuss',
        name: 'Genuss & Events',
        tagline: 'Gehobenes Catering für besondere Anlässe.',
        rating: 4.7,
        reviewCount: 219,
        priceFrom: 'ab 35 €/Person',
        badge: 'empfohlen',
        highlights: ['Fine Dining möglich', 'Eigenes Serviceteam', 'Bar & Cocktails'],
      },
      {
        id: 'cat-ruhr',
        name: 'Ruhr Catering Service',
        tagline: 'Unkompliziert und erschwinglich für jedes Budget.',
        rating: 4.3,
        reviewCount: 163,
        priceFrom: 'ab 8 €/Person',
        highlights: ['Günstigste Option', 'Kurzfristig buchbar', 'Grill & Buffet'],
      },
    ],
  },
]
