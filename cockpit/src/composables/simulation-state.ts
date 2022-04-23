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

async function fetchCars() {
  const { get } = useBackend()
  const carEntities = (await get<CarEntity[]>('/entities/cars')).data
  cars.value = await Promise.all(
    carEntities.map(async (car) => {
      const latest = await get<CarState>(`/tracking/cars/${car.vin}/latest`, {
        silent: true,
      })
      return { ...car, ...latest.data }
    })
  )
}

async function fetchTrafficLights() {
  const { get } = useBackend()
  const trafficLightEntities = (
    await get<TrafficLightEntity[]>('/entities/traffic-lights')
  ).data
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
        cars.value = []
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
