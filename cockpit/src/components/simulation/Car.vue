<script setup lang="ts">
import type { Car, Simulation } from '~/types'

const props = defineProps<{ car: Car; simulation: Simulation }>()
const { car } = toRefs(props)

const emit = defineEmits<{
  (eventName: 'select', car: Car): void
}>()
</script>

<template>
  <g>
    <circle
      :cx="car.location"
      :cy="50"
      :r="100"
      class="fill-blue"
      @click="emit('select', car)"
    />
  </g>
</template>
