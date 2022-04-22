import type { ComputedRef, Ref } from 'vue'

import type { NewCar, NewTrafficLight } from '~/types'

export interface Input {
  cars: Ref<Record<string, NewCar>>
  trafficLights: Ref<Record<string, NewTrafficLight>>
}

const MIN_TRAFFIC_LIGHTS = 1
const MAX_TRAFFIC_LIGHTS = 4
function validateTrafficLights({ trafficLights }: Input): string | undefined {
  const numberOfTrafficLights = Object.values(trafficLights.value).length
  const { t } = useI18n()
  if (numberOfTrafficLights < MIN_TRAFFIC_LIGHTS) {
    return t('validation.traffic-light.too-few')
  }
  if (numberOfTrafficLights > MAX_TRAFFIC_LIGHTS) {
    return t('validation.traffic-light.too-many')
  }
  // TODO: Complete validation
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
