import type { ReactNode } from 'react'

type PageHeroProps = {
  children: ReactNode
}

export function PageHero({ children }: PageHeroProps) {
  return (
    <section className="bg-ocean-800 relative overflow-hidden px-4 py-14 sm:py-18 lg:py-20">
      <div className="from-ocean-900 via-ocean-800 to-ocean-700 absolute inset-0 bg-linear-to-br" />
      <div className="absolute inset-0 opacity-10">
        <div className="bg-ocean-400 absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl text-center">{children}</div>
    </section>
  )
}
