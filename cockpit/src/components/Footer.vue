<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'

const { t } = useI18n()
</script>

<template>
  <footer class="position-fixed bottom-2 right-2">
    <button
      class="icon-btn"
      :title="t('button.toggle_dark')"
      @click="toggleDark()"
    >
      <carbon-moon v-if="isDark" />
      <carbon-sun v-else />
    </button>
  </footer>
</template>
