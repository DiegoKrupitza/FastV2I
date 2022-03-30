<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <nav class="text-xl my-4 text-center">
    <router-link
      class="icon-btn mx-2"
      to="/"
      :title="t('button.home')"
      active-class="!text-$primary op90"
    >
      <carbon-home />
    </router-link>
  </nav>
</template>
