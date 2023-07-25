<template>
  <div class="human-layout flex-v">
    <div class="fix-nav-area">
      <slot name="header">header</slot>
    </div>
    <div class="body-area">
      <slot name="body">body</slot>
    </div>
    <SetPassword
      v-if="showSetPwdPanel"
      :show="showSetPwdPanel"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, onMounted } from "vue"
  import { usePlayerInteractListen } from "@/hooks/human/player"

  import { useGetUserInfo } from "../hooks/user"

  import SetPassword from "@/components/SetPassword.vue"

  const showSetPwdPanel = ref(false)
  const { userInfo } = useGetUserInfo(true)
  const { registerListeners } = usePlayerInteractListen()

  watch(userInfo, (val) => {
    if (val) {
      console.log("watch UserInfo1", val)
      showSetPwdPanel.value = val.passwordStatus === 0
    }
  })

  onMounted(() => {
    registerListeners()
  })
</script>
<style lang="less">
  .human-layout {
    width: 100%;
    height: 100vh;
    background: var(--c-black-1);
    .fix-nav-area {
      width: 100%;
      height: 50px;
      background: var(--c-black-5);
    }
    .body-area {
      width: 100%;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
  }
</style>
