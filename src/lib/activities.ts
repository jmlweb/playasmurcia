import type { Activity } from '@/types/beach'

/**
 * Activities stored on nearly every beach (Natación 193, Kayak 193, Snorkel 189,
 * Pesca 167 of 193). They say nothing about a given beach, so beach pages and
 * the explorer filter leave them out. The stored data stays: the "Para hacer
 * snorkel" collection still reads the snorkeling activity. See
 * docs/business-rules.md, "Activities".
 */
const UnlistedActivityIds: ReadonlySet<string> = new Set([
  'swimming',
  'kayak',
  'snorkeling',
  'fishing',
])

export const isListedActivity = (activity: Activity): boolean =>
  !UnlistedActivityIds.has(activity.id)

/** The beach's activity indices worth showing, in their stored order. */
export const listedActivityIndices = (
  activityIndices: readonly number[],
  allActivities: readonly Activity[],
): number[] =>
  activityIndices.filter((index) => {
    const activity = allActivities[index]
    return activity !== undefined && isListedActivity(activity)
  })
