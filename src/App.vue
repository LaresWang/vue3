<script setup lang="ts">
  import { provide } from "vue"
  import { RouterView } from "vue-router"
  import { isSafari } from "@/utils/browser"
  provide("isSafari", isSafari())
  // import HelloWorld from './components/HelloWorld.vue'
  // document.body.addEventListener("keydown", function (event: KeyboardEvent) {
  //   console.log("app evemt", event)
  // })
  // 没有在该页面有任何操作，或者是操作时间间隔太短，所以不会有提示。
  // 打开该页面后，在该页面没有任何操作，不会有提示，在input中输入文字或者其他信息，刷新/返回/关闭该页面都会有提示；刷新/返回/关闭操作时间间隔太短有时有提示，有时没有。
  // 所以只有在该页面有操作，并且时间间隔大于5秒左右即会有提示。
  // window.onbeforeunload = function (e) {
  //   const ee = e || window.event
  //   ee.preventDefault()
  //   // ee.returnValue = "真要离开此页面吗"
  //   return false
  // }
</script>

<template>
  <RouterView />
</template>

<style lang="less">
  @import url(@/assets/css/base.less);
</style>
