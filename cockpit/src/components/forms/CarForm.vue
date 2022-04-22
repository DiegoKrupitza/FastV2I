<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

import type { NewCar } from '~/types'

const props = defineProps<{ simulationLength: number }>()
const { simulationLength } = toRefs(props)

const vin = ref(uuidv4())

const oem = ref('')
const model = ref('')
const speed = ref(50)
const delay = ref(0)
const location = ref(0)
const destination = ref(simulationLength.value ?? 0)

const emit = defineEmits<{
  (eventName: 'create', car: NewCar): void
}>()

function onConfirm() {
  emit('create', {
    vin: vin.value,
    oem: oem.value,
    model: oem.value,
    entryTime: delay.value,
    speed: speed.value,
    location: location.value,
    destination: destination.value,
  })
  vin.value = uuidv4()
}

const { t } = useI18n()
</script>

<template>
  <FormKit type="form" @submit="onConfirm">
    <FormKit
      v-model="vin"
      type="text"
      :label="t('forms.car.vin')"
      validation="required"
    />
    <FormKit
      v-model="oem"
      type="text"
      :label="t('forms.car.oem')"
      validation="required"
    />
    <FormKit
      v-model="model"
      type="text"
      :label="t('forms.car.model')"
      validation="required"
    />
    <FormKit
      v-model="speed"
      type="number"
      :min="0"
      :step="1"
      :label="t('forms.car.speed')"
      validation="required"
    />
    <FormKit
      v-model="delay"
      type="number"
      :min="0"
      :step="1"
      :label="t('forms.car.entry-time')"
      validation="required"
    />
    <FormKit
      v-model="location"
      type="number"
      :min="0"
      :max="simulationLength"
      :step="1"
      :label="t('forms.car.location')"
      validation="required"
    />
    <FormKit
      v-model="destination"
      type="number"
      :min="0"
      :max="simulationLength"
      :step="1"
      :label="t('forms.car.destination')"
      validation="required"
    />
  </FormKit>
</template>
