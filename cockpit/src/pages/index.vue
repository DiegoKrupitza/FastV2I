<script setup lang="ts">
import { useSimulation } from '~/composables'

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
</script>

<template>
  <div class="flex flex-col gap-2 pa-4 w-full h-full">
    <Button
      :disabled="!isSimulationActive"
      class="max-w-16"
      @click="stopSimulation()"
    >
      Stop
    </Button>
    <Simulation />
  </div>
</template>
