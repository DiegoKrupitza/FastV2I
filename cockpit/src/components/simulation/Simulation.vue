<script setup lang="ts">
import { useSimulation, useSimulationState } from '~/composables'

const { getSimulation } = useSimulation()
const simulation = asyncComputed(() => getSimulation())
const { cars, trafficLights } = useSimulationState()
const SIMULATION_PADDING = 200
</script>

<template>
  <svg
    v-if="simulation"
    class="flex-1"
    :viewBox="`${-SIMULATION_PADDING} 0 ${
      simulation?.scenarioLength + SIMULATION_PADDING
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
