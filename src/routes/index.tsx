import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Playas de Murcia</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Descubre las mejores playas de la Región de Murcia
          </p>
        </div>
      </div>
    </main>
  )
}
