<script setup lang="ts">
import moment from 'moment'

const props = withDefaults(defineProps<{ date: string; format?: string }>(), {
  format: 'DD.MM.YYYY HH:mm:ss',
})

const { date, format } = toRefs(props)

const formattedDate = computed(() =>
  moment(date.value).format(format.value).toString()
)
</script>

<template>
  <span>{{ formattedDate }}</span>
</template>
