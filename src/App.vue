<script setup lang="ts">
  import { RouterView } from "vue-router"
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
  header {
    line-height: 1.5;
    max-height: 100vh;
  }

  .logo {
    display: block;
    margin: 0 auto 2rem;
  }

  nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
  }

  nav a.router-link-exact-active {
    color: var(--color-text);
  }

  nav a.router-link-exact-active:hover {
    background-color: transparent;
  }

  nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
  }

  nav a:first-of-type {
    border: 0;
  }

  @media (min-width: 1024px) {
    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
      margin: 0 2rem 0 0;
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }

    nav {
      text-align: left;
      margin-left: -1rem;
      font-size: 1rem;

      padding: 1rem 0;
      margin-top: 1rem;
    }
  }
</style>
