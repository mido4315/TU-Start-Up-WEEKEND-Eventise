import type { FeeRate, FeeZone, UsageType } from '../types/event'

export const feeRates: FeeRate[] = [
  {
    usageType: 'tables_seating',
    zone1: 0.18,
    zone2: 0.13,
    zone3: 0.08,
    unit: '€/m²/Tag',
  },
  {
    usageType: 'food_drink_stand',
    zone1: 0.72,
    zone2: 0.72,
    zone3: 0.56,
    unit: '€/m²/Tag',
  },
  {
    usageType: 'info_promo_pavilion',
    zone1: 6.95,
    zone2: 6.95,
    zone3: 5.11,
    unit: '€/m²/Tag',
  },
  {
    usageType: 'product_display',
    zone1: 1.99,
    zone2: 1.59,
    zone3: 0.92,
    unit: '€/m²/Tag',
  },
  {
    usageType: 'other',
    zone1: 30.68,
    zone2: 30.68,
    zone3: 30.68,
    unit: '€ einmalig',
  },
]

export const usageTypeLabels: Record<UsageType, string> = {
  tables_seating: 'Tische / Sitzgelegenheiten',
  food_drink_stand: 'Imbiss- / Ausschankstand',
  info_promo_pavilion: 'Informations- / Werbepavillon',
  product_display: 'Warenauslage zu Werbezwecken',
  other: 'Sonstiges (Mindestgebühr)',
}

export const feeZoneLabels: Record<FeeZone, string> = {
  zone_1: 'Zone I – Innenstadt / Fußgängerzone',
  zone_2: 'Zone II',
  zone_3: 'Zone III',
}

function getRateForZone(rate: FeeRate, zone: FeeZone): number {
  switch (zone) {
    case 'zone_1':
      return rate.zone1
    case 'zone_2':
      return rate.zone2
    case 'zone_3':
      return rate.zone3
  }
}

export function calculateFee(
  usageType: UsageType,
  zone: FeeZone,
  areaSqm: number,
  days: number,
): { rate: number; total: number; isFlat: boolean } {
  const feeRate = feeRates.find((r) => r.usageType === usageType)
  if (!feeRate) return { rate: 0, total: 0, isFlat: false }

  const rate = getRateForZone(feeRate, zone)

  if (usageType === 'other') {
    return { rate, total: rate, isFlat: true }
  }

  const total = Math.max(rate * areaSqm * days, 30.68)
  return { rate, total, isFlat: false }
}

export const dortmundContacts = {
  eventRegistration: {
    label: 'Veranstaltungsanmeldung',
    email: 'veranstaltungsanmeldung@dortmund.de',
  },
  specialUse: {
    label: 'Sondernutzung Ordnungsamt',
    email: 'sondernutzung@stadtdo.de',
  },
  phones: ['0231 50-25717', '0231 50-24043', '0231 50-22368'],
  address: 'Olpe 1, 44122 Dortmund',
  fax: '0231 50-10389',
} as const
