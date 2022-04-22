<script setup lang="ts">
import { useSimulation, useSimulationState } from '~/composables'

const { isSimulationActive, stopSimulation } = useSimulation()
const { cars, trafficLights } = useSimulationState()

const router = useRouter()

watch(
  isSimulationActive,
  () => {
    if (isSimulationActive.value === false) {
      router.push('/new')
    }
  },
  { immediate: true }
)
</script>

<template>
  <h1>State</h1>
  <div class="flex gap-2">
    <Button :disabled="!isSimulationActive" @click="stopSimulation()">
      Stop
    </Button>
  </div>
  <div class="pa-4 gap-4">
    <section>
      <h2>Tracking</h2>
      <h3>Cars</h3>
      <div v-for="car of cars" :key="car.vin">
        <h4>{{ car.vin }}</h4>
        <ul>
          <li>
            {{ car }}
          </li>
        </ul>
      </div>
      <h3>Traffic Lights</h3>
      <div v-for="trafficLight of trafficLights" :key="trafficLight.id">
        <h4>{{ trafficLight.id }}</h4>
        <ul>
          <li>
            <carbon-circle-solid
              :class="{
                'color-green400': trafficLight.color === 'green',
                'color-red': trafficLight.color === 'red',
              }"
            />
            {{ trafficLight }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
