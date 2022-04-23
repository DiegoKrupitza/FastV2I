<script setup lang="ts">
import { useSimulationVisualization } from '~/composables'
import type { Car, Simulation } from '~/types'

const props = defineProps<{ car: Car; simulation: Simulation }>()
const { car } = toRefs(props)

const emit = defineEmits<{
  (eventName: 'select', car: Car): void
}>()

const config = useSimulationVisualization()
</script>

<template>
  <g>
    <circle
      :cx="car.location"
      :cy="0.5 * config.height"
      :r="config.actorSize"
      class="fill-blue stroke-8 stroke-black"
      :style="{ 'stroke-width': config.actorSize / 5 }"
      @click="emit('select', car)"
    />
  </g>
</template>
