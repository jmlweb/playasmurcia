import { Link } from '@tanstack/react-router'

type BreadcrumbItem = {
  label: string
  href?: string
}

export type { BreadcrumbItem }

export function Breadcrumb({
  items,
  tone = 'default',
}: {
  items: BreadcrumbItem[]
  tone?: 'default' | 'onPhoto'
}) {
  const isOnPhoto = tone === 'onPhoto'
  return (
    <nav
      aria-label="Ruta de navegación"
      className={
        isOnPhoto ? 'mb-4 text-sm text-white/80' : 'mb-8 text-sm text-gray-500'
      }
    >
      {items.map((item, i) => (
        <span key={item.href ?? item.label}>
          {i > 0 && (
            <span aria-hidden="true" className="mx-2">
              /
            </span>
          )}
          {item.href ? (
            <Link
              className={
                isOnPhoto
                  ? 'transition-colors hover:text-white focus-visible:text-white focus-visible:underline focus-visible:outline-none'
                  : 'transition-colors hover:text-ocean-600 focus-visible:text-ocean-600 focus-visible:underline focus-visible:outline-none'
              }
              to={item.href}
            >
              {item.label}
            </Link>
          ) : (
            <span
              aria-current="page"
              className={isOnPhoto ? 'text-white' : 'text-gray-600'}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
