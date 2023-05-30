<template>
  <DigitalHuman>
    <template #header>
      <div>header 1111</div>
    </template>
    <template #body>
      <RouterView />
    </template>
  </DigitalHuman>
</template>
<script setup lang="ts">
  import DigitalHuman from "@/layouts/DigitalHuman.vue"
</script>
<style lang="less"></style>
