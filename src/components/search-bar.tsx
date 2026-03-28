import { type ChangeEvent, useEffect, useRef, useState } from "react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Buscar playa..." }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setLocalValue(next)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onChange(next)
    }, 300)
  }

  function handleClear() {
    setLocalValue("")
    onChange("")
  }

  return (
    <div role="search" className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Buscar playa por nombre"
        className="w-full rounded-full border-0 bg-white/95 py-3.5 pr-10 pl-11 text-base text-gray-900 shadow-lg placeholder-gray-400 backdrop-blur-sm transition-shadow focus:bg-white focus:shadow-xl focus:ring-2 focus:ring-ocean-400 focus:outline-none"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-500 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
