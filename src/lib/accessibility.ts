// FAMDIF field sheets published by ITREM, one per beach and season; see docs/data-schema.md.
import accessibility from '../../data/accessibility.json'

export type AssistedBathing = 'staff' | 'loan' | 'none'

export type AccessibilitySheet = {
  year: number
  /** FAMDIF category as written on the sheet, lower-cased */
  category: string
  /** staff = someone bathes the visitor; loan = chair lent, a companion bathes */
  assistedBathing?: AssistedBathing
  amphibiousChairs?: number
  amphibiousCrutches?: number
  walkway?: boolean
  adaptedToilets?: boolean
  adaptedChangingRooms?: boolean
  adaptedShade?: boolean
  /** In-sea platform with handrails and seats */
  adaptedBathingZone?: boolean
  season?: string
  hours?: string
  bookingNote?: string
  sourceUrl: string
  imagesUrl?: string
}

// The JSON widens the union fields to string, so the cast pins the sheet type
const sheets = accessibility.values as Record<string, AccessibilitySheet>

export const accessibilitySource = {
  label: accessibility.source,
  fetchedOn: accessibility.fetchedOn,
}

export const getAccessibilitySheet = (
  code: string,
): AccessibilitySheet | undefined => sheets[code]
