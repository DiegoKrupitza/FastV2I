<script setup lang="ts">
import type { Car } from '~/types'
const props = defineProps<{ car: Car }>()
const { car } = toRefs(props)
</script>

<template>
  <div class="card">
    {{ car }}
  </div>
</template>
