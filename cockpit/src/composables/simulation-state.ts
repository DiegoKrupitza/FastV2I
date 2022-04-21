import { useBackend } from '~/composables'

export interface CarEntity {
  vin: string
  oem: string
  model: string
}

export interface CarState {
  vin: string
  timestamp: string
}

export interface TrafficLightEntity {
  id: string
  location: [number, number]
}

export interface TrafficLightState {
  id: string
  color: 'green' | 'red'
  timestamp: string
}

const carEntities = ref<CarEntity[]>([])
const carStates = ref<{ car: CarEntity; state: CarState }[]>([])
const trafficLightEntities = ref<TrafficLightEntity[]>()
const trafficLightStates =
  ref<{ trafficLight: TrafficLightEntity; state: TrafficLightState }[]>()

export function useSimulationState() {
  const { get } = useBackend()

  useIntervalFn(
    async () => {
      const cars = (await get<CarEntity[]>('/entities/cars')).data
      carEntities.value = cars
      carStates.value = await Promise.all(
        cars.map(async (car) => {
          const latest = await get<CarState>(`/tracking/cars/${car.vin}/latest`)
          return { car, state: latest.data }
        })
      )
      const trafficLights = (
        await get<TrafficLightEntity[]>('/entities/traffic-lights')
      ).data
      trafficLightEntities.value = trafficLights
      trafficLightStates.value = await Promise.all(
        trafficLights.map(async (trafficLight) => {
          const latest = await get<TrafficLightState>(
            `/tracking/traffic-lights/${trafficLight.id}/latest`
          )
          return { trafficLight, state: latest.data }
        })
      )
    },
    1000,
    { immediateCallback: true }
  )

  return {
    carEntities,
    carStates,
    trafficLightEntities,
    trafficLightStates,
  }
}
