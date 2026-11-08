import type { MarineReserve } from '@/lib/marine-reserves'

type MarineReserveNoticeProps = {
  reserve: MarineReserve
}

const linkClass =
  'underline decoration-gray-400 underline-offset-2 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none'

const formatHectares = (value: number) =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

/** Zone-level marine reserve facts: area, the integral zone and the diving rule */
export function MarineReserveNotice({ reserve }: MarineReserveNoticeProps) {
  return (
    <div
      aria-labelledby="reserva-marina-heading"
      className="rounded-xl bg-ocean-50 px-4 py-3 text-sm text-gray-900"
      role="note"
    >
      <p className="font-semibold" id="reserva-marina-heading">
        {reserve.name} · {formatHectares(reserve.areaHectares)} ha, desde{' '}
        {String(reserve.createdYear)}
      </p>
      <p className="mt-1">{reserve.summary}</p>
      <p className="mt-1">{reserve.integralZone}</p>
      <p className="mt-1">{reserve.diving}</p>
      <p className="mt-2 text-xs text-gray-600">
        Fuentes:{' '}
        {reserve.sources.map((source, index) => (
          <span key={source.url}>
            {index > 0 && ' · '}
            <a
              className={linkClass}
              href={source.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {source.label}
            </a>
          </span>
        ))}
        {reserve.note && <>. {reserve.note}</>}
      </p>
    </div>
  )
}
