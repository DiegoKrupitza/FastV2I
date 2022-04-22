import type { UseMemoizedFn } from '@vueuse/core'

import { useBackend } from '~/composables'
import type { Simulation } from '~/types'

const FAST_POLLING_RATE = 1000
const SLOW_POLLING_RATE = 5000

const demoSimulation = {
  trafficLights: [
    {
      id: 'T1',
      position: 4000,
      scanDistance: 2000,
      entryDelay: 0,
      stateHoldSeconds: 10,
    },
    {
      id: 'T2',
      position: 8000,
      scanDistance: 2000,
      entryDelay: 0,
      stateHoldSeconds: 10,
    },
    {
      id: 'T3',
      position: 12000,
      scanDistance: 2000,
      entryDelay: 0,
      stateHoldSeconds: 10,
    },
  ],
  cars: [
    {
      vin: 'V1',
      oem: 'VW',
      model: 'Caddy',
      entryTime: 0,
      speed: 50,
      location: 0,
      destination: 18000,
    },
    {
      vin: 'V2',
      oem: 'BMW',
      model: 'Z4',
      entryTime: 0,
      speed: 30,
      location: 18000,
      destination: 0,
    },
  ],
  scenarioLength: 18000,
  timelapse: false,
}

let getSimulation: UseMemoizedFn<Promise<Simulation | undefined>, []>

export function useSimulation() {
  const { delete: del, get, post } = useBackend()

  if (!getSimulation) {
    getSimulation = useMemoize(
      async () => (await get<Simulation>('/simulator'))?.data
    )
  }

  const isSimulationActive = asyncComputed(
    async () => !!(await getSimulation())
  )

  const { success, warning } = useToast()
  const { t } = useI18n()

  async function startSimulation() {
    await post('/simulator', demoSimulation)
    await getSimulation.load()
    const message = t('toasts.simulation.started')
    success(message, { id: message })
  }

  async function stopSimulation() {
    await del('/simulator')
    await getSimulation.load()
    const message = t('toasts.simulation.stopped')
    warning(message, { id: message })
  }

  return {
    getSimulation,
    isSimulationActive,
    startSimulation,
    stopSimulation,
  }
}

export function useSimulationPolling() {
  const pollingRate = ref(FAST_POLLING_RATE)
  useIntervalFn(async () => {
    const activeSimulation = await getSimulation.load()
    if (activeSimulation) {
      pollingRate.value = SLOW_POLLING_RATE
    } else {
      pollingRate.value = FAST_POLLING_RATE
    }
  }, pollingRate)
}
