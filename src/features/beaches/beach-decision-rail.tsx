import { BeachFlagAlert } from './beach-flag-alert'
import { BeachSafetyBar } from './beach-safety-bar'
import { BeachStatusWidget } from './beach-status-widget'
import { SunTimesPanel } from './sun-times-panel'
import { useBeachStatus } from './use-beach-status'
import { WeatherWidget } from './weather-widget'

type BeachDecisionRailProps = {
  beachCode: string
  beachName: string
  municipalityName: string
  coordinates: [number, number]
  lifeguard?: boolean
  hasNearbyBeaches: boolean
  /** puesta-sol tag: the summer sun sets over the water from this shore */
  sunsetOverWater?: boolean
}

export function BeachDecisionRail({
  beachCode,
  beachName,
  municipalityName,
  coordinates,
  lifeguard,
  hasNearbyBeaches,
  sunsetOverWater,
}: BeachDecisionRailProps) {
  const status = useBeachStatus(beachName, municipalityName)
  const isClosed =
    status.status === 'success' &&
    !status.data.isOffSeason &&
    status.data.flag === 'PLAYA CERRADA'

  return (
    <>
      <BeachFlagAlert hasNearbyBeaches={hasNearbyBeaches} state={status} />
      <BeachSafetyBar
        beachName={beachName}
        coordinates={coordinates}
        isClosed={isClosed}
        lifeguard={lifeguard}
      />
      <WeatherWidget beachCode={beachCode} />
      <SunTimesPanel
        coordinates={coordinates}
        sunsetOverWater={sunsetOverWater}
      />
      <BeachStatusWidget state={status} />
    </>
  )
}
