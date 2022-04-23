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
</script>

<template>
  <div class="simulation flex flex-col gap-2 pa-4 h-full">
    <Button
      :disabled="!isSimulationActive"
      class="max-w-16"
      @click="stopSimulation()"
    >
      Stop
    </Button>
    <Simulation
      v-if="simulation"
      :simulation="simulation"
      :cars="cars"
      :traffic-lights="trafficLights"
    />
  </div>
</template>
<style scoped>
.simulation {
  width: calc(100% - 2rem);
}
</style>
