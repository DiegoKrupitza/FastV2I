import type { Ref } from 'vue'

import { useBackend } from '~/composables'
import { useSimulation } from '~/composables/simulation'
import type {
  Car,
  CarEntity,
  CarState,
  TrafficLight,
  TrafficLightEntity,
  TrafficLightState,
} from '~/types'

export interface UseSimulationState {
  cars: Ref<Car[]>
  trafficLights: Ref<TrafficLight[]>
}

const cars = ref<Car[]>([])
let carEntities: CarEntity[] | undefined
async function fetchCars(done?: boolean) {
  const { get } = useBackend()
  if (!carEntities) {
    carEntities = (await get<CarEntity[]>('/entities/cars')).data
  }
  if (cars.value.length !== carEntities.length || !done) {
    cars.value = await Promise.all(
      carEntities.map(async (car) => {
        const latest = await get<CarState>(`/tracking/cars/${car.vin}/latest`, {
          silent: true,
        })
        return { ...car, ...latest.data }
      })
    )
  }
}

const trafficLights = ref<TrafficLight[]>([])
let trafficLightEntities: TrafficLightEntity[] | undefined
async function fetchTrafficLights(done?: boolean) {
  const { get } = useBackend()
  if (!trafficLightEntities) {
    trafficLightEntities = (
      await get<TrafficLightEntity[]>('/entities/traffic-lights')
    ).data
  }
  if (trafficLights.value.length !== trafficLightEntities.length || !done) {
    trafficLights.value = await Promise.all(
      trafficLightEntities.map(async (trafficLight) => {
        const latest = await get<TrafficLightState>(
          `/tracking/traffic-lights/${trafficLight.id}/latest`,
          { silent: true }
        )
        return { ...trafficLight, ...latest.data }
      })
    )
  }
}

function clearState() {
  carEntities = undefined
  cars.value = []
  trafficLightEntities = undefined
  trafficLights.value = []
}

export function useSimulationState(pollingRate = 500): UseSimulationState {
  let requestInProgess = false

  const { getSimulation } = useSimulation()
  const simulation = asyncComputed(async () => getSimulation())

  async function fetchState() {
    if (requestInProgess) {
      return
    }
    requestInProgess = true
    try {
      await Promise.all([
        fetchCars(simulation.value?.done),
        fetchTrafficLights(simulation.value?.done),
      ])
    } catch (e) {
      console.error(e)
    }
    requestInProgess = false
  }

  const { pause, resume } = useIntervalFn(async () => fetchState(), pollingRate)

  watch(
    simulation,
    async (newValue, oldValue) => {
      if (newValue) {
        if (newValue.id !== oldValue?.id) {
          clearState()
        }
        fetchState()
        resume()
      } else {
        pause()
        clearState()
      }
    },
    { immediate: true }
  )

  return {
    cars,
    trafficLights,
  }
}
