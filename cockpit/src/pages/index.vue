<script setup lang="ts">
import { useSimulation, useSimulationState } from '~/composables'

const { isSimulationActive, stopSimulation } = useSimulation()

const router = useRouter()

watch(
  isSimulationActive,
  () => {
    if (isSimulationActive.value === false) {
      router.push('/new')
    }
  },
  { immediate: true }
)

const { getSimulation } = useSimulation()
const simulation = asyncComputed(() => getSimulation())
const { cars, trafficLights } = useSimulationState()

const { t } = useI18n()
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
  <Button
    :disabled="!isSimulationActive"
    class="position-fixed top-4 left-4"
    @click="stopSimulation()"
  >
    {{ t('button.stop') }}
  </Button>
</template>
