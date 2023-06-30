<template>
  <teleport to="body">
    <div
      class="abnormal-tip flex-center"
      v-show="abnormalTipStore.info?.show"
    >
      <div class="left-area flex-center">
        <svg-icon
          name="logo"
          class="fix-logo"
        />
        <div class="tip-body">
          <div class="tip-content flex-center">
            {{ abnormalTipStore.info?.content }}
          </div>
          <div class="tip-mark flex-center">
            {{ abnormalTipStore.info?.mark }}
          </div>
        </div>
      </div>
      <div
        class="right-area"
        ref="abnormalPic"
      ></div>
    </div>
  </teleport>
</template>
<script setup lang="ts">
  import { ref } from "vue"
  import useBgPicSize from "@/hooks/bgPicSize"
  import useAbnormalTipStore from "@/stores/abnormalTip"

  const abnormalTipStore = useAbnormalTipStore()
  const abnormalPic = ref<HTMLElement>()

  useBgPicSize(abnormalPic, 975 / 812)
</script>
<style lang="less">
  .abnormal-tip {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: var(--c-black-4);
    z-index: 10000;
    .right-area {
      width: var(--right-area-width);
      height: 100%;
      background-image: url("@/assets/imgs/abnormal-pic.png");
      background-position: center center;
      background-repeat: no-repeat;
    }
    .left-area {
      height: 100%;
      flex: 1;
      position: relative;
      .fix-logo {
        position: absolute;
        width: 80px;
        height: 40px;
        top: 5px;
        left: 15px;
      }
      .tip-body {
        width: 100%;
        color: var(--c-white-1);
        .tip-content {
          font-size: 35px;
          font-weight: 500;
          line-height: 50px;
        }
        .tip-mark {
          width: 100%;
          margin-top: 56px;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }
</style>
