import type { RefObject } from 'react'

import { Link } from '@tanstack/react-router'

import { pictureUrl } from '@/lib/images'

export function HighlightsSection({
  ref,
}: {
  ref: RefObject<HTMLElement | null>
}) {
  return (
    <section
      ref={ref}
      className="reveal relative overflow-hidden bg-ocean-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32"
    >
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        loading="lazy"
        src={pictureUrl('PLAYAS_1_675_4_g.jpg')}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/60 to-ocean-900/90" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold tracking-wider text-ocean-300 uppercase">
            Costa Cálida
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Lo que hace única a nuestra costa
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Link
            className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/10"
            to="/colecciones"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean-500/20 text-ocean-300">
              <svg
                aria-hidden="true"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Dos mares</h3>
            <p className="text-sm leading-relaxed text-ocean-200">
              El Mediterráneo y el Mar Menor ofrecen experiencias de playa
              completamente diferentes en pocos kilómetros.
            </p>
          </Link>
          <Link
            className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/10"
            params={{ slug: 'mejores-atardeceres' }}
            to="/colecciones/$slug"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-500/20 text-coral-400">
              <svg
                aria-hidden="true"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              300 días de sol
            </h3>
            <p className="text-sm leading-relaxed text-ocean-200">
              Con una de las mejores climatologías de Europa, la Costa Cálida
              hace honor a su nombre durante todo el año.
            </p>
          </Link>
          <Link
            className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/10"
            params={{ slug: 'bandera-azul' }}
            to="/colecciones/$slug"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean-500/20 text-ocean-300">
              <svg
                aria-hidden="true"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Aguas cristalinas
            </h3>
            <p className="text-sm leading-relaxed text-ocean-200">
              Reservas marinas, calas protegidas y banderas azules que
              certifican la calidad de nuestro litoral.
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}
