<script setup lang="ts">
import type { VisualizationConfig } from '~/composables'
import type { Car } from '~/types'

const props = defineProps<{ car: Car; config: VisualizationConfig }>()
const { car, config } = toRefs(props)

const emit = defineEmits<{
  (eventName: 'select', car: Car): void
}>()
</script>

<template>
  <g>
    <circle
      :cx="car.location"
      :cy="0.5 * config.height"
      :r="config.actorSize"
      class="fill-blue stroke-8 stroke-black cursor-pointer"
      :style="{ 'stroke-width': config.actorSize / 5 }"
      @click="emit('select', car)"
    />
  </g>
</template>
