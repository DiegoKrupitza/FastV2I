<script setup lang="ts">
import { useSimulationState } from '~/composables'

const { carEntities, carStates, trafficLightEntities, trafficLightStates } =
  useSimulationState()
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
      <div v-for="{ car, state } of carStates" :key="car.vin">
        <h4>{{ car.vin }}</h4>
        <ul>
          <li>
            {{ state }}
          </li>
        </ul>
      </div>
      <h3>Traffic Lights</h3>
      <div
        v-for="{ trafficLight, state } of trafficLightStates"
        :key="trafficLight.id"
      >
        <h4>{{ trafficLight.id }}</h4>
        <ul>
          <li>
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
