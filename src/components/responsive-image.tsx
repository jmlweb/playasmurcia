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
 * Renders beach photos. When `public/pictures/optimized/*.webp` exists (see `pnpm optimize:images`),
 * uses <picture> with AVIF → WebP → original fallback. Otherwise uses only the original raster so
 * missing optimized files cannot hide the image (some browsers do not fall back from a failed <source>).
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
  const opt = `/pictures/optimized/${baseName}`
  const useOptimized = import.meta.env.PLAYASMURCIA_OPTIMIZED_IMAGES === 'true'

  const isHigh = priority === 'high'

  const imgProps: ImgHTMLAttributes<HTMLImageElement> = {
    ...rest,
    src: originalSrc,
    alt,
    className,
    width,
    height,
    loading: isHigh ? 'eager' : 'lazy',
    decoding: isHigh ? 'sync' : 'async',
    fetchPriority: isHigh ? 'high' : 'auto',
  }

  if (!useOptimized) {
    return <img {...imgProps} />
  }

  if (variant === 'thumb') {
    return (
      <picture style={{ display: 'contents' }}>
        <source
          sizes="(max-width: 640px) 100vw, 400px"
          srcSet={`${opt}-thumb.avif 400w, ${opt}-full.avif 1200w, ${opt}.avif 1600w`}
          type="image/avif"
        />
        <source
          sizes="(max-width: 640px) 100vw, 400px"
          srcSet={`${opt}-thumb.webp 400w, ${opt}-full.webp 1200w, ${opt}.webp 1600w`}
          type="image/webp"
        />
        <img {...imgProps} />
      </picture>
    )
  }

  return (
    <picture style={{ display: 'contents' }}>
      <source
        srcSet={`${opt}-full.avif 1200w, ${opt}.avif 1600w`}
        type="image/avif"
      />
      <source
        srcSet={`${opt}-full.webp 1200w, ${opt}.webp 1600w`}
        type="image/webp"
      />
      <img {...imgProps} />
    </picture>
  )
}
