import type { ComputedRef, Ref } from 'vue'

import type { NewCar, NewTrafficLight } from '~/types'

export interface Input {
  cars: Ref<Record<string, NewCar>>
  scenarioLength: Ref<number>
  trafficLights: Ref<Record<string, NewTrafficLight>>
}

export const SimulationConstants = {
  MIN_TRAFFIC_LIGHTS: 1,
  MAX_TRAFFIC_LIGHTS: 4,
  MIN_CARS: 1,
  MAX_CARS: 4,
  MIN_SPEED: 25,
  MAX_SPEED: 130,
}
function validateTrafficLights({
  scenarioLength,
  trafficLights,
}: Input): string | undefined {
  const trafficLightList = Object.values(trafficLights.value)
  const numberOfTrafficLights = trafficLightList.length
  const { t } = useI18n()

  if (numberOfTrafficLights < SimulationConstants.MIN_TRAFFIC_LIGHTS) {
    return t('validation.traffic-light.too-few', {
      count: numberOfTrafficLights,
      min: SimulationConstants.MIN_TRAFFIC_LIGHTS,
    })
  }
  if (numberOfTrafficLights > SimulationConstants.MAX_TRAFFIC_LIGHTS) {
    return t('validation.traffic-light.too-many', {
      count: numberOfTrafficLights,
      max: SimulationConstants.MAX_TRAFFIC_LIGHTS,
    })
  }

  const sortedTrafficLights = trafficLightList.sort(
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

function validateCars({
  cars,
  scenarioLength,
  trafficLights,
}: Input): string | undefined {
  const carList = Object.values(cars.value)
  const numberOfCars = carList.length
  const { t } = useI18n()

  if (numberOfCars < SimulationConstants.MIN_CARS) {
    return t('validation.car.too-few', {
      count: numberOfCars,
      min: SimulationConstants.MIN_CARS,
    })
  }
  if (numberOfCars > SimulationConstants.MAX_CARS) {
    return t('validation.car.too-many', {
      count: numberOfCars,
      max: SimulationConstants.MAX_CARS,
    })
  }

  let outOfBoundsError: string | undefined
  carList.forEach((car) => {
    if (car.location < 0 || car.location > scenarioLength.value) {
      outOfBoundsError = t('validation.car.out-of-bounds', {
        vin: car.vin,
      })
    }
  })
  if (outOfBoundsError) {
    return outOfBoundsError
  }

  const trafficLightList = Object.values(trafficLights.value)

  let destinationError: string | undefined
  carList.forEach((car) => {
    if (car.destination < 0 || car.destination > scenarioLength.value) {
      destinationError = t('validation.car.destination-out-of-bounds', {
        vin: car.vin,
      })
      return
    }
    if (
      trafficLightList.some(
        (trafficLight) =>
          trafficLight.position - trafficLight.scanDistance <=
            car.destination &&
          car.destination <= trafficLight.position + trafficLight.scanDistance
      )
    ) {
      destinationError = t('validation.car.forbidden-destination', {
        vin: car.vin,
      })
    }
  })
  if (destinationError) {
    return destinationError
  }

  let speedError: string | undefined
  carList.forEach((car) => {
    if (car.speed < SimulationConstants.MIN_SPEED) {
      speedError = t('validation.car.speed-too-low', { vin: car.vin })
    } else if (car.speed > SimulationConstants.MAX_SPEED) {
      speedError = t('validation.car.speed-too-high', { vin: car.vin })
    }
  })
  if (speedError) {
    return speedError
  }

  return undefined
}

export function useValidation(input: Input): ComputedRef<string | undefined> {
  return computed(() => validateTrafficLights(input) ?? validateCars(input))
}
