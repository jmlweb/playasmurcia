import { createFileRoute, notFound } from '@tanstack/react-router'

import { NotFound } from '@/components/layout/not-found'

// A route of its own: an unmatched URL never runs a head() that could name the error
export const Route = createFileRoute('/$')({
  loader: () => {
    throw notFound()
  },
  head: () => ({
    meta: [{ title: 'Página no encontrada - Playas de Murcia' }],
  }),
  notFoundComponent: NotFound,
})
