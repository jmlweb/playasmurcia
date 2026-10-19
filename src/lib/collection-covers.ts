import type { Beach } from '@/types/beach'

// Best-rated photo of the most recommended beach, so each card shows a real
// place instead of an empty colour band. `usedCodes` keeps covers distinct,
// since popular beaches belong to several collections.
export function pickCoverPicture(
  beaches: Beach[],
  usedCodes: Set<string>,
): string | undefined {
  const cover = beaches
    .filter((b) => b.pictures?.length && !usedCodes.has(b.code))
    .sort(
      (a, b) =>
        (b.pictureQualityScore ?? 0) - (a.pictureQualityScore ?? 0) ||
        b.recommendationScore - a.recommendationScore,
    )[0]
  if (!cover) return undefined
  usedCodes.add(cover.code)
  return cover.pictures?.[0]
}
