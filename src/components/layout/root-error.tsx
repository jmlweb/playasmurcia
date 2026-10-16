import { type ErrorComponentProps, Link } from '@tanstack/react-router'

export function RootErrorComponent({ reset }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sand-50 px-4 text-center">
      <p className="mb-3 text-7xl font-normal text-ocean-200">!</p>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Algo ha ido mal
      </h1>
      <p className="mb-8 text-gray-500">
        Ha ocurrido un error inesperado. Puedes intentarlo de nuevo o volver al
        inicio.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          className="rounded-full bg-ocean-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          type="button"
          onClick={reset}
        >
          Reintentar
        </button>
        <Link
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/"
        >
          Volver al inicio
        </Link>
        <Link
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/explorar"
        >
          Ver todas las playas
        </Link>
      </div>
    </main>
  )
}
