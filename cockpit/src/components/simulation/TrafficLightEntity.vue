<script setup lang="ts">
import type { TrafficLight } from '~/types'
const props = defineProps<{ trafficLight: TrafficLight }>()
const { trafficLight } = toRefs(props)

const { t } = useI18n()
</script>

<template>
  <div class="card bg-$background op100 text-right">
    <span class="font-bold">
      <carbon-circle-solid
        :class="{
          'color-green400': trafficLight.color === 'green',
          'color-red': trafficLight.color === 'red',
        }"
      />
      {{ trafficLight.id }}
    </span>
    <span>{{ trafficLight.location }}m</span>
    <span>
      {{
        t('entities.traffic-light.scan-radius', {
          radius: trafficLight.scanDistance,
        })
      }}
    </span>
    <span>
      {{
        t('entities.traffic-light.next-change', {
          seconds: (trafficLight.remainingMilliseconds / 1000).toFixed(1),
        })
      }}
    </span>
  </div>
</template>
