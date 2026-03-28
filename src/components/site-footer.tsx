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

export function SiteFooter({
  municipalities,
  characteristics,
}: SiteFooterProps) {
  return (
    <footer className="bg-ocean-900 text-ocean-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Link grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Branding */}
          <div>
            <a
              className="text-lg font-bold text-white transition-opacity hover:opacity-80"
              href="/"
            >
              Playas de Murcia
            </a>
            <p className="text-ocean-300 mt-3 text-sm leading-relaxed">
              Guia completa de las playas y calas de la Region de Murcia. Costa
              Calida, entre el Mediterraneo y el Mar Menor.
            </p>
          </div>

          {/* Municipalities */}
          <div>
            <p className="text-ocean-400 mb-4 text-xs font-semibold tracking-wider uppercase">
              Municipios
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {municipalities.map((m) => (
                <li key={m.slug}>
                  <a
                    className="group text-ocean-200 flex items-center gap-1.5 text-sm transition-colors hover:text-white"
                    href={`/municipios/${m.slug}`}
                  >
                    {m.name}
                    <span className="bg-ocean-800 text-ocean-400 group-hover:text-ocean-300 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-colors">
                      {m.beachCount}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Characteristics + Quick links */}
          <div>
            <p className="text-ocean-400 mb-4 text-xs font-semibold tracking-wider uppercase">
              Descubrir
            </p>
            <ul className="space-y-2">
              {characteristics.map((c) => (
                <li key={c.href}>
                  <a
                    className="group text-ocean-200 flex items-center gap-1.5 text-sm transition-colors hover:text-white"
                    href={c.href}
                  >
                    {c.label}
                    <span className="bg-ocean-800 text-ocean-400 group-hover:text-ocean-300 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-colors">
                      {c.count}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-ocean-800 mt-4 flex flex-col gap-2 border-t pt-4">
              <a
                className="text-ocean-200 text-sm transition-colors hover:text-white"
                href="/explorar"
              >
                Explorar playas
              </a>
              <a
                className="text-ocean-200 text-sm transition-colors hover:text-white"
                href="/colecciones"
              >
                Colecciones
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-ocean-800 mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-ocean-400 text-xs">
            Datos del Ministerio de Transicion Ecologica
          </p>
          <p className="text-ocean-500 text-xs">
            &copy; {new Date().getFullYear()} Playas de Murcia
          </p>
        </div>
      </div>
    </footer>
  )
}
