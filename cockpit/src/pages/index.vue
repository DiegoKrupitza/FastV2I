<script setup lang="ts">
import { useSimulation, useSimulationState } from '~/composables'

const { isSimulationActive, stopSimulation } = useSimulation()

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
  <div class="position-fixed top-4 left-4 flex gap-2">
    <Button :disabled="!isSimulationActive" @click="stopSimulation()">
      {{ t('button.stop') }}
    </Button>
    <Button
      v-if="canRestart"
      :disabled="!isSimulationActive"
      @click="restartSimulation()"
    >
      {{ t('button.restart') }}
    </Button>
  </div>
</template>
