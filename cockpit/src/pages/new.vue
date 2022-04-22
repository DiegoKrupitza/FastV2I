<script setup lang="ts">
import { useSimulation, useValidation } from '~/composables'
import type { NewCar, NewTrafficLight } from '~/types'

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

const { t } = useI18n()
</script>

<template>
  <div class="w-full">
    <div class="flex flex-col gap-2 pa-4">
      <Button
        :disabled="isSimulationActive || validationError"
        class="max-w-16"
        @click="startSimulation()"
      >
        {{ t('button.start') }}
      </Button>
      <span v-if="validationError" class="color-red">
        {{ validationError }}
      </span>
    </div>
    <div
      class="flex flex-col md-flex-row gap-4 children:flex children:flex-col children:gap-4 children:flex-1 children:pa-4"
    >
      <section>
        <h2>{{ t('forms.traffic-light.title') }}</h2>
        <TrafficLightForm :simulation-length="1000" @create="addTrafficLight" />
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
        <CarForm :simulation-length="1000" @create="addCar" />
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
