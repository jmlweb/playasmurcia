import { Link } from '@tanstack/react-router'

import type { Beach, Municipality } from '@/types/beach'

import { ResponsiveImage } from '@/components/ui/responsive-image'
import { parseImageFilename } from '@/lib/images'

type FeaturedBeachCardProps = {
  beach: Beach
  municipality: Municipality
  slug: string
}

export function FeaturedBeachCard({
  beach,
  municipality,
  slug,
}: FeaturedBeachCardProps) {
  const { baseName, ext } = parseImageFilename(
    beach.pictures?.[0] ?? 'default-beach.png',
  )

  return (
    <Link
      className="group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl bg-ocean-900 shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1 sm:col-span-2 lg:row-span-2 lg:min-h-0"
      params={{ slug }}
      to="/playas/$slug"
    >
      <ResponsiveImage
        alt={beach.name}
        baseName={baseName}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        ext={ext}
        priority="high"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
      <div className="relative p-6 sm:p-8">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-coral-300 uppercase">
          Imprescindible
        </p>
        <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px] sm:leading-9">
          {beach.name}
        </h3>
        <p className="mt-1 text-sm text-white/90">{municipality.name}</p>
      </div>
    </Link>
  )
}
