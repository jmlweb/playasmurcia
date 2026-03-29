import { type ChangeEvent, useEffect, useRef, useState } from 'react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar playa...',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setLocalValue(next)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onChange(next)
    }, 300)
  }

  function handleClear() {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className="relative w-full" role="search">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>
      <input
        aria-label="Buscar playa por nombre"
        className="focus-visible:ring-ocean-400 w-full rounded-full border-0 bg-white/95 py-3.5 pr-10 pl-11 text-base text-gray-900 placeholder-gray-400 shadow-lg backdrop-blur-sm transition-shadow focus:bg-white focus:shadow-xl focus-visible:ring-2 focus-visible:outline-none"
        placeholder={placeholder}
        type="search"
        value={localValue}
        onChange={handleChange}
      />
      {localValue && (
        <button
          aria-label="Limpiar búsqueda"
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-500 hover:text-gray-600"
          type="button"
          onClick={handleClear}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      )}
    </div>
  )
}
