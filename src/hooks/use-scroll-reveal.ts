import { useEffect, useLayoutEffect, useRef } from 'react'

// Safe for SSR: useLayoutEffect on client, no-op on server.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Attaches an IntersectionObserver to the ref element. When it enters the
 * viewport, the `revealed` class is added (triggering CSS transitions).
 * The element should have the `reveal` class applied in markup.
 *
 * Progressive-enhancement model:
 * - The CSS rule that sets `opacity: 0` is scoped to `.js-reveal.reveal`.
 *   This means server-rendered HTML (and no-JS users) see the element at its
 *   natural opacity, so SEO crawlers and automated renderers always see content.
 * - `useIsomorphicLayoutEffect` adds `js-reveal` synchronously before the first
 *   client paint (no flash), opting the element into the hide→reveal animation.
 * - Elements already in or near the viewport (<= innerHeight + 200px) are
 *   revealed immediately so primary above-fold content is visible on first paint.
 * - A 1200ms timeout fallback ensures content is never permanently hidden if
 *   the IntersectionObserver fails to fire (e.g. full-page screenshots).
 * - `prefers-reduced-motion: reduce` skips animation entirely.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.15,
) {
  const ref = useRef<T>(null)

  // Add `js-reveal` before the first paint to activate the CSS animation.
  // Skip under reduced motion so no hidden state is ever applied.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) {
      el.classList.add('revealed')
    } else {
      el.classList.add('js-reveal')
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduced-motion path: already handled in layout effect above.
    if (!el.classList.contains('js-reveal')) return

    // Reveal immediately if already in or near the initial viewport so
    // primary sections are visible on first meaningful paint without scroll.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight + 200) {
      el.classList.add('revealed')
      return
    }

    // Fallback: guarantee visibility within 1200ms even if the observer
    // never fires (automated rendering, layout quirks, etc.)
    const timer = setTimeout(() => {
      el.classList.add('revealed')
    }, 1200)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(timer)
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      // rootMargin pre-triggers reveals 200px before elements enter viewport.
      { threshold, rootMargin: '0px 0px 200px 0px' },
    )

    observer.observe(el)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [threshold])

  return ref
}
