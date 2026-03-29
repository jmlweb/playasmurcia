import { Link } from '@tanstack/react-router'

type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-8 text-sm text-gray-500">
      {items.map((item, i) => (
        <span key={item.href ?? item.label}>
          {i > 0 && (
            <span aria-hidden="true" className="mx-2">
              /
            </span>
          )}
          {item.href ? (
            <Link
              className="hover:text-ocean-600 focus-visible:text-ocean-600 transition-colors focus-visible:underline focus-visible:outline-none"
              to={item.href}
            >
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-gray-600">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
