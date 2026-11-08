import { getSmokeFreeEntry, smokeFreeSource } from '@/lib/beach-notices'

type SmokeFreeNoticeProps = {
  beachCode: string
}

/**
 * Membership of the regional smoke-free network. The network recommends not
 * smoking on the sand; fines depend on each municipality's ordinance, so the
 * copy promises none.
 */
export function SmokeFreeNotice({ beachCode }: SmokeFreeNoticeProps) {
  const entry = getSmokeFreeEntry(beachCode)
  if (!entry) return null

  return (
    <p
      className="flex items-start gap-2.5 rounded-xl bg-ocean-50 px-4 py-3 text-sm text-gray-900"
      role="note"
    >
      <svg
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0 text-ocean-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M18.364 5.636a9 9 0 1 1-12.728 12.728 9 9 0 0 1 12.728-12.728Zm0 0L5.636 18.364"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
      <span>
        <span className="font-semibold">Playa sin humo.</span>{' '}
        {entry.stretch
          ? `Forma parte de la Red de Playas sin Humo de la Región de Murcia en ${entry.stretch}, donde se recomienda no fumar.`
          : 'Forma parte de la Red de Playas sin Humo de la Región de Murcia, que recomienda no fumar en el arenal.'}{' '}
        <a
          className="underline decoration-gray-400 underline-offset-2 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none"
          href={smokeFreeSource.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          Lista de la Consejería de Salud
        </a>{' '}
        (sin fecha de publicación).
      </span>
    </p>
  )
}
