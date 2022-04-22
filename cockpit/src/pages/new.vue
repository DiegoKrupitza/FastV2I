<script setup lang="ts">
import { useSimulation } from '~/composables'

const { isSimulationActive, startSimulation } = useSimulation()

const router = useRouter()

watch(
  isSimulationActive,
  () => {
    if (isSimulationActive.value) {
      router.push('/')
    }
  },
  { immediate: true }
)
</script>

<template>
  <Button :disabled="isSimulationActive" @click="startSimulation()">
    Start
  </Button>
</template>
