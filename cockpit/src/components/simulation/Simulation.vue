<script setup lang="ts">
import { useSimulationVisualization } from '~/composables'
import type { Car, Simulation, TrafficLight } from '~/types'

const props = defineProps<{
  simulation: Simulation
  cars: Car[]
  trafficLights: TrafficLight[]
}>()
const { simulation, cars, trafficLights } = toRefs(props)
const config = useSimulationVisualization(simulation)

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
    :viewBox="`${config.start} 0 ${config.end} ${config.height}`"
  >
    <Road :config="config" :simulation="simulation" />
    <TrafficLight
      v-for="trafficLight of trafficLights"
      :key="trafficLight.id"
      :config="config"
      :traffic-light="trafficLight"
      @select="onTrafficLightSelected"
    />
    <Car
      v-for="car of cars"
      :key="car.vin"
      :car="car"
      :config="config"
      @select="onCarSelected"
    />
  </svg>
  <CarEntity v-if="selectedCar" :car="selectedCar" />
  <TrafficLightEntity
    v-if="selectedTrafficLight"
    :config="config"
    :traffic-light="selectedTrafficLight"
  />
</template>
