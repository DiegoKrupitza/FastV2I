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
  timestamp: string
}

interface TrafficLightEntity {
  id: string
  location: [number, number]
}

interface TrafficLightState {
  id: string
  color: 'green' | 'red'
  timestamp: string
}

const { get } = useBackend()

const carEntities = asyncComputed(
  async () => (await get<CarEntity[]>('/entities/cars')).data
)
const trafficLightEntities = asyncComputed(
  async () => (await get<TrafficLightEntity[]>('/entities/traffic-lights')).data
)

const carStates = asyncComputed(async () =>
  Promise.all(
    carEntities.value.map(async (car) => {
      const states = await get<CarState[]>(`/tracking/cars/${car.vin}`)
      const latest = await get<CarState>(`/tracking/cars/${car.vin}/latest`)
      return { car, states: states.data, latest: latest.data }
    })
  )
)
const trafficLightStates = asyncComputed(async () =>
  Promise.all(
    trafficLightEntities.value?.map(async (trafficLight) => {
      const states = await get<TrafficLightState[]>(
        `/tracking/traffic-lights/${trafficLight.id}`
      )
      const latest = await get<TrafficLightState>(
        `/tracking/traffic-lights/${trafficLight.id}/latest`
      )
      return { trafficLight, states: states.data, latest: latest.data }
    })
  )
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
      <div v-for="{ car, states, latest } of carStates" :key="car.vin">
        <h4>{{ car.vin }}</h4>
        <ul>
          <li
            v-for="state of states"
            :key="state.timestamp"
            :class="{ 'text-$primary': state.timestamp === latest.timestamp }"
          >
            {{ state }}
          </li>
        </ul>
      </div>
      <h3>Traffic Lights</h3>
      <div
        v-for="{ trafficLight, states, latest } of trafficLightStates"
        :key="trafficLight.id"
      >
        <h4>{{ trafficLight.id }}</h4>
        <ul>
          <li
            v-for="state of states"
            :key="state.timestamp"
            :class="{ 'text-$primary': state.timestamp === latest.timestamp }"
          >
            {{ state }}
            <carbon-circle-solid
              :class="{
                'color-green400': state.color === 'green',
                'color-red': state.color === 'red',
              }"
            />
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
