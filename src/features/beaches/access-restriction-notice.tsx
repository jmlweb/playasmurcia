import type { AccessRestriction } from '@/lib/beach-notices'

type AccessRestrictionNoticeProps = {
  restriction: AccessRestriction
}

const linkClass =
  'underline decoration-amber-700/50 underline-offset-2 hover:text-amber-950 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none'

/** Summer vehicle limits and shuttles, with the year the rule was published for */
export function AccessRestrictionNotice({
  restriction,
}: AccessRestrictionNoticeProps) {
  const { year, recurring, summary, shuttle } = restriction
  return (
    <div
      className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      role="note"
    >
      <p className="font-semibold">
        Acceso en verano ({String(year)})
        {recurring && (
          <span className="font-normal">
            {' '}
            · cada año se publica una orden nueva
          </span>
        )}
      </p>
      <p className="mt-1">{summary}</p>
      {shuttle && <p className="mt-1">{shuttle}</p>}
      <p className="mt-1 text-xs">
        Fuente:{' '}
        <a
          className={linkClass}
          href={restriction.sourceUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {restriction.sourceLabel}
        </a>
        {restriction.shuttleSourceUrl && restriction.shuttleSourceLabel && (
          <>
            {' '}
            ·{' '}
            <a
              className={linkClass}
              href={restriction.shuttleSourceUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {restriction.shuttleSourceLabel}
            </a>
          </>
        )}
      </p>
    </div>
  )
}
