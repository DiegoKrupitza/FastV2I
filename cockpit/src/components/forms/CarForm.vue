<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

import type { NewCar } from '~/types'

const props = defineProps<{ simulationLength: number }>()
const { simulationLength } = toRefs(props)

const vin = ref(uuidv4())

// TODO: Initialize with random model and oem
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
  <div>
    <FormKit v-model="vin" type="text" :label="t('forms.car.vin')" />
    <FormKit v-model="oem" type="text" :label="t('forms.car.oem')" />
    <FormKit v-model="model" type="text" :label="t('forms.car.model')" />
    <FormKit
      v-model="speed"
      type="number"
      :min="0"
      :step="1"
      :label="t('forms.car.speed')"
    />
    <FormKit
      v-model="delay"
      type="number"
      :min="0"
      :step="1"
      :label="t('forms.car.entry-time')"
    />
    <FormKit
      v-model="location"
      type="number"
      :min="0"
      :max="simulationLength"
      :step="1"
      :label="t('forms.car.location')"
    />
    <FormKit
      v-model="destination"
      type="number"
      :min="0"
      :max="simulationLength"
      :step="1"
      :label="t('forms.car.destination')"
    />
    <Button @click="onConfirm()">{{ t('button.confirm') }}</Button>
  </div>
</template>
