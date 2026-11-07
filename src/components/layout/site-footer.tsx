import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import { darkFocusRing } from '@/components/layout/focus-ring'
import { ChevronDownIcon, WaveMarkIcon } from '@/components/ui/icons'
import { summarizeCoast } from '@/lib/coast-summary'

type FooterMunicipality = {
  name: string
  slug: string
  beachCount: number
}

type FooterCharacteristic = {
  label: string
  href: string
  count: number
}

type SiteFooterProps = {
  municipalities: FooterMunicipality[]
  characteristics: FooterCharacteristic[]
}

type SourceLink = {
  label: string
  // Shown only where the column fits it on one line
  detail?: string
  href: string
}

const SOURCES: readonly { fact: string; links: readonly SourceLink[] }[] = [
  {
    fact: 'Banderas del día',
    links: [
      { label: '112 Región de Murcia', href: 'https://www.112rmurcia.es/' },
    ],
  },
  {
    fact: 'Socorristas',
    links: [{ label: '112 (COPLA)', href: 'https://www.112rmurcia.es/' }],
  },
  {
    fact: 'Bandera Azul',
    links: [{ label: 'ADEAC/FEE', href: 'https://www.banderaazul.org/' }],
  },
  {
    fact: 'Calidad del agua',
    links: [
      {
        label: 'NÁYADE',
        detail: ' (Ministerio de Sanidad)',
        href: 'https://nayadeciudadano.sanidad.gob.es/',
      },
      {
        label: 'EEA',
        href: 'https://www.eea.europa.eu/en/topics/in-depth/bathing-water',
      },
    ],
  },
  {
    fact: 'Previsión',
    links: [
      { label: 'AEMET', href: 'https://www.aemet.es/' },
      { label: 'Open-Meteo', href: 'https://open-meteo.com/' },
    ],
  },
  {
    fact: 'Guía de playas',
    // Every guia-playas path on miteco.gob.es lands on its 404 page
    links: [
      {
        label: 'MITECO',
        href: 'https://www.miteco.gob.es/es/costas/temas.html',
      },
    ],
  },
]

// Shared so Fuentes lines up with the link columns above it
const columnsClass =
  'grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(15.5rem,1fr)_minmax(14rem,1fr)] lg:gap-x-8'

const eyebrowClass =
  'text-xs font-semibold tracking-[0.2em] text-coral-300 uppercase'

// Keeps a focused link clear of the sticky bar (61-73px)
const linkBaseClass = `scroll-mt-20 transition-colors hover:text-white ${darkFocusRing}`

const rowClass = `group flex min-h-11 items-center justify-between gap-2 text-sm text-ocean-200 aria-[current=page]:font-semibold aria-[current=page]:text-white sm:min-h-0 sm:py-1 ${linkBaseClass}`

const indexRowClass = `${rowClass} underline decoration-ocean-400 underline-offset-2`

function CountPill({ count }: { count: number }) {
  return (
    <span className="shrink-0 rounded-full bg-ocean-700/60 px-2 py-0.5 text-xs font-medium text-ocean-200 tabular-nums transition-colors group-hover:text-white group-aria-[current=page]:text-white">
      {count}
    </span>
  )
}

// An aria-label, not sr-only spans: browsers add a space around out-of-flow
// text, which would read "Cartagena , 69 playas"
const countedName = (name: string, count: number) =>
  `${name}, ${count} ${count === 1 ? 'playa' : 'playas'}`

function IndexRow({ children }: { children: ReactNode }) {
  return <li className="mt-1">{children}</li>
}

function FooterLinkGroup({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <nav aria-labelledby={id}>
      {/* A `<p>` is not valid inside `<summary>`, and the summary is hidden from `sm` up */}
      <p className={`footer-group-label mb-3 ${eyebrowClass}`} id={id}>
        {label}
      </p>
      <details
        className="footer-disclosure group/disclosure border-b border-ocean-800 sm:border-b-0"
        name="footer-links"
      >
        <summary
          className={`flex min-h-11 scroll-mt-20 list-none items-center justify-between gap-3 hover:cursor-pointer [&::-webkit-details-marker]:hidden ${eyebrowClass} ${darkFocusRing}`}
        >
          {label}
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-ocean-200 group-open/disclosure:rotate-180 motion-safe:transition-transform" />
        </summary>
        <ul className="pb-2 sm:pb-0">{children}</ul>
      </details>
    </nav>
  )
}

export function SiteFooter({
  municipalities,
  characteristics,
}: SiteFooterProps) {
  // Not at module scope: Workers freeze the clock at 0 (1970) during global init
  // oxlint-disable-next-line react/purity
  const currentYear = new Date().getFullYear()
  const { beachCount, municipalityCount } = summarizeCoast(municipalities)

  return (
    <footer className="bg-ocean-900 text-ocean-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <div className={`${columnsClass} sm:gap-y-10`}>
          <div className="pb-2 sm:col-span-2 sm:pb-0 lg:col-span-1">
            <Link
              activeOptions={{ exact: true }}
              className={`inline-flex min-h-11 scroll-mt-20 items-center gap-2 text-lg font-bold text-white transition-opacity hover:opacity-80 sm:min-h-0 ${darkFocusRing}`}
              to="/"
            >
              <WaveMarkIcon className="h-6 w-6 shrink-0 text-ocean-400" />
              Playas de Murcia
            </Link>
            {beachCount > 0 && (
              <p className="mt-1 max-w-xs text-sm leading-relaxed text-ocean-200 sm:mt-3">
                {beachCount} playas y calas de los {municipalityCount}{' '}
                municipios costeros de la Región de Murcia.
              </p>
            )}
            <Link
              activeOptions={{ exact: true }}
              className={`inline-flex min-h-11 items-center text-sm text-ocean-200 underline decoration-ocean-400 underline-offset-2 aria-[current=page]:font-semibold aria-[current=page]:text-white sm:mt-2 sm:min-h-6 ${linkBaseClass}`}
              to="/explorar"
            >
              Todas las playas
            </Link>
          </div>

          <FooterLinkGroup
            id="footer-municipios"
            label="Municipios, de norte a sur"
          >
            {municipalities.map((m) => (
              <li key={m.slug}>
                <Link
                  activeOptions={{ exact: true }}
                  aria-label={countedName(m.name, m.beachCount)}
                  className={rowClass}
                  params={{ slug: m.slug }}
                  to="/municipios/$slug"
                >
                  <span className="min-w-0">{m.name}</span>
                  <CountPill count={m.beachCount} />
                </Link>
              </li>
            ))}
            <IndexRow>
              <Link
                activeOptions={{ exact: true }}
                className={indexRowClass}
                to="/municipios"
              >
                Todos los municipios
              </Link>
            </IndexRow>
          </FooterLinkGroup>

          <FooterLinkGroup
            id="footer-colecciones"
            label="Colecciones destacadas"
          >
            {characteristics.map((c) => (
              <li key={c.href}>
                <Link
                  activeOptions={{ exact: true }}
                  aria-label={countedName(c.label, c.count)}
                  className={rowClass}
                  params={{ slug: c.href.split('/').pop()! }}
                  to="/colecciones/$slug"
                >
                  <span className="min-w-0">{c.label}</span>
                  <CountPill count={c.count} />
                </Link>
              </li>
            ))}
            <IndexRow>
              <Link
                activeOptions={{ exact: true }}
                className={indexRowClass}
                to="/colecciones"
              >
                Todas las colecciones
              </Link>
            </IndexRow>
          </FooterLinkGroup>
        </div>

        <div className="mt-4 text-sm sm:mt-10 sm:border-t sm:border-ocean-800 sm:pt-6">
          <p className={`mb-1 sm:mb-3 ${eyebrowClass}`} id="footer-fuentes">
            Fuentes
          </p>
          <dl aria-labelledby="footer-fuentes" className={columnsClass}>
            {SOURCES.map(({ fact, links }) => (
              // Flex, not a 7.5rem grid column: at 200% text the label eats
              // the phone width, so the links drop below it instead of
              // overflowing the page
              <div key={fact} className="flex flex-wrap gap-x-2">
                <dt className="flex min-h-11 shrink-0 basis-[7.5rem] items-center sm:min-h-7">
                  {fact}:
                </dt>
                <dd className="flex min-w-0 flex-1 basis-24 flex-wrap items-center gap-x-1">
                  {links.map(({ label, detail, href }, index) => (
                    <span key={href} className="inline-flex items-center gap-1">
                      {index > 0 && <span>y</span>}
                      <a
                        className={`inline-flex min-h-11 items-center whitespace-nowrap underline decoration-ocean-400 underline-offset-2 sm:min-h-7 ${linkBaseClass}`}
                        href={href}
                        rel="noopener"
                        target="_blank"
                      >
                        <span>
                          {label}
                          {detail && (
                            <span className="hidden xl:inline">{detail}</span>
                          )}
                        </span>
                      </a>
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 border-t border-ocean-800 pt-4 sm:mt-6 sm:pt-6">
            <p className="text-ocean-100">
              Proyecto personal, sin publicidad ni fines comerciales.
            </p>
            <p className="mt-1">&copy; {currentYear} Playas de Murcia</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
