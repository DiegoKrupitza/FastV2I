import type { UseMemoizedFn } from '@vueuse/core'
import type { ComputedRef } from 'vue'

import { useBackend } from '~/composables'
import type { NewSimulation, Simulation } from '~/types'

const FAST_POLLING_RATE = 1000
const SLOW_POLLING_RATE = 5000

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

  async function startSimulation(config: NewSimulation) {
    await post('/simulator', config)
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

export interface VisualizationSettings {
  actorSize: number
  end: number
  height: number
  padding: number
  roadMarkingSize: number
  roadSize: number
  start: number
}

export function useSimulationVisualization(): ComputedRef<VisualizationSettings> {
  const { getSimulation } = useSimulation()
  const simulation = asyncComputed(async () => await getSimulation())
  return computed(() => {
    const length = simulation.value?.scenarioLength ?? 0
    const roadSize = length / 75
    const roadMarkingSize = roadSize / 10
    const actorSize = roadSize / 2
    const padding = actorSize

    const start = -padding
    const end = length + 2 * padding
    const height = length / 2

    return {
      actorSize,
      end,
      height,
      length,
      padding,
      roadMarkingSize,
      roadSize,
      start,
    }
  })
}
