import { Link } from '@tanstack/react-router'

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

// Read once at module load so render stays pure (react/purity)
const CURRENT_YEAR = new Date().getFullYear()

type SiteFooterProps = {
  municipalities: FooterMunicipality[]
  characteristics: FooterCharacteristic[]
}

export function SiteFooter({
  municipalities,
  characteristics,
}: SiteFooterProps) {
  return (
    <footer className="bg-ocean-900 text-ocean-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Link grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Branding */}
          <div>
            <Link
              className="text-lg font-bold text-white transition-opacity hover:opacity-80"
              to="/"
            >
              Playas de Murcia
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-ocean-300">
              Guía completa de las playas y calas de la Región de Murcia. Costa
              Cálida, entre el Mediterráneo y el Mar Menor.
            </p>
          </div>

          {/* Municipalities */}
          <div>
            <p className="mb-4 text-xs font-semibold tracking-wider text-ocean-400 uppercase">
              Municipios
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {municipalities.map((m) => (
                <li key={m.slug}>
                  <Link
                    className="group flex items-center gap-1.5 text-sm text-ocean-200 transition-colors hover:text-white"
                    params={{ slug: m.slug }}
                    to="/municipios/$slug"
                  >
                    {m.name}
                    <span className="rounded-full bg-ocean-800 px-1.5 py-0.5 text-xs font-medium text-ocean-400 transition-colors group-hover:text-ocean-300">
                      {m.beachCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Characteristics + Quick links */}
          <div>
            <p className="mb-4 text-xs font-semibold tracking-wider text-ocean-400 uppercase">
              Colecciones
            </p>
            <ul className="space-y-2">
              {characteristics.map((c) => (
                <li key={c.href}>
                  <Link
                    className="group flex items-center gap-1.5 text-sm text-ocean-200 transition-colors hover:text-white"
                    params={{ slug: c.href.split('/').pop()! }}
                    to="/colecciones/$slug"
                  >
                    {c.label}
                    <span className="rounded-full bg-ocean-800 px-1.5 py-0.5 text-xs font-medium text-ocean-400 transition-colors group-hover:text-ocean-300">
                      {c.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2 border-t border-ocean-800 pt-4">
              <Link
                className="text-sm text-ocean-200 transition-colors hover:text-white"
                to="/explorar"
              >
                Todas las playas
              </Link>
              <Link
                className="text-sm text-ocean-200 transition-colors hover:text-white"
                to="/colecciones"
              >
                Colecciones
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ocean-800 pt-6 sm:flex-row">
          <p className="text-xs text-ocean-200">
            Datos del Ministerio de Transición Ecológica
          </p>
          <p className="text-xs text-ocean-200">
            &copy; {CURRENT_YEAR} Playas de Murcia
          </p>
        </div>
      </div>
    </footer>
  )
}
