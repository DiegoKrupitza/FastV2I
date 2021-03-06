import { v4 } from 'uuid'
import type { Ref } from 'vue'

import { SimulationConstants } from '~/composables/validation'
import type { NewCar, NewSimulation, NewTrafficLight } from '~/types'

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const MIN_SCAN_RADIUS = 50
function randomizeTrafficLights(scenarioLength: number): NewTrafficLight[] {
  const total = randomInRange(
    SimulationConstants.MIN_TRAFFIC_LIGHTS,
    SimulationConstants.MAX_TRAFFIC_LIGHTS
  )
  const trafficLights: NewTrafficLight[] = []
  const sectionLength = Math.floor(scenarioLength / total)
  new Array(total).fill(undefined).forEach(() => {
    const sectionStart = sectionLength * trafficLights.length
    const sectionEnd = sectionStart + sectionLength
    const position = randomInRange(
      sectionStart + MIN_SCAN_RADIUS,
      sectionEnd - MIN_SCAN_RADIUS
    )
    const scanDistance =
      Math.min(position - sectionStart, sectionEnd - position) - 1

    trafficLights.push({
      id: `TL-${trafficLights.length + 1}`,
      position,
      scanDistance,
      entryDelay: randomInRange(0, 5000),
      stateHoldSeconds: randomInRange(5, 15),
    })
  })
  return trafficLights
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

function isInAnyRadius(
  location: number,
  trafficLights: NewTrafficLight[]
): boolean {
  return trafficLights.some((trafficLight) => {
    return (
      trafficLight.position - trafficLight.scanDistance <= location &&
      location <= trafficLight.position + trafficLight.scanDistance
    )
  })
}

function randomizeCars(
  scenarioLength: number,
  trafficLights: NewTrafficLight[]
): NewCar[] {
  const vinCounters = Object.fromEntries(
    Object.entries(MODELS).map(([oem, models]) => [
      oem,
      Object.fromEntries(models.map((model) => [model, 0])),
    ])
  )
  return new Array(
    randomInRange(SimulationConstants.MIN_CARS, SimulationConstants.MAX_CARS)
  )
    .fill(undefined)
    .map(() => {
      const oem = getRandomOEM()
      const model = getRandomModel(oem)
      const location = randomInRange(0, scenarioLength)
      let destination = randomInRange(0, scenarioLength)
      while (isInAnyRadius(destination, trafficLights)) {
        destination = randomInRange(0, scenarioLength)
      }
      const vin = `${oem}-${model}-${++vinCounters[oem][model]}`
      return {
        vin,
        oem,
        model,
        entryTime: randomInRange(0, 5000),
        speed: randomInRange(
          SimulationConstants.MIN_SPEED,
          SimulationConstants.MAX_SPEED
        ),
        location,
        destination,
      }
    })
}

export function useRandomSimulation(
  timelapse: Ref<boolean>
): () => NewSimulation {
  return () => {
    const scenarioLength = randomInRange(500, 2000)
    const trafficLights = randomizeTrafficLights(scenarioLength)
    return {
      id: v4(),
      cars: randomizeCars(scenarioLength, trafficLights),
      trafficLights,
      scenarioLength,
      timelapse: timelapse.value,
      done: false,
    }
  }
}
