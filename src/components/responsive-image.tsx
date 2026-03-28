import { type ImgHTMLAttributes } from 'react'

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  /** Path relative to /pictures/ without extension, e.g. "arturo2_g" */
  baseName: string
  /** Original file extension for fallback src */
  ext: string
  /** Render priority — "high" for above-fold, "low" for below-fold */
  priority?: 'high' | 'low'
  /** Which variant set to use */
  variant?: 'full' | 'thumb'
}

/**
 * Renders an <img> with WebP srcset (optimized/) and original fallback.
 *
 * - "full" variant: original-size WebP from optimized/
 * - "thumb" variant: 400w thumbnail from optimized/ + original-size WebP
 *
 * Falls back to the original PNG/JPG if WebP is not generated yet.
 */
export function ResponsiveImage({
  baseName,
  ext,
  priority = 'low',
  variant = 'full',
  alt = '',
  className,
  width,
  height,
  ...rest
}: ResponsiveImageProps) {
  const originalSrc = `/pictures/${baseName}.${ext}`
  const webpFull = `/pictures/optimized/${baseName}.webp`
  const webpThumb = `/pictures/optimized/${baseName}-thumb.webp`

  const isHigh = priority === 'high'

  const imgProps = {
    src: originalSrc,
    alt,
    className,
    width,
    height,
    loading: (isHigh ? 'eager' : 'lazy') as const,
    decoding: (isHigh ? 'sync' : 'async') as const,
    fetchPriority: (isHigh ? 'high' : 'auto') as const,
    ...rest,
  }

  if (variant === 'thumb') {
    return (
      <picture style={{ display: 'contents' }}>
        <source type="image/webp" srcSet={`${webpThumb} 400w, ${webpFull} 800w`} sizes="(max-width: 640px) 100vw, 400px" />
        <img {...imgProps} />
      </picture>
    )
  }

  return (
    <picture style={{ display: 'contents' }}>
      <source type="image/webp" srcSet={webpFull} />
      <img {...imgProps} />
    </picture>
  )
}
