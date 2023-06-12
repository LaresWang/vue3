<!-- 身体主要部位列表 如 头部/手臂/身体/腿/脚等  暂时只支持头部编辑 -->
<template>
  <div class="body-summary-parts">
    <template
      v-for="part in parts"
      :key="part.value"
    >
      <div
        class="body-part flex-v"
        :class="selectedPart === part.value ? 'active' : 'pointer'"
        @click="changeBodyPart(part.value)"
      >
        <svg-icon :name="part.icon" />
        <span>捏脸</span>
      </div>
    </template>
    <!-- 为了调试多个的时候 -->
    <!-- <div
      class="body-part flex-v pointer"
      @click="changeBodyPart('-1')"
    >
      <svg-icon name="icon_face_a" />
      <span>捏脸</span>
    </div> -->
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue"

  const selectedPart = ref("01")
  const parts = [
    {
      label: "头部",
      value: "01",
      icon: "icon_face_a"
    }
  ]

  const changeBodyPart = (value: string) => {
    if (selectedPart.value === value) {
      return
    }
    console.log(value)
  }
</script>
<style lang="less">
  .body-summary-parts {
    height: 100%;
    .body-part {
      width: 100%;
      height: 92px;
      font-size: 12px;
      background: var(--c-black-4);
      margin-bottom: 4px;
      .svg-icon {
        width: 32px;
        height: 32px;
        fill: var(--c-white-1);
      }
      span {
        margin-top: 3px;
      }
      &.active {
        .svg-icon {
          fill: var(--c-blue-1);
        }
        span {
          color: var(--c-blue-1);
        }
      }
    }
  }
</style>
