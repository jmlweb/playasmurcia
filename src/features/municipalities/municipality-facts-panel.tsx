import {
  factSources,
  formatEurPerM2,
  formatPopulation,
  getMunicipalityFacts,
} from '@/lib/municipality-facts'

type MunicipalityFactsPanelProps = {
  name: string
  ineCode: string
}

const linkClass =
  'underline decoration-gray-400 underline-offset-2 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none'

export function MunicipalityFactsPanel({
  name,
  ineCode,
}: MunicipalityFactsPanelProps) {
  const { population, appraisedValue, touristOffices } =
    getMunicipalityFacts(ineCode)
  if (!population && !appraisedValue && touristOffices.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="datos-municipio"
      className="mb-10 rounded-2xl border border-sand-200 bg-white p-5 sm:p-6"
    >
      <h2
        className="mb-4 text-xl font-normal text-gray-900"
        id="datos-municipio"
      >
        Datos de {name}
      </h2>
      <dl className="grid gap-5 sm:grid-cols-2">
        {population && (
          <div>
            <dt className="text-sm text-gray-600">
              Población ({population.year})
            </dt>
            <dd className="text-2xl font-semibold text-gray-900">
              {formatPopulation(population.value)} habitantes
            </dd>
            <dd className="mt-1 text-xs text-gray-600">
              Fuente:{' '}
              <a
                className={linkClass}
                href={factSources.population.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                INE, cifras oficiales a 1 de enero
              </a>
            </dd>
          </div>
        )}
        {appraisedValue && (
          <div>
            <dt className="text-sm text-gray-600">
              Valor tasado medio de la vivienda libre ({appraisedValue.quarter})
            </dt>
            <dd className="text-2xl font-semibold text-gray-900">
              {formatEurPerM2(appraisedValue.eurPerM2)}
            </dd>
            <dd className="mt-1 text-xs text-gray-600">
              Media de todo el municipio, no es un precio de venta ni una
              mediana. Media regional:{' '}
              {formatEurPerM2(factSources.regionalAppraisedValue)}. Fuente:{' '}
              <a
                className={linkClass}
                href={factSources.appraisedValue.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Ministerio de Transportes y Movilidad Sostenible, vía CREM
              </a>
            </dd>
          </div>
        )}
      </dl>
      {touristOffices.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-base font-medium text-gray-900">
            {touristOffices.length === 1
              ? 'Oficina de turismo'
              : 'Oficinas de turismo'}
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {touristOffices.map((office) => (
              <li key={office.name}>
                <a
                  className={`font-medium ${linkClass}`}
                  href={office.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {office.name}
                </a>
                <span className="block">
                  {office.address} · Tel. {office.phone}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-gray-600">
            Datos comprobados en la web oficial del ayuntamiento el{' '}
            {factSources.touristOfficesVerifiedOn}.
          </p>
        </div>
      )}
    </section>
  )
}
