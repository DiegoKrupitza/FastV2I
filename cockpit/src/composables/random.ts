import { v4 } from 'uuid'
import type { Ref } from 'vue'

import type { NewCar, NewSimulation, NewTrafficLight } from '~/types'

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const MODELS: Record<string, string[]> = {
  VW: ['Golf', 'Passat'],
  Ford: ['Focus', 'Fiesta'],
  BMW: ['i4', 'X2'],
  Tesla: ['Model 3', 'Model S'],
}
type OEM = keyof typeof MODELS
const OEMS = Object.keys(MODELS)
function getRandomOEM(): OEM {
  return OEMS[randomInRange(0, OEMS.length - 1)]
}

function getRandomModel(oem: OEM): string {
  const models = MODELS[oem]
  return models[randomInRange(0, models.length - 1)]
}

function randomizeCars(scenarioLength: number): NewCar[] {
  const vinCounters = Object.fromEntries(
    Object.entries(MODELS).map(([oem, models]) => [
      oem,
      Object.fromEntries(models.map((model) => [model, 0])),
    ])
  )
  return new Array(randomInRange(1, 4)).fill(undefined).map(() => {
    const oem = getRandomOEM()
    const model = getRandomModel(oem)
    const location = randomInRange(0, scenarioLength)
    const destination = randomInRange(0, scenarioLength)
    const vin = `${oem}-${model}-${++vinCounters[oem][model]}`
    return {
      vin,
      oem,
      model,
      entryTime: randomInRange(0, 5000),
      speed: randomInRange(25, 130),
      location,
      destination,
    }
  })
}

function randomizeTrafficLights(scenarioLength: number): NewTrafficLight[] {
  const trafficLights: NewTrafficLight[] = []
  new Array(randomInRange(1, 4)).fill(undefined).forEach(() => {
    trafficLights.push({
      id: v4(),
      position: randomInRange(2, scenarioLength - 2),
      scanDistance: 1,
      entryDelay: randomInRange(0, 5000),
      stateHoldSeconds: randomInRange(5, 15),
    })
  })
  return trafficLights
}

export function useRandomSimulation(
  timelapse: Ref<boolean>
): () => NewSimulation {
  return () => {
    const scenarioLength = 15000
    return {
      cars: randomizeCars(scenarioLength),
      trafficLights: randomizeTrafficLights(scenarioLength),
      scenarioLength,
      timelapse: timelapse.value,
    }
  }
}
