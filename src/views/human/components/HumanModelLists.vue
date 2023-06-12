<!-- 平台内置数字人模型/用户创建的数字人模型 -->
<template>
  <div class="human-models flex-v">
    <div class="model-tab-area flex-center">
      <div class="tab-wrapper flex-center">
        <div
          v-for="item in HumanModelCatgs"
          :key="item.value"
          class="tab-item flex-start"
          :class="breadcrumbMenusStore.currentModelCat === item.value ? 'active' : 'pointer'"
          @click="changeModelList(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="model-lists">
      <ModelsFromBuildin
        :show="breadcrumbMenusStore.currentModelCat === EModelCatg.Buildin"
        @select="onSelectModel"
      />
      <ModelsFromUser
        :show="breadcrumbMenusStore.currentModelCat === EModelCatg.User"
        @select="onSelectModel"
      />
    </div>
    <div class="model-operate-area flex-between">
      <div class="icons-group flex-center">
        <div
          class="icon-wrapper flex-center pointer"
          @click="deleteModel"
        >
          <svg-icon name="icon_delete" />
        </div>
        <div
          class="icon-wrapper flex-center pointer"
          @click="copyModel"
        >
          <svg-icon name="icon_copy" />
        </div>
        <div
          class="icon-wrapper flex-center pointer"
          @click="importFile"
        >
          <svg-icon name="icon_import" />
        </div>
        <div
          class="icon-wrapper flex-center pointer"
          @click="exportFile"
        >
          <svg-icon name="icon_export" />
        </div>
      </div>
      <el-button
        class="operate-btn"
        type="primary"
        @click="createModel"
      >
        {{ $t("edit.t3") }}
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { HumanModelCatgs } from "@/utils/const"
  import { useBreadcrumbMenusStore, useSelectedEditCompNameStore } from "@/stores/menus"
  import { EModelCatg } from "@/types/human.d"
  import type { THumanModelInfos } from "@/types/human"
  import type { TBreadcrumbMenu } from "@/types/menus"

  import ModelsFromBuildin from "./ModelsFromBuildin.vue"
  import ModelsFromUser from "./ModelsFromUser.vue"

  const breadcrumbMenusStore = useBreadcrumbMenusStore()
  const selectedEditCompNameStore = useSelectedEditCompNameStore()

  const changeModelList = (item: TBreadcrumbMenu) => {
    if (breadcrumbMenusStore.currentModelCat === item.value) {
      return
    }
    breadcrumbMenusStore.updateRootMenu({
      ...item,
      canJump: true
    })
  }

  let selectedModel: TBreadcrumbMenu = {
    value: "",
    label: ""
  }
  const onSelectModel = (infos: THumanModelInfos) => {
    selectedModel.value = infos.humanId
    selectedModel.label = infos.humanName
  }
  const createModel = () => {
    if (!selectedModel.label) {
      console.log("需要先选择模型")
      return
    }

    selectedEditCompNameStore.initSelectCompName()
    breadcrumbMenusStore.addBreadMenu({
      ...selectedModel
    })
  }

  const deleteModel = () => {
    console.log("deleteModel")
  }

  const copyModel = () => {
    console.log("copyModel")
  }

  const importFile = () => {
    console.log("importFile")
  }

  const exportFile = () => {
    console.log("exportFile")
  }
</script>
<style lang="less">
  .human-models {
    // width: 100%;
    height: 100%;
    background: var(--c-black-10);
    .model-tab-area {
      width: 100%;
      height: 78px;
      background: var(--c-black-5);
      .tab-wrapper {
        width: fit-content;
        min-width: 200px;
        height: 30px;
        min-height: 30px;
        font-size: 12px;
        border: 2px solid var(--c-black-9);
        border-radius: 4px;
        background: var(--c-black-8);
        .tab-item {
          width: 50%;
          min-width: 100px;
          height: 100%;
          padding-left: 10px;
          padding-right: 8px;
          background: var(--c-black-6);
          border-radius: 4px;
          &.active {
            background: transparent;
          }
        }
      }
    }
    .model-lists {
      width: 100%;
      flex: 1;
      padding: 5px;
      min-height: 0;
      overflow: hidden;
    }
    .model-operate-area {
      width: 100%;
      height: 56px;
      padding: 0 20px 0 8px;
      background: var(--c-black-5);
      .icons-group {
        .icon-wrapper {
          margin-left: 8px;
          width: 28px;
          height: 28px;
          background: var(--c-gray-5);
          .svg-icon {
            width: 20px;
            height: 20px;
          }
        }
      }
      .operate-btn {
        width: fit-content;
        height: fit-content;
        padding: 4px 8px;
      }
    }
  }
</style>
