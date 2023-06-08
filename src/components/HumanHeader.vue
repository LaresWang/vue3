<template>
  <div class="fix-human-header flex-between">
    <svg-icon
      name="logo"
      class="human-header-logo"
    />
    <div
      class="user-info-area flex-center pointer"
      @click="goToUserCenter"
    >
      <Avatar
        class="nav-avatar"
        :url="userInfo.userAvatar"
      />
      <span class="user-name single-line-text-ellipsis">{{ userInfo.userName }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { goUserCenter } from "@/utils/jump"
  import useUserInfo from "@/stores/user"

  import Avatar from "./Avatar.vue"

  const { userInfo } = useUserInfo()

  const goToUserCenter = () => {
    goUserCenter()
  }
</script>
<style lang="less">
  .fix-human-header {
    height: 100%;
    padding: 0 20px;
    .human-header-logo {
      height: 40px;
      width: 80px;
    }
    .user-info-area {
      height: 100%;
      .nav-avatar {
        width: 24px;
        height: 24px;
      }
      .user-name {
        margin-left: 8px;
        font-size: 14px;
        max-width: 100px;
        color: var(--c-white-1);
      }
    }
  }
</style>
