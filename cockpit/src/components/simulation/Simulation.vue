<script setup lang="ts">
import { useSimulationVisualization } from '~/composables'
import type { Car, Simulation, TrafficLight } from '~/types'

const props = defineProps<{
  simulation: Simulation
  cars: Car[]
  trafficLights: TrafficLight[]
  fullscreen: boolean
}>()
const { cars, fullscreen, simulation, trafficLights } = toRefs(props)
const config = useSimulationVisualization(simulation, fullscreen)

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
  selectedCarVin.value = selectedCarVin.value === car.vin ? undefined : car.vin
  selectedTrafficLightId.value = undefined
}

function onTrafficLightSelected(trafficLight: TrafficLight) {
  selectedCarVin.value = undefined
  selectedTrafficLightId.value =
    selectedTrafficLightId.value === trafficLight.id
      ? undefined
      : trafficLight.id
}
</script>

<template>
  <svg
    v-if="simulation"
    :viewBox="`${config.start} 0 ${config.end} ${config.height}`"
  >
    <Road :config="config" />
    <TrafficLight
      v-for="trafficLight of trafficLights"
      :key="trafficLight.id"
      :config="config"
      :is-selected="selectedTrafficLightId === trafficLight.id"
      :traffic-light="trafficLight"
      @select="onTrafficLightSelected"
    />
    <Car
      v-for="car of cars"
      :key="car.vin"
      :car="car"
      :config="config"
      :is-selected="selectedCarVin === car.vin"
      @select="onCarSelected"
    />
  </svg>
  <CarEntity
    v-if="selectedCar"
    class="position-fixed top-2 right-2"
    :car="selectedCar"
  />
  <TrafficLightEntity
    v-if="selectedTrafficLight"
    class="position-fixed top-2 right-2"
    :config="config"
    :traffic-light="selectedTrafficLight"
  />
</template>
