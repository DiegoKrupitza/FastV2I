<script setup lang="ts">
import { useSimulation, useSimulationState } from '~/composables'
import type { Car, TrafficLight } from '~/types'

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

const selectedCarVin = ref<string | undefined>()
const selectedCar = computed(() =>
  cars.value.find((car) => car.vin === selectedCarVin.value)
)
const selectedTrafficLightId = ref<string | undefined>()
const selectedTrafficLight = computed(() =>
  trafficLights.value.find(
    (trafficLight) => trafficLight.id === selectedTrafficLightId.value
  )
)

function onCarSelected(car: Car) {
  selectedCarVin.value = car.vin
  selectedTrafficLightId.value = undefined
}

function onTrafficLightSelected(trafficLight: TrafficLight) {
  selectedCarVin.value = undefined
  selectedTrafficLightId.value = trafficLight.id
}
</script>

<template>
  <svg
    v-if="simulation"
    class="flex-1"
    :viewBox="`${-simulationPadding} 0 ${
      simulation?.scenarioLength + 2 * simulationPadding
    } 100`"
  >
    <Road :simulation="simulation" />
    <TrafficLight
      v-for="trafficLight of trafficLights"
      :key="trafficLight.id"
      :traffic-light="trafficLight"
      @select="onTrafficLightSelected"
    />
    <Car
      v-for="car of cars"
      :key="car.vin"
      :car="car"
      :simulation="simulation"
      @select="onCarSelected"
    />
  </svg>
  <CarEntity v-if="selectedCar" :car="selectedCar" />
  <TrafficLightEntity
    v-if="selectedTrafficLight"
    :traffic-light="selectedTrafficLight"
  />
</template>
