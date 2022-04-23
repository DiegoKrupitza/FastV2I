<script setup lang="ts">
import type { TrafficLight } from '~/types'

const props = defineProps<{ trafficLight: TrafficLight }>()
const { trafficLight } = toRefs(props)
</script>

<template>
  <g>
    <circle :cx="trafficLight.location" :cy="50" :r="50" class="fill-text op50">
    </circle>
    <circle
      :r="32"
      :cx="trafficLight.location"
      :cy="50"
      :class="{
        'fill-green400': trafficLight.color === 'green',
        'fill-red': trafficLight.color === 'red',
      }"
    >
    </circle>
  </g>
</template>
