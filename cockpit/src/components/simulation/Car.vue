<script setup lang="ts">
import type { VisualizationConfig } from '~/composables'
import type { Car } from '~/types'

const props =
  defineProps<{ car: Car; config: VisualizationConfig; isSelected: boolean }>()
const { car, config, isSelected } = toRefs(props)

const emit = defineEmits<{
  (eventName: 'select', car: Car): void
}>()
</script>

<template>
  <g v-if="car.location">
    <defs>
      <marker
        id="arrow"
        :markerWidth="10"
        :markerHeight="7"
        :refX="0"
        :refY="3.5"
        orient="auto"
        class="fill-blue"
      >
        <polygon :points="`0 0, ${10} ${3.5}, 0 ${7}`" />
      </marker>
    </defs>
    <line
      v-if="car.speed && car.speed > 0"
      :x1="car.location"
      :y1="0.5 * config.height"
      :x2="
        car.location +
        config.actorSize * (1 + car.speed / 10) * (car.goingUp ? 1 : -1)
      "
      :y2="0.5 * config.height"
      class="stroke-blue"
      :stroke-width="config.actorSize / 4"
      marker-end="url(#arrow)"
    />
    <circle
      :cx="car.location"
      :cy="0.5 * config.height"
      :r="isSelected ? 2 * config.actorSize : config.actorSize"
      class="fill-blue stroke-black cursor-pointer"
      :style="{ 'stroke-width': config.actorSize / 5 }"
      @click="emit('select', car)"
    />
  </g>
</template>
