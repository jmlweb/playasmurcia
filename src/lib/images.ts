export function parseImageFilename(filename: string): {
  baseName: string
  ext: string
} {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1) return { baseName: filename, ext: 'png' }
  return {
    baseName: filename.substring(0, lastDot),
    ext: filename.substring(lastDot + 1),
  }
}

const LOCAL_PICTURES_BASE = '/pictures'

/**
 * Builds a picture URL. Production serves pictures from the R2 bucket domain set in
 * `VITE_PICTURES_BASE_URL`; local dev falls back to `public/pictures/` served by Vite.
 */
export function pictureUrl(
  path: string,
  baseUrl: string | undefined = import.meta.env.VITE_PICTURES_BASE_URL,
): string {
  const base = (baseUrl || LOCAL_PICTURES_BASE).replace(/\/+$/, '')
  return `${base}/${path.replace(/^\/+/, '')}`
}
