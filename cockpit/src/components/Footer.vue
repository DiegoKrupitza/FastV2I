<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'

const { t } = useI18n()
</script>

<template>
  <footer class="pa-4 text-center text-sm">
    <button
      class="icon-btn mx-2"
      :title="t('button.toggle_dark')"
      @click="toggleDark()"
    >
      <carbon-moon v-if="isDark" />
      <carbon-sun v-else />
    </button>
  </footer>
</template>
