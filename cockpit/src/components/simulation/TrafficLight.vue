<script setup lang="ts">
import type { VisualizationConfig } from '~/composables'
import type { TrafficLight } from '~/types'

const props =
  defineProps<{ config: VisualizationConfig; trafficLight: TrafficLight }>()
const { config, trafficLight } = toRefs(props)

const emit = defineEmits<{
  (eventName: 'select', trafficLight: TrafficLight): void
}>()
</script>

<template>
  <g>
    <rect
      :y="0"
      :height="config.height"
      :x="trafficLight.location - 0.5 * config.roadSize"
      :width="config.roadSize"
      class="fill-gray dark:filter-invert"
    />
    <line
      :x1="trafficLight.location"
      :x2="trafficLight.location"
      :y1="0"
      :y2="config.height"
      class="stroke-yellow"
      :style="{
        'stroke-width': config.roadMarkingSize,
        'stroke-dasharray': config.roadSize,
      }"
    />
    <circle
      :cx="trafficLight.location"
      :cy="0.5 * config.height"
      :r="trafficLight.scanDistance"
      class="fill-black dark:filter-invert op25"
    />
    <circle
      :cx="trafficLight.location"
      :cy="0.5 * config.height"
      :r="config.actorSize"
      :class="{
        'fill-green400': trafficLight.color === 'green',
        'fill-red': trafficLight.color === 'red',
      }"
      class="stroke-black cursor-pointer"
      :style="{ 'stroke-width': config.actorSize / 5 }"
      @click="emit('select', trafficLight)"
    />
  </g>
</template>
