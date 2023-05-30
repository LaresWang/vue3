<template>
  <div class="box">
    111111
    <slot></slot>
    <ElButton @click="changeTheme">改变颜色</ElButton>
  </div>
</template>
<script setup lang="ts">
  const changeTheme = () => {
    const root = document.querySelector(":root")
    if (!root) {
      return
    }
    const rootEl = root as HTMLElement
    // const computedStyle = getComputedStyle(rootEl)
    // console.log(computedStyle)
    // const themeColor = computedStyle.getPropertyValue("--theme-color")
    // console.log(themeColor)

    // 动态变更主题色
    rootEl.style.setProperty("--theme-color", "#0ff")
    rootEl.style.setProperty("--text-color", "#000")
  }
</script>

<style lang="less">
  .box {
    background-color: var(--theme-color);
    color: var(--text-color);
  }
</style>
