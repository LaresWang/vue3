<template>
  <div class="human-home flex-between">
    <div class="human-edit-area flex-between">
      <div class="edit-left-area">
        <!-- 根据导航栏上的编辑按钮动态切换左边的菜单组件 -->
        <BodySummaryParts v-show="breadMenus.length > 1" />
      </div>
      <div class="edit-right-area">
        <!-- 根据 默认显示模型列表， 导航栏上的编辑按钮动态切换下面的组件 -->
        <!-- 这里放置 模型列表/模型编辑/表情/动作 组件切换 -->
        <HumanModelLists v-show="breadMenus.length < 2" />
        <component
          v-show="breadMenus.length > 1"
          :is="selectedEditCompNameStore.selectedCompName && comps[selectedEditCompNameStore.selectedCompName]"
        ></component>
        <!-- <EditHeaderPart />
        <EditEmotions />
        <EditActions /> -->
      </div>
    </div>
    <div class="human-player-area">video</div>
  </div>
</template>
<script setup lang="ts">
  import { watchEffect } from "vue"
  import { useBreadcrumbMenusStore, useSelectedEditCompNameStore } from "@/stores/menus"
  import { HumanModelCatgs } from "@/utils/const"
  import { EEditCompName } from "@/types/menus.d"
  // import type { TEditHumanMenu } from "@/types/menus.d"

  import HumanModelLists from "./components/HumanModelLists.vue"
  import BodySummaryParts from "./components/BodySummaryParts.vue"
  import EditHeaderPart from "./components/EditHeaderPart.vue"
  import EditEmotions from "./components/EditEmotions.vue"
  import EditActions from "./components/EditActions.vue"

  const { breadMenus, addBreadMenu } = useBreadcrumbMenusStore()
  const selectedEditCompNameStore = useSelectedEditCompNameStore()

  const comps = {
    [EEditCompName.EditHeaderPart]: EditHeaderPart,
    [EEditCompName.EditEmotions]: EditEmotions,
    [EEditCompName.EditActions]: EditActions
  }

  watchEffect(() => {
    if (!breadMenus.length) {
      addBreadMenu(HumanModelCatgs[0])
    }
  })
</script>
<style lang="less">
  .human-home {
    width: 100%;
    height: 100%;
    .human-edit-area {
      flex: 1;
      height: 100%;
      padding-top: 4px;
      .edit-left-area {
        width: 85px;
        height: 100%;
        padding-right: 2px;
      }
      .edit-right-area {
        flex: 1;
        height: 100%;
      }
    }
    .human-player-area {
      width: 975px;
      height: 100%;
      color: var(--c-white-1);
    }
  }
</style>
