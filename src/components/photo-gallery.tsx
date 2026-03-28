import { useState } from "react"
import { parseImageFilename } from "@/lib/images"
import { ResponsiveImage } from "@/components/responsive-image"

interface PhotoGalleryProps {
  pictures: Array<string>
  beachName: string
}

export function PhotoGallery({ pictures, beachName }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (pictures.length === 0) {
    return (
      <div className="relative h-64 overflow-hidden rounded-2xl bg-gray-100 sm:h-80 lg:h-96">
        <img
          src="/pictures/default-beach.png"
          alt={beachName}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const activePicture = pictures[activeIndex]
  const { baseName: activeBaseName, ext: activeExt } = parseImageFilename(activePicture)

  function handlePrev() {
    setActiveIndex((prev) => (prev === 0 ? pictures.length - 1 : prev - 1))
  }

  function handleNext() {
    setActiveIndex((prev) => (prev === pictures.length - 1 ? 0 : prev + 1))
  }

  return (
    <div
      className="space-y-3"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") handlePrev()
        if (e.key === "ArrowRight") handleNext()
      }}
      tabIndex={0}
      role="region"
      aria-label="Galería de fotos"
    >
      {/* Main image */}
      <div className="relative h-64 overflow-hidden rounded-2xl bg-gray-100 shadow-sm sm:h-80 lg:h-[480px]">
        <ResponsiveImage
          baseName={activeBaseName}
          ext={activeExt}
          variant="full"
          priority="high"
          alt={`${beachName} - foto ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        {pictures.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:ring-2 focus:ring-white focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:ring-2 focus:ring-white focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
            className="flex gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Miniaturas de fotos"
          >
          {pictures.map((picture, index) => {
            const { baseName, ext } = parseImageFilename(picture)
            return (
              <button
                key={picture}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Ver foto ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all focus:ring-2 focus:ring-ocean-500 focus:outline-none ${
                  index === activeIndex
                    ? "border-ocean-500"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <ResponsiveImage
                  baseName={baseName}
                  ext={ext}
                  variant="thumb"
                  alt={`${beachName} - miniatura ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            )
          })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-white to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-white to-transparent" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
