import { useState } from 'react'

import { ResponsiveImage } from '@/components/responsive-image'
import { parseImageFilename } from '@/lib/images'

type PhotoGalleryProps = {
  pictures: string[]
  beachName: string
}

export function PhotoGallery({ pictures, beachName }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (pictures.length === 0) {
    return (
      <div className="relative h-64 overflow-hidden rounded-2xl bg-gray-100 sm:h-80 lg:h-96">
        <img
          alt={beachName}
          className="h-full w-full object-cover"
          src="/pictures/default-beach.png"
        />
      </div>
    )
  }

  const activePicture = pictures[activeIndex]
  const { baseName: activeBaseName, ext: activeExt } =
    parseImageFilename(activePicture)

  function handlePrev() {
    setActiveIndex((prev) => (prev === 0 ? pictures.length - 1 : prev - 1))
  }

  function handleNext() {
    setActiveIndex((prev) => (prev === pictures.length - 1 ? 0 : prev + 1))
  }

  return (
    <div
      aria-label="Galería de fotos"
      className="space-y-3"
      role="region"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') handlePrev()
        if (e.key === 'ArrowRight') handleNext()
      }}
    >
      {/* Main image */}
      <div className="relative h-64 overflow-hidden rounded-2xl bg-gray-100 shadow-sm sm:h-80 lg:h-[480px]">
        <ResponsiveImage
          alt={`${beachName} - foto ${activeIndex + 1}`}
          baseName={activeBaseName}
          className="h-full w-full object-cover transition-opacity duration-300"
          ext={activeExt}
          priority="high"
          variant="full"
        />
        {pictures.length > 1 && (
          <>
            <button
              aria-label="Foto anterior"
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:ring-2 focus:ring-white focus:outline-none"
              type="button"
              onClick={handlePrev}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
            <button
              aria-label="Foto siguiente"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:ring-2 focus:ring-white focus:outline-none"
              type="button"
              onClick={handleNext}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {activeIndex + 1} / {pictures.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {pictures.length > 1 && (
        <div className="relative">
          <div
            aria-label="Miniaturas de fotos"
            className="flex gap-2 overflow-x-auto pb-1"
            role="tablist"
          >
            {pictures.map((picture, index) => {
              const { baseName, ext } = parseImageFilename(picture)
              return (
                <button
                  key={picture}
                  aria-label={`Ver foto ${index + 1}`}
                  aria-selected={index === activeIndex}
                  className={`focus:ring-ocean-500 h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all focus:ring-2 focus:outline-none ${
                    index === activeIndex
                      ? 'border-ocean-500'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  role="tab"
                  type="button"
                  onClick={() => {
                    setActiveIndex(index)
                  }}
                >
                  <ResponsiveImage
                    alt={`${beachName} - miniatura ${index + 1}`}
                    baseName={baseName}
                    className="h-full w-full object-cover"
                    ext={ext}
                    variant="thumb"
                  />
                </button>
              )
            })}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-white/80 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-linear-to-l from-white/80 to-transparent"
          />
        </div>
      )}
    </div>
  )
}
