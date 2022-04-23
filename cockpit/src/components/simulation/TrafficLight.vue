<script setup lang="ts">
import type { TrafficLight } from '~/types'

const props = defineProps<{ trafficLight: TrafficLight }>()
const { trafficLight } = toRefs(props)

const MAX_RADIUS = 100
const radius = computed(() => {
  if (trafficLight.value.scanDistance > MAX_RADIUS) {
    return MAX_RADIUS
  } else {
    return trafficLight.value.scanDistance - 1
  }
})

const emit = defineEmits<{
  (eventName: 'select', trafficLight: TrafficLight): void
}>()
</script>

<template>
  <g>
    <rect
      :y="-2500"
      :height="5000"
      :x="trafficLight.location - 100"
      :width="200"
      class="fill-gray dark:filter-invert"
    />
    <line
      :x1="trafficLight.location"
      :x2="trafficLight.location"
      :y1="-2500"
      :y2="2500"
      class="stroke-16 stroke-yellow"
      :style="{ 'stroke-dasharray': 50 }"
    />
    <circle
      :cx="trafficLight.location"
      :cy="50"
      :r="trafficLight.scanDistance"
      class="fill-black dark:filter-invert op25"
    />
    <circle
      :cx="trafficLight.location"
      :cy="50"
      :r="radius"
      :class="{
        'fill-green400': trafficLight.color === 'green',
        'fill-red': trafficLight.color === 'red',
      }"
      class="stroke-16 stroke-black"
      @click="emit('select', trafficLight)"
    />
  </g>
</template>
