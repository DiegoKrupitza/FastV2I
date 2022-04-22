<script setup lang="ts">
import { useSimulationPolling } from '~/composables'

const { t } = useI18n()

useHead({
  title: t('meta.title'),
  meta: [
    {
      name: 'description',
      content: t('meta.description'),
    },
  ],
})

useSimulationPolling()
</script>

<template>
  <router-view />
</template>
