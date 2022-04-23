<script setup lang="ts">
import {
  useSimulation,
  useSimulationState,
  useSimulationVisualization,
} from '~/composables'
import type { Car, TrafficLight } from '~/types'

const { getSimulation } = useSimulation()
const simulation = asyncComputed(() => getSimulation())
const { cars, trafficLights } = useSimulationState()
const { end, height, start } = useSimulationVisualization()
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
    :viewBox="`${start} 0 ${end} ${height}`"
  >
    <Road :simulation="simulation" />
    <TrafficLight
      v-for="trafficLight of trafficLights"
      :key="trafficLight.id"
      :simulation="simulation"
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
