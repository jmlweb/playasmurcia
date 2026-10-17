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

  // Sync from props during render (not in an effect) to avoid a cascading re-render
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    setLocalValue(value)
  }

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
      {/* z-10: the input's backdrop-blur creates a stacking context that would paint over the icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
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
        className="w-full rounded-full border border-white/30 bg-white/95 py-3.5 pr-10 pl-12 text-base text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-xl transition-shadow focus:bg-white/95 focus:shadow-xl focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:outline-none"
        placeholder={placeholder}
        type="search"
        value={localValue}
        onChange={handleChange}
      />
      {localValue && (
        <button
          aria-label="Limpiar búsqueda"
          className="absolute inset-y-0 right-0 z-10 flex cursor-pointer items-center pr-3 text-gray-500 hover:text-gray-600"
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
