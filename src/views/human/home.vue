<template>
  <div class="human-home">
    human home
    <div>
      {{ userInfo }}
    </div>
  </div>
</template>
<script setup lang="ts">
  // import { unref, watch } from "vue"
  import useUserInfo from "@/stores/user"
  const { userInfo } = useUserInfo()
  // console.log(unref(info.value))
  // watch(info, (val) => {
  //   console.log("-=======", val)
  // })
</script>
<style lang="less">
  .human-home {
    width: 100%;
  }
</style>
