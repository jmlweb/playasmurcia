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
