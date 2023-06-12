<template>
  <div class="no-more-lists flex-center">
    <span></span>
    <p>{{ props.text || $t("edit.t4") }}</p>
    <span></span>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps<{
    text?: string
  }>()
</script>
<style lang="less">
  .no-more-lists {
    width: 100%;
    margin: 20px 0;
    span {
      width: 30px;
      height: 1px;
      background: var(--c-gray-2);
    }
    p {
      padding: 0 10px;
      font-size: 12px;
      color: var(--c-gray-2);
    }
  }
</style>
