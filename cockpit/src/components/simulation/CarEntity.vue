<script setup lang="ts">
import type { Car } from '~/types'
const props = defineProps<{ car: Car }>()
const { car } = toRefs(props)
</script>

<template>
  <div class="card bg-$background op100">
    <span class="font-bold">{{ car.vin }}</span>
    <span class="text-sm">{{ car.oem }} – {{ car.model }}</span>
    <span>{{ car.location }}m</span>
    <span>{{ car.speed }}m/s</span>
  </div>
</template>
