<script setup lang="ts">
import { useSimulation, useSimulationState } from '~/composables'

const { getSimulation } = useSimulation()
const simulation = asyncComputed(() => getSimulation())
const { cars, trafficLights } = useSimulationState()
const simulationPadding = computed(() => {
  const scenarioLength = simulation.value?.scenarioLength ?? 0
  if (scenarioLength <= 1000) {
    return 100
  } else {
    return 0.1 * scenarioLength
  }
})
</script>

<template>
  <svg
    v-if="simulation"
    class="flex-1"
    :viewBox="`${-simulationPadding} 0 ${
      simulation?.scenarioLength + 2 * simulationPadding
    } 100`"
  >
    <TrafficLight
      v-for="trafficLight of trafficLights"
      :key="trafficLight.id"
      :traffic-light="trafficLight"
    />
    <Car
      v-for="car of cars"
      :key="car.vin"
      :car="car"
      :simulation="simulation"
    />
  </svg>
</template>
