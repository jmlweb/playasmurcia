import { useState } from "react"

interface PhotoGalleryProps {
  pictures: Array<string>
  beachName: string
}

export function PhotoGallery({ pictures, beachName }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (pictures.length === 0) {
    return (
      <div className="relative h-64 overflow-hidden rounded-xl bg-gray-100 sm:h-80 lg:h-96">
        <img
          src="/pictures/default-beach.svg"
          alt={beachName}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const activePicture = pictures[activeIndex]

  function handlePrev() {
    setActiveIndex((prev) => (prev === 0 ? pictures.length - 1 : prev - 1))
  }

  function handleNext() {
    setActiveIndex((prev) => (prev === pictures.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative h-64 overflow-hidden rounded-xl bg-gray-100 sm:h-80 lg:h-[480px]">
        <img
          src={`/pictures/${activePicture}`}
          alt={`${beachName} - foto ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
          loading="lazy"
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
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Miniaturas de fotos"
        >
          {pictures.map((picture, index) => (
            <button
              key={picture}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Ver foto ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                index === activeIndex
                  ? "border-blue-600"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={`/pictures/${picture}`}
                alt={`${beachName} - miniatura ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
