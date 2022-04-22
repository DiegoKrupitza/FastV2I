<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

import type { NewTrafficLight } from '~/types'

const props = defineProps<{ simulationLength: number }>()
const { simulationLength } = toRefs(props)

const id = ref(uuidv4())
const position = ref(0)
const scanDistance = ref(0)
const delay = ref(0)
const interval = ref(1)

const emit = defineEmits<{
  (eventName: 'create', trafficLight: NewTrafficLight): void
}>()

function onConfirm() {
  emit('create', {
    id: id.value,
    position: position.value,
    scanDistance: scanDistance.value,
    entryDelay: delay.value,
    stateHoldSeconds: interval.value,
  })
  id.value = uuidv4()
}

const { t } = useI18n()
</script>

<template>
  <div>
    <FormKit v-model="id" type="text" :label="t('forms.traffic-light.id')" />
    <FormKit
      v-model="position"
      type="number"
      :min="0"
      :max="simulationLength"
      :step="1"
      :label="t('forms.traffic-light.position')"
    />
    <FormKit
      v-model="scanDistance"
      type="number"
      :min="0"
      :step="1"
      :label="t('forms.traffic-light.scan-distance')"
    />
    <FormKit
      v-model="delay"
      type="number"
      :min="0"
      :step="1"
      :label="t('forms.traffic-light.entry-delay')"
    />
    <FormKit
      v-model="interval"
      type="number"
      :min="1"
      :step="1"
      :label="t('forms.traffic-light.state-hold-seconds')"
    />
    <Button @click="onConfirm()">{{ t('button.confirm') }}</Button>
  </div>
</template>
