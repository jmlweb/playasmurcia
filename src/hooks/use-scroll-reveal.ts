import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to the ref element. When it enters the
 * viewport, the `revealed` class is added (triggering CSS transitions).
 * The element should have the `reveal` class applied in markup.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.15,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) {
      el.classList.add('revealed')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [threshold])

  return ref
}
