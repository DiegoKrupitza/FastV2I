<script setup lang="ts">
import type { VisualizationConfig } from '~/composables'

const props = defineProps<{ config: VisualizationConfig }>()
const { config } = toRefs(props)
</script>

<template>
  <g>
    <rect
      :x="config.start"
      :y="config.height / 2 - 0.5 * config.roadSize"
      :height="config.roadSize"
      :width="config.end - config.start"
      class="fill-gray dark:filter-invert"
    />
    <line
      :x1="config.start"
      :x2="config.end"
      :y1="config.height / 2"
      :y2="config.height / 2"
      class="stroke-yellow"
      :style="{
        'stroke-width': config.roadMarkingSize,
        'stroke-dasharray': config.roadSize,
      }"
    />
  </g>
</template>
