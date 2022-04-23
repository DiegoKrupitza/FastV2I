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
</script>

<template>
  <g>
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
    />
  </g>
</template>
