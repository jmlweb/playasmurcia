import { useCallback, useState } from 'react'

import type { LatLng } from '@/lib/geo'

type LocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'granted'; position: LatLng }
  | { status: 'error'; message: string }

const GEOLOCATION_TIMEOUT_MS = 10_000

function describeError(error: GeolocationPositionError): string {
  if (error.code === error.PERMISSION_DENIED) {
    return 'No hemos podido acceder a tu ubicación. Revisa los permisos del navegador.'
  }
  if (error.code === error.TIMEOUT) {
    return 'Tu ubicación tarda demasiado en responder. Inténtalo de nuevo.'
  }
  return 'No hemos podido determinar tu ubicación.'
}

/**
 * Asks for the browser position only when `request` is called. The position
 * lives in component state only: never in the URL, storage or the server.
 */
export function useUserLocation() {
  const [state, setState] = useState<LocationState>({ status: 'idle' })

  const request = useCallback((onGranted?: () => void) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setState({
        status: 'error',
        message: 'Tu navegador no permite obtener la ubicación.',
      })
      return
    }
    setState({ status: 'loading' })
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setState({
          status: 'granted',
          position: [coords.latitude, coords.longitude],
        })
        onGranted?.()
      },
      (error) => {
        setState({ status: 'error', message: describeError(error) })
      },
      { timeout: GEOLOCATION_TIMEOUT_MS, maximumAge: 5 * 60_000 },
    )
  }, [])

  return { state, request }
}
