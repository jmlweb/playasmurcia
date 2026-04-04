import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className="bg-sand-50 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-ocean-700 mb-3 text-7xl font-normal">404</p>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Página no encontrada
      </h1>
      <p className="mb-8 text-gray-500">
        La página que buscas no existe o ha sido movida.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          className="bg-ocean-600 hover:bg-ocean-700 focus-visible:ring-ocean-500 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/"
        >
          Volver al inicio
        </Link>
        <Link
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/explorar"
        >
          Ver todas las playas
        </Link>
        <Link
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/colecciones"
        >
          Colecciones
        </Link>
      </div>
    </main>
  )
}
