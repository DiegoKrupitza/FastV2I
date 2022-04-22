<script setup lang="ts">
import type { NewTrafficLight } from '~/types'

const props = defineProps<{ trafficLight: NewTrafficLight }>()

const { trafficLight } = toRefs(props)

const emit = defineEmits<{
  (eventName: 'delete', id: string): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-2 card">
    <span class="font-bold">{{ trafficLight.id }}</span>
    <span>
      {{ t('forms.traffic-light.position') }}: {{ trafficLight.position }}
    </span>
    <span>
      {{ t('forms.traffic-light.scan-distance') }}:
      {{ trafficLight.scanDistance }}
    </span>
    <span>
      {{ t('forms.traffic-light.entry-delay') }}: {{ trafficLight.entryDelay }}
    </span>
    <span>
      {{ t('forms.traffic-light.state-hold-seconds') }}:
      {{ trafficLight.stateHoldSeconds }}
    </span>
    <carbon-trash-can
      class="icon-btn bg-red op100 shadow"
      @click="emit('delete', trafficLight.id)"
    />
  </div>
</template>
