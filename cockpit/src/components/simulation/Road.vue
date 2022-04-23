<script setup lang="ts">
import type { Simulation } from '~/types'

const props = defineProps<{ simulation: Simulation }>()
const { simulation } = toRefs(props)
</script>

<template>
  <g>
    <rect
      :y="-50"
      :height="200"
      :width="simulation?.scenarioLength"
      :rx="50"
      class="fill-gray dark:filter-invert"
    />
    <line
      :x1="0"
      :x2="simulation?.scenarioLength"
      :y1="50"
      :y2="50"
      class="stroke-16 stroke-yellow"
      :style="{ 'stroke-dasharray': 50 }"
    />
  </g>
</template>
