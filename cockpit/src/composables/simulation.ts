import type { UseMemoizedFn } from '@vueuse/core'
import type { ComputedRef, Ref } from 'vue'

import { useBackend } from '~/composables'
import type { NewSimulation, Simulation } from '~/types'

const FAST_POLLING_RATE = 1000
const SLOW_POLLING_RATE = 5000

const createdSimulation = ref<Simulation | undefined>()
let getSimulation: UseMemoizedFn<Promise<Simulation | undefined>, []>

export function useSimulation() {
  const { delete: del, get, post, getIsReady } = useBackend()

  if (!getSimulation) {
    getSimulation = useMemoize(async () => {
      const isReady = await getIsReady()
      if (!isReady) {
        return undefined
      }
      return (await get<Simulation>('/simulator'))?.data
    })
  }

  const isSimulationActive = asyncComputed(
    async () => !!(await getSimulation())
  )

  async function startSimulation(config: NewSimulation) {
    createdSimulation.value = config
    await restartSimulation()
  }

  async function stopSimulation() {
    await del('/simulator')
    await getSimulation.load()
  }

  const canRestart = computed(() => !!createdSimulation.value)

  async function restartSimulation() {
    if (!createdSimulation.value) {
      return
    }
    await del('/simulator')
    await post('/simulator', createdSimulation.value)
    await getSimulation.load()
  }

  return {
    canRestart,
    getSimulation,
    isSimulationActive,
    restartSimulation,
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

export interface VisualizationConfig {
  actorSize: number
  end: number
  height: number
  padding: number
  roadMarkingSize: number
  roadSize: number
  start: number
}

export function useSimulationVisualization(
  simulation: Ref<Simulation>,
  fullscreen: Ref<boolean>
): ComputedRef<VisualizationConfig> {
  const { height: windowHeight, width: windowWidth } = useWindowSize()
  return computed(() => {
    const length = simulation.value?.scenarioLength ?? 0
    const roadSize = length / 40
    const roadMarkingSize = roadSize / 10
    const actorSize = roadSize / 2
    const padding = actorSize

    const start = -padding
    const end = length + 2 * padding

    let height = length / 2
    if (fullscreen.value) {
      height = ((end - start) / windowWidth.value) * windowHeight.value
    }

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
