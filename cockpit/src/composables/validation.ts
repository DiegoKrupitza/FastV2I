import type { ComputedRef, Ref } from 'vue'

import type { NewCar, NewTrafficLight } from '~/types'

export interface Input {
  cars: Ref<Record<string, NewCar>>
  scenarioLength: Ref<number>
  trafficLights: Ref<Record<string, NewTrafficLight>>
}

const MIN_TRAFFIC_LIGHTS = 1
const MAX_TRAFFIC_LIGHTS = 4
function validateTrafficLights({
  scenarioLength,
  trafficLights,
}: Input): string | undefined {
  const numberOfTrafficLights = Object.values(trafficLights.value).length
  const { t } = useI18n()

  if (numberOfTrafficLights < MIN_TRAFFIC_LIGHTS) {
    return t('validation.traffic-light.too-few')
  }
  if (numberOfTrafficLights > MAX_TRAFFIC_LIGHTS) {
    return t('validation.traffic-light.too-many')
  }

  const sortedTrafficLights = Object.values(trafficLights.value).sort(
    (a, b) => a.position - b.position
  )

  let outOfBoundsError: string | undefined
  sortedTrafficLights.forEach((trafficLight) => {
    if (
      trafficLight.position < 0 ||
      trafficLight.position > scenarioLength.value
    ) {
      outOfBoundsError = t('validation.traffic-light.out-of-bounds', {
        id: trafficLight.id,
      })
    }
  })
  if (outOfBoundsError) {
    return outOfBoundsError
  }

  const first = sortedTrafficLights.at(0)!
  if (first.position - first.scanDistance <= 0) {
    return t('validation.traffic-light.scan-distance-out-of-bounds', {
      id: first.id,
    })
  }

  const last = sortedTrafficLights.at(-1)!
  if (last.position + last.scanDistance >= scenarioLength.value) {
    return t('validation.traffic-light.scan-distance-out-of-bounds', {
      id: last.id,
    })
  }

  let overlapError: string | undefined
  sortedTrafficLights.slice(1).forEach((trafficLight, i, rest) => {
    const next = rest.at(i)
    if (!next) {
      return
    }
    if (
      trafficLight.position + trafficLight.scanDistance >=
      next.position - next.scanDistance
    ) {
      overlapError = t('validation.traffic-light.overlap', {
        first: trafficLight.id,
        second: next.id,
      })
    }
  })
  if (overlapError) {
    return overlapError
  }

  return undefined
}

const MIN_CARS = 1
const MAX_CARS = 4
function validateCars({ cars }: Input): string | undefined {
  const numberOfCars = Object.values(cars.value).length
  const { t } = useI18n()
  if (numberOfCars < MIN_CARS) {
    return t('validation.cars.too-few')
  }
  if (numberOfCars > MAX_CARS) {
    return t('validation.cars.too-many')
  }
  // TODO: Complete validation
  return undefined
}

export function useValidation(input: Input): ComputedRef<string | undefined> {
  return computed(() => validateTrafficLights(input) ?? validateCars(input))
}
