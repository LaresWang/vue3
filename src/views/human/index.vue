<template>
  <DigitalHuman class="human-wrapper">
    <template #header>
      <HumanHeader />
    </template>
    <template #body>
      <RouterView />
    </template>
  </DigitalHuman>
</template>
<script setup lang="ts">
  import DigitalHuman from "@/layouts/DigitalHuman.vue"
  import HumanHeader from "@/components/HumanHeader.vue"
</script>
<style lang="less">
  .human-wrapper {
    color: var(--c-white-1);
  }
</style>
