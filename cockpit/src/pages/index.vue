<script setup lang="ts">
import { useBackend } from '~/composables'

// TODO: Move and update interfaces
interface CarEntity {
  vin: string
  oem: string
  model: string
}

interface CarState {
  vin: string
}

interface TrafficLightEntity {
  id: string
  location: [number, number]
}

interface TrafficLightState {
  id: string
}

const { get } = useBackend()

const carEntities = asyncComputed(
  async () => (await get<CarEntity[]>('/entities/cars')).data
)
const trafficLightEntities = asyncComputed(
  async () => (await get<TrafficLightEntity[]>('/entities/traffic-lights')).data
)

const carStates = asyncComputed(
  async () => (await get<CarState[]>('/tracking/cars')).data
)
const trafficLightStates = asyncComputed(
  async () => (await get<TrafficLightState[]>('/tracking/traffic-lights')).data
)
</script>

<template>
  <h1>State</h1>
  <div class="pa-4 gap-4">
    <section>
      <h2>Entities</h2>
      <h3>Cars</h3>
      <ul>
        <li v-for="car of carEntities" :key="car.vin">{{ car }}</li>
      </ul>
      <h3>Traffic Lights</h3>
      <ul>
        <li v-for="trafficLight of trafficLightEntities" :key="trafficLight.id">
          {{ trafficLight }}
        </li>
      </ul>
    </section>
    <section>
      <h2>Tracking</h2>
      <h3>Cars</h3>
      <ul>
        <li v-for="car of carStates" :key="car.vin">{{ car }}</li>
      </ul>
      <h3>Traffic Lights</h3>
      <ul>
        <li v-for="trafficLight of trafficLightStates" :key="trafficLight.id">
          {{ trafficLight }}
        </li>
      </ul>
    </section>
  </div>
</template>
