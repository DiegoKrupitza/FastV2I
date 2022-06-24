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
  MIN_SPEED: 7,
  MAX_SPEED: 37,
}

function validateTrafficLights({
  scenarioLength,
  trafficLights,
}: Input): string[] {
  const trafficLightList = Object.values(trafficLights.value)
  const numberOfTrafficLights = trafficLightList.length
  const { t } = useI18n()

  const errors: string[] = []

  if (numberOfTrafficLights < SimulationConstants.MIN_TRAFFIC_LIGHTS) {
    errors.push(
      t('validation.traffic-light.too-few', {
        count: numberOfTrafficLights,
        min: SimulationConstants.MIN_TRAFFIC_LIGHTS,
      })
    )
  }
  if (numberOfTrafficLights > SimulationConstants.MAX_TRAFFIC_LIGHTS) {
    errors.push(
      t('validation.traffic-light.too-many', {
        count: numberOfTrafficLights,
        max: SimulationConstants.MAX_TRAFFIC_LIGHTS,
      })
    )
  }

  const sortedTrafficLights = trafficLightList.sort(
    (a, b) => a.position - b.position
  )

  sortedTrafficLights.forEach((trafficLight) => {
    if (
      trafficLight.position < 0 ||
      trafficLight.position > +scenarioLength.value
    ) {
      errors.push(
        t('validation.traffic-light.out-of-bounds', {
          id: trafficLight.id,
        })
      )
    }
  })

  const first = sortedTrafficLights.at(0)
  if (first && first.position - first.scanDistance <= 0) {
    errors.push(
      t('validation.traffic-light.scan-distance-out-of-bounds', {
        id: first.id,
      })
    )
  }

  const last = sortedTrafficLights.at(-1)
  if (last && last.position + last.scanDistance >= +scenarioLength.value) {
    errors.push(
      t('validation.traffic-light.scan-distance-out-of-bounds', {
        id: last.id,
      })
    )
  }

  sortedTrafficLights.slice(1).forEach((trafficLight, i, rest) => {
    const next = rest.at(i)
    if (!next || next.id === trafficLight.id) {
      return
    }
    if (
      trafficLight.position + trafficLight.scanDistance >=
      next.position - next.scanDistance
    ) {
      errors.push(
        t('validation.traffic-light.overlap', {
          first: trafficLight.id,
          second: next.id,
        })
      )
    }
  })

  return errors
}

function validateCars({
  cars,
  scenarioLength,
  trafficLights,
}: Input): string[] {
  const carList = Object.values(cars.value)
  const numberOfCars = carList.length
  const { t } = useI18n()

  const errors: string[] = []

  if (numberOfCars < SimulationConstants.MIN_CARS) {
    errors.push(
      t('validation.car.too-few', {
        count: numberOfCars,
        min: SimulationConstants.MIN_CARS,
      })
    )
  }
  if (numberOfCars > SimulationConstants.MAX_CARS) {
    errors.push(
      t('validation.car.too-many', {
        count: numberOfCars,
        max: SimulationConstants.MAX_CARS,
      })
    )
  }

  carList.forEach((car) => {
    if (car.location < 0 || car.location > +scenarioLength.value) {
      errors.push(
        t('validation.car.out-of-bounds', {
          vin: car.vin,
        })
      )
    }
  })

  const trafficLightList = Object.values(trafficLights.value)

  carList.forEach((car) => {
    if (car.destination < 0 || car.destination > +scenarioLength.value) {
      errors.push(
        t('validation.car.destination-out-of-bounds', {
          vin: car.vin,
        })
      )
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
      errors.push(
        t('validation.car.forbidden-destination', {
          vin: car.vin,
        })
      )
    }
  })

  carList.forEach((car) => {
    if (car.speed < SimulationConstants.MIN_SPEED) {
      errors.push(t('validation.car.speed-too-low', { vin: car.vin }))
    } else if (car.speed > SimulationConstants.MAX_SPEED) {
      errors.push(t('validation.car.speed-too-high', { vin: car.vin }))
    }
  })

  return errors
}

export function useValidation(input: Input): ComputedRef<string[]> {
  return computed(() => [
    ...validateTrafficLights(input),
    ...validateCars(input),
  ])
}
