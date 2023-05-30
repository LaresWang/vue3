<template>
  <div class="human-layout flex-v">
    <div class="nav-area">
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
  import { ref, watch } from "vue"

  import { useGetUserInfo } from "../hooks/user"

  import SetPassword from "../views/login/components/SetPassword.vue"

  const showSetPwdPanel = ref(false)
  const { userInfo } = useGetUserInfo()

  watch(userInfo, (val) => {
    if (val) {
      console.log("watch UserInfo1", val)
      showSetPwdPanel.value = val.passwordStatus === 0
    }
  })
</script>
<style lang="less">
  .human-layout {
    width: 100%;
    height: 100vh;
    .nav-area {
      height: 40px;
    }
    .body-area {
      flex: 1;
    }
  }
</style>
