<script setup lang="ts">
import {
  useRandomSimulation,
  useSimulation,
  useSimulationState,
} from '~/composables'

const { isSimulationActive, startSimulation, stopSimulation } = useSimulation()

const router = useRouter()

const { t } = useI18n()
const { warning } = useToast()

watch(
  isSimulationActive,
  () => {
    if (isSimulationActive.value === false) {
      const message = t('toasts.simulation.stopped')
      warning(message, { id: message })
      router.push('/new')
    }
  },
  { immediate: true }
)

const { canRestart, getSimulation, restartSimulation } = useSimulation()
const simulation = asyncComputed(() => getSimulation())
const { cars, trafficLights } = useSimulationState()

const createRandomSimulation = useRandomSimulation(
  computed(() => simulation.value?.timelapse ?? false)
)
async function startRandom() {
  await startSimulation(createRandomSimulation())
}
</script>

<template>
  <div class="position-fixed inset-0 h-full w-full">
    <Simulation
      v-if="simulation"
      :cars="cars"
      :fullscreen="true"
      :simulation="simulation"
      :traffic-lights="trafficLights"
    />
  </div>
  <span class="position-fixed bottom-4 left-4 text-sm text-lighter">
    {{
      simulation?.done
        ? t('entities.simulation.done')
        : t('entities.simulation.in-progress')
    }}
  </span>
  <div class="position-fixed top-4 left-4 flex gap-2">
    <Button
      :disabled="!isSimulationActive"
      class="btn-red"
      @click="stopSimulation()"
    >
      {{ t('button.stop') }}
    </Button>
    <Button
      v-if="canRestart"
      class="btn-yellow"
      :disabled="!isSimulationActive"
      @click="restartSimulation()"
    >
      {{ t('button.restart') }}
    </Button>
    <Button class="btn-green" @click="startRandom()">
      {{ t('button.random') }}
    </Button>
  </div>
</template>
