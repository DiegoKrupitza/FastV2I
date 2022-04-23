<script setup lang="ts">
import type { Car, Simulation } from '~/types'

const props = defineProps<{ car: Car; simulation: Simulation }>()
const { car } = toRefs(props)
</script>

<template>
  <g>
    <circle :cx="car.location" :cy="50" :r="100" class="fill-blue" />
  </g>
</template>
