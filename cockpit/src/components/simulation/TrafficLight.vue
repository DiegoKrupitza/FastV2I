<script setup lang="ts">
import { useSimulationVisualization } from '~/composables'
import type { Simulation, TrafficLight } from '~/types'

const props =
  defineProps<{ simulation: Simulation; trafficLight: TrafficLight }>()
const { trafficLight } = toRefs(props)

const emit = defineEmits<{
  (eventName: 'select', trafficLight: TrafficLight): void
}>()

const { actorSize, roadSize, height } = useSimulationVisualization()
</script>

<template>
  <g>
    <rect
      :y="0"
      :height="height"
      :x="trafficLight.location - 0.5 * roadSize"
      :width="roadSize"
      class="fill-gray dark:filter-invert"
    />
    <line
      :x1="trafficLight.location"
      :x2="trafficLight.location"
      :y1="0"
      :y2="height"
      class="stroke-yellow"
      :style="{ 'stroke-width': roadSize / 5, 'stroke-dasharray': roadSize }"
    />
    <circle
      :cx="trafficLight.location"
      :cy="0.5 * height"
      :r="trafficLight.scanDistance"
      class="fill-black dark:filter-invert op25"
    />
    <circle
      :cx="trafficLight.location"
      :cy="0.5 * height"
      :r="actorSize"
      :class="{
        'fill-green400': trafficLight.color === 'green',
        'fill-red': trafficLight.color === 'red',
      }"
      class="stroke-black"
      :style="{ 'stroke-width': actorSize / 5 }"
      @click="emit('select', trafficLight)"
    />
  </g>
</template>
