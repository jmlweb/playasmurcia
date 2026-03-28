type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Ruta de navegacion" className="mb-8 text-sm text-gray-500">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && (
            <span aria-hidden="true" className="mx-2">
              /
            </span>
          )}
          {item.href ? (
            <a
              className="hover:text-ocean-600 focus-visible:text-ocean-600 transition-colors focus-visible:outline-none focus-visible:underline"
              href={item.href}
            >
              {item.label}
            </a>
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
