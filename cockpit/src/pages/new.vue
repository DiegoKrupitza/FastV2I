<script setup lang="ts">
import { useSimulation, useValidation } from '~/composables'
import type { NewCar, NewSimulation, NewTrafficLight } from '~/types'

const { isSimulationActive, startSimulation } = useSimulation()

const router = useRouter()

watch(
  isSimulationActive,
  () => {
    if (isSimulationActive.value) {
      router.push('/')
    }
  },
  { immediate: true }
)

const scenarioLength = ref(15000)
const enableTimelapse = ref(false)

const trafficLights = ref<Record<string, NewTrafficLight>>({})

function addTrafficLight(trafficLight: NewTrafficLight) {
  trafficLights.value = {
    ...trafficLights.value,
    [trafficLight.id]: trafficLight,
  }
}

function removeTrafficLight(id: string) {
  const lights = trafficLights.value ?? {}
  delete lights[id]
  trafficLights.value = lights
}

const cars = ref<Record<string, NewCar>>({})

function addCar(car: NewCar) {
  cars.value = {
    ...cars.value,
    [car.vin]: car,
  }
}

function removeCar(vin: string) {
  const localCars = cars.value ?? {}
  delete localCars[vin]
  cars.value = localCars
}

const validationError = useValidation({ cars, trafficLights })

async function submit() {
  const config: NewSimulation = {
    cars: Object.values(cars.value),
    scenarioLength: scenarioLength.value,
    timelapse: enableTimelapse.value,
    trafficLights: Object.values(trafficLights.value),
  }
  await startSimulation(config)
}

// TODO: Randomize config
async function startRandom() {
  const config: NewSimulation = {
    trafficLights: [
      {
        id: 'T1',
        position: 4000, // m
        scanDistance: 1500, // m
        entryDelay: 0, // ms
        stateHoldSeconds: 10, // s
      },
      {
        id: 'T2',
        position: 8000,
        scanDistance: 2000,
        entryDelay: 0,
        stateHoldSeconds: 10,
      },
      {
        id: 'T3',
        position: 12000,
        scanDistance: 1000,
        entryDelay: 0,
        stateHoldSeconds: 10,
      },
    ],
    cars: [
      {
        vin: 'V1',
        oem: 'VW',
        model: 'Caddy',
        entryTime: 0, // ms
        speed: 50, // m/s
        location: 0, // m
        destination: 18000, // m
      },
      {
        vin: 'V2',
        oem: 'BMW',
        model: 'Z4',
        entryTime: 0,
        speed: 30,
        location: 18000,
        destination: 0,
      },
    ],
    scenarioLength: 18000, // m
    timelapse: false,
  }
  await startSimulation(config)
}

const { t } = useI18n()
</script>

<template>
  <div class="w-full">
    <div>
      <div class="flex flex-col gap-2 pa-4">
        <div class="flex gap-2">
          <Button
            :disabled="isSimulationActive || validationError"
            class="max-w-16"
            @click="submit()"
          >
            {{ t('button.start') }}
          </Button>
          <Button
            :disabled="isSimulationActive"
            class="max-w-16"
            @click="startRandom()"
          >
            {{ t('button.random') }}
          </Button>
        </div>
        <span v-if="validationError" class="color-red">
          {{ validationError }}
        </span>
      </div>
      <div class="flex flex-col gap-2 pa-4">
        <FormKit
          v-model="scenarioLength"
          type="number"
          :label="t('forms.simulation.length')"
        />
        <FormKit
          v-model="enableTimelapse"
          type="checkbox"
          :label="t('forms.simulation.enable-timelapse')"
        />
      </div>
    </div>
    <div
      class="flex flex-col md-flex-row gap-4 children:flex children:flex-col children:gap-4 children:flex-1 children:pa-4"
    >
      <section>
        <h2>{{ t('forms.traffic-light.title') }}</h2>
        <TrafficLightForm
          :simulation-length="+scenarioLength"
          @create="addTrafficLight"
        />
        <masonry-wall
          v-slot="{ item: trafficLight }"
          :items="Object.values(trafficLights)"
          :column-width="300"
          :gap="16"
        >
          <NewTrafficLight
            :traffic-light="trafficLight"
            @delete="removeTrafficLight"
          />
        </masonry-wall>
      </section>
      <section>
        <h2>{{ t('forms.car.title') }}</h2>
        <CarForm :simulation-length="+scenarioLength" @create="addCar" />
        <masonry-wall
          v-slot="{ item: car }"
          :items="Object.values(cars)"
          :column-width="300"
          :gap="16"
        >
          <NewCar :car="car" @delete="removeCar" />
        </masonry-wall>
      </section>
    </div>
  </div>
</template>
