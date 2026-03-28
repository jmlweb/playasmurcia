interface FooterMunicipality {
  name: string
  slug: string
  beachCount: number
}

interface FooterCharacteristic {
  label: string
  href: string
  count: number
}

interface SiteFooterProps {
  municipalities: Array<FooterMunicipality>
  characteristics: Array<FooterCharacteristic>
}

export function SiteFooter({ municipalities, characteristics }: SiteFooterProps) {
  return (
    <footer className="bg-ocean-900 text-ocean-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Link grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Branding */}
          <div>
            <a href="/" className="text-lg font-bold text-white transition-opacity hover:opacity-80">
              Playas de Murcia
            </a>
            <p className="mt-3 text-sm leading-relaxed text-ocean-300">
              Guia completa de las playas y calas de la Region de Murcia.
              Costa Calida, entre el Mediterraneo y el Mar Menor.
            </p>
          </div>

          {/* Municipalities */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ocean-400">
              Municipios
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {municipalities.map((m) => (
                <li key={m.slug}>
                  <a
                    href={`/municipios/${m.slug}`}
                    className="group flex items-center gap-1.5 text-sm text-ocean-200 transition-colors hover:text-white"
                  >
                    {m.name}
                    <span className="rounded-full bg-ocean-800 px-1.5 py-0.5 text-[10px] font-medium text-ocean-400 transition-colors group-hover:text-ocean-300">
                      {m.beachCount}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Characteristics + Quick links */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ocean-400">
              Descubrir
            </p>
            <ul className="space-y-2">
              {characteristics.map((c) => (
                <li key={c.href}>
                  <a
                    href={c.href}
                    className="group flex items-center gap-1.5 text-sm text-ocean-200 transition-colors hover:text-white"
                  >
                    {c.label}
                    <span className="rounded-full bg-ocean-800 px-1.5 py-0.5 text-[10px] font-medium text-ocean-400 transition-colors group-hover:text-ocean-300">
                      {c.count}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2 border-t border-ocean-800 pt-4">
              <a href="/explorar" className="text-sm text-ocean-200 transition-colors hover:text-white">
                Explorar playas
              </a>
              <a href="/colecciones" className="text-sm text-ocean-200 transition-colors hover:text-white">
                Colecciones
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ocean-800 pt-6 sm:flex-row">
          <p className="text-xs text-ocean-400">
            Datos del Ministerio de Transicion Ecologica
          </p>
          <p className="text-xs text-ocean-500">
            &copy; {new Date().getFullYear()} Playas de Murcia
          </p>
        </div>
      </div>
    </footer>
  )
}
