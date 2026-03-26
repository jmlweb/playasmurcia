interface ContactInfoProps {
  phone?: string
  email?: string
  realUrl?: string
  instagramHashtag?: string
}

export function ContactInfo({ phone, email, realUrl, instagramHashtag }: ContactInfoProps) {
  const hasAnyContact = phone || email || realUrl || instagramHashtag

  if (!hasAnyContact) {
    return null
  }

  return (
    <section
      className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
      aria-label="Información de contacto"
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Contacto</h2>
      <ul className="space-y-3">
        {phone && (
          <li className="flex items-center gap-3">
            <span className="text-gray-400" aria-hidden="true">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </span>
            <a
              href={`tel:${phone}`}
              className="rounded text-sm text-gray-700 hover:text-ocean-600 focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {phone}
            </a>
          </li>
        )}
        {email && (
          <li className="flex items-center gap-3">
            <span className="text-gray-400" aria-hidden="true">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
            <a
              href={`mailto:${email}`}
              className="rounded text-sm text-gray-700 hover:text-ocean-600 focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {email}
            </a>
          </li>
        )}
        {realUrl && (
          <li className="flex items-center gap-3">
            <span className="text-gray-400" aria-hidden="true">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>
            <a
              href={realUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded text-sm text-ocean-600 hover:underline focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              Sitio web oficial
            </a>
          </li>
        )}
        {instagramHashtag && (
          <li className="flex items-center gap-3">
            <span className="text-gray-400" aria-hidden="true">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </span>
            <a
              href={`https://www.instagram.com/explore/tags/${instagramHashtag.replace("#", "")}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded text-sm text-gray-700 hover:text-ocean-600 focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {instagramHashtag}
            </a>
          </li>
        )}
      </ul>
    </section>
  )
}
