import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

/**
 * Client navigation keeps focus on the clicked link, so keyboard and
 * screen-reader users stay in the old page's position. This moves focus to the
 * element named by the hash, else to the new page's `h1`, which also announces
 * the page. Query changes (explorer filters) do not move focus.
 */
export function useRouteFocus() {
  const resolvedLocation = useRouterState({
    select: (s) => s.resolvedLocation,
  })
  const pathname = resolvedLocation?.pathname
  const hash = resolvedLocation?.hash
  const hasNavigated = useRef(false)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const isSamePath = previousPathname.current === pathname
    previousPathname.current = pathname
    if (!hasNavigated.current) {
      hasNavigated.current = true
      if (!hash) return
    }

    const hashTarget = hash ? document.getElementById(hash) : null
    if (hashTarget) {
      hashTarget.focus({ preventScroll: true })
      return
    }
    if (isSamePath) return

    const heading = document.querySelector<HTMLElement>('main h1')
    if (!heading) return
    heading.tabIndex = -1
    heading.focus({ preventScroll: true })
  }, [pathname, hash])
}
