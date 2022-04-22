<script setup lang="ts">
import type { NewCar } from '~/types'

const props = defineProps<{ car: NewCar }>()

const { car } = toRefs(props)

const emit = defineEmits<{
  (eventName: 'delete', vin: string): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-2 card">
    <span class="font-bold">{{ car.vin }}</span>
    <span>{{ t('forms.car.oem') }}: {{ car.oem }}</span>
    <span>{{ t('forms.car.model') }}: {{ car.model }}</span>
    <span>{{ t('forms.car.entry-time') }}: {{ car.entryTime }}</span>
    <span>{{ t('forms.car.speed') }}: {{ car.speed }}</span>
    <span>{{ t('forms.car.location') }}: {{ car.location }}</span>
    <span>{{ t('forms.car.destination') }}: {{ car.destination }}</span>
    <carbon-trash-can
      class="icon-btn bg-red op100 shadow"
      @click="emit('delete', car.vin)"
    />
  </div>
</template>
