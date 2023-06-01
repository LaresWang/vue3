<template>
  <div class="avatar-wrapper">
    <img
      v-if="headerUrl"
      :src="headerUrl"
      alt=""
      @error="loadError"
    />
    <img
      v-else
      src="@/assets/imgs/default_avatar.png"
      alt=""
    />
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue"

  const props = defineProps<{
    url?: string
  }>()

  const headerUrl = ref("")

  watchEffect(() => {
    headerUrl.value = props.url || ""
  })

  const loadError = () => {
    headerUrl.value = ""
  }
</script>

<style lang="less">
  .avatar-wrapper {
    width: 100%;
    height: 100%;
    background: #ddd;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
