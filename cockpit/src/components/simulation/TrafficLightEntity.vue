<script setup lang="ts">
import type { TrafficLight } from '~/types'
const props = defineProps<{ trafficLight: TrafficLight }>()
const { trafficLight } = toRefs(props)
</script>

<template>
  <div class="card">
    <span>{{ trafficLight }}</span>
  </div>
</template>
