<script setup lang="ts">
import { useSimulationVisualization } from '~/composables'
const { end, height, roadSize, start } = useSimulationVisualization()
</script>

<template>
  <g>
    <rect
      :x="start"
      :y="height / 2 - 0.5 * roadSize"
      :height="roadSize"
      :width="end - start"
      class="fill-gray dark:filter-invert"
    />
    <line
      :x1="start"
      :x2="end"
      :y1="height / 2"
      :y2="height / 2"
      class="stroke-yellow"
      :style="{ 'stroke-width': roadSize / 5, 'stroke-dasharray': roadSize }"
    />
  </g>
</template>
