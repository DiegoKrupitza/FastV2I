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

const cars = ref<Car[]>([])
const trafficLights = ref<TrafficLight[]>([])

export interface UseSimulationState {
  cars: Ref<Car[]>
  trafficLights: Ref<TrafficLight[]>
}

let carEntities: CarEntity[] | undefined
async function fetchCars() {
  const { get } = useBackend()
  if (!carEntities) {
    carEntities = (await get<CarEntity[]>('/entities/cars')).data
  }
  cars.value = await Promise.all(
    carEntities.map(async (car) => {
      const latest = await get<CarState>(`/tracking/cars/${car.vin}/latest`, {
        silent: true,
      })
      return { ...car, ...latest.data }
    })
  )
}

let trafficLightEntities: TrafficLightEntity[] | undefined
async function fetchTrafficLights() {
  const { get } = useBackend()
  if (!trafficLightEntities) {
    trafficLightEntities = (
      await get<TrafficLightEntity[]>('/entities/traffic-lights')
    ).data
  }
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

export function useSimulationState(pollingRate = 500): UseSimulationState {
  let requestInProgess = false

  async function fetchState() {
    if (requestInProgess) {
      return
    }
    requestInProgess = true
    try {
      await Promise.all([fetchCars(), fetchTrafficLights()])
    } catch (e) {
      console.error(e)
    }
    requestInProgess = false
  }

  const { pause, resume } = useIntervalFn(async () => fetchState(), pollingRate)

  const { isSimulationActive } = useSimulation()

  watch(
    isSimulationActive,
    () => {
      if (isSimulationActive.value) {
        fetchState()
        resume()
      } else {
        pause()
        carEntities = undefined
        cars.value = []
        trafficLightEntities = undefined
        trafficLights.value = []
      }
    },
    { immediate: true }
  )

  return {
    cars,
    trafficLights,
  }
}
