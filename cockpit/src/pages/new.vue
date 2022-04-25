<script setup lang="ts">
import { v4 } from 'uuid'

import {
  useBackend,
  useRandomSimulation,
  useSimulation,
  useValidation,
} from '~/composables'
import type { NewCar, NewSimulation, NewTrafficLight } from '~/types'

const { isSimulationActive, startSimulation } = useSimulation()

const router = useRouter()

const { t } = useI18n()
const { success } = useToast()

watch(
  isSimulationActive,
  () => {
    if (isSimulationActive.value) {
      const message = t('toasts.simulation.started')
      success(message, { id: message })
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

const validationError = useValidation({ cars, scenarioLength, trafficLights })

async function submit() {
  const config: NewSimulation = {
    id: v4(),
    cars: Object.values(cars.value),
    scenarioLength: scenarioLength.value,
    timelapse: enableTimelapse.value,
    trafficLights: Object.values(trafficLights.value),
    done: false,
  }
  await startSimulation(config)
}

const createRandomSimulation = useRandomSimulation(enableTimelapse)
async function startRandom() {
  await startSimulation(createRandomSimulation())
}

const { isReady } = useBackend()
</script>

<template>
  <div class="w-full">
    <div>
      <div class="flex flex-col gap-2 pa-4">
        <div class="flex gap-2">
          <Button
            :disabled="!isReady || isSimulationActive || validationError"
            class="btn-green"
            @click="submit()"
          >
            {{ t('button.start') }}
          </Button>
          <Button
            :disabled="!isReady || isSimulationActive"
            class="btn-green"
            @click="startRandom()"
          >
            {{ t('button.random') }}
          </Button>
        </div>
        <span v-if="!isReady" class="color-red">
          {{ t('service-unavailable') }}
        </span>
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
