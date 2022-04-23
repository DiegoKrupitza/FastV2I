<script setup lang="ts">
import { useSimulation, useSimulationState } from '~/composables'

const { getSimulation } = useSimulation()
const simulation = asyncComputed(() => getSimulation())
const { trafficLights } = useSimulationState()
</script>

<template>
  <svg
    v-if="simulation"
    class="w-full flex-1"
    :viewBox="`0 0 ${simulation?.scenarioLength} 100`"
  >
    <TrafficLight
      v-for="trafficLight of trafficLights"
      :key="trafficLight.id"
      :traffic-light="trafficLight"
    />
  </svg>
</template>
