import { Link, useNavigate } from '@tanstack/react-router'

import { SearchBar } from '@/features/listing/search-bar'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-sand-50 px-4 py-16 text-center">
      <p className="mb-3 text-7xl font-normal text-ocean-700">404</p>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Página no encontrada
      </h1>
      <p className="mb-6 text-gray-500">
        La página que buscas no existe o ha sido movida. ¿Buscabas una playa?
      </p>
      <div className="mb-8 w-full max-w-md">
        <SearchBar
          value=""
          onChange={(q) => {
            if (q.trim()) void navigate({ to: '/explorar', search: { q } })
          }}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          className="rounded-full bg-ocean-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/"
        >
          Volver al inicio
        </Link>
        <Link
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/explorar"
        >
          Explorar playas
        </Link>
      </div>
    </main>
  )
}
