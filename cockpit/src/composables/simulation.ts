import type { UseMemoizedFn } from '@vueuse/core'

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

export function useSimulationVisualization() {
  const { getSimulation } = useSimulation()
  const simulation = asyncComputed(async () => await getSimulation())
  const length = computed(() => simulation?.value?.scenarioLength ?? 0)
  const roadSize = computed(() => length.value / 75)
  const actorSize = computed(() => 0.5 * roadSize.value)
  const padding = computed(() => actorSize.value)
  const start = computed(() => -padding.value)
  const end = computed(() => length.value + 2 * padding.value)
  const height = computed(() => length.value * 0.5)

  return {
    actorSize,
    end,
    height,
    padding,
    roadSize,
    start,
  }
}
