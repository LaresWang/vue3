<!-- 平台内置数字人模型/用户创建的数字人模型 -->
<template>
  <div class="human-models flex-v">
    <div class="model-tab-area flex-center">
      <div class="fix-tab-wrapper flex-center">
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
        @submitName="onSubmitName"
      />
      <ModelsFromUser
        :key="modelUserKey"
        :show="breadcrumbMenusStore.currentModelCat === EModelCatg.User"
        @submitName="onSubmitName"
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
  import { ref, watchEffect } from "vue"
  import { HumanModelCatgs } from "@/utils/const"
  import useSaveHumanModelStore from "@/stores/saveModel"
  import { useSelectedModelInfoStore } from "@/stores/human"
  import { useBreadcrumbMenusStore, useSelectedEditCompNameStore } from "@/stores/menus"
  import { EModelCatg } from "@/types/human.d"
  import type { TEmptyObj } from "@/types"
  import type { THumanModelInfos } from "@/types/human"
  import type { TBreadcrumbMenu } from "@/types/menus"
  import message from "@/utils/message"

  import ModelsFromBuildin from "./ModelsFromBuildin.vue"
  import ModelsFromUser from "./ModelsFromUser.vue"

  const modelUserKey = ref(0)
  const breadcrumbMenusStore = useBreadcrumbMenusStore()
  const selectedEditCompNameStore = useSelectedEditCompNameStore()
  const selectedModelInfoStore = useSelectedModelInfoStore()
  const saveHumanModelStore = useSaveHumanModelStore()

  watchEffect(() => {
    if (saveHumanModelStore.result === "ok") {
      saveHumanModelStore.resetResult()

      console.log("保存成功后更新列表")
      // 显示我的数字人tab
      // const item = HumanModelCatgs.find((info) => info.value === EModelCatg.User)
      // changeModelList(item!)
      // 强制刷新组件
      modelUserKey.value++
    }
  })

  const changeModelList = (item: TBreadcrumbMenu) => {
    if (breadcrumbMenusStore.currentModelCat === item.value) {
      return
    }
    breadcrumbMenusStore.updateRootMenu({
      ...item,
      canJump: true
    })
  }

  // 不排除有多个模型正在修改name，接口响应很慢，然后用户修改了多个模型名称
  let submitStatusRecord: TEmptyObj = {}
  let submitNameRecord: TEmptyObj = {}
  const onSubmitName = (isSubmiting: boolean, infos: THumanModelInfos, name?: string) => {
    submitStatusRecord[infos.humanId] = isSubmiting
    if (name) {
      submitNameRecord[infos.humanId] = name
    }
    if (!isSubmiting && isCreatingModel && infos.humanId === selectedModelInfoStore.info.humanId) {
      isCreatingModel = false
      showEditModelPage()
    } else {
      delete submitNameRecord[infos.humanId]
      delete submitStatusRecord[infos.humanId]
    }
  }

  let isCreatingModel = false
  const createModel = () => {
    if (isCreatingModel) {
      return
    }
    isCreatingModel = true

    if (!selectedModelInfoStore.info.humanName || selectedModelInfoStore.info.humanCatg !== breadcrumbMenusStore.currentModelCat) {
      message("需要先选择模型", "warning")
      isCreatingModel = false
      return
    }
    // 在点击创建的时候可能会触发修改名称输入框的blur事件，需要等修改提交响应结果后再进入下一步
    setTimeout(() => {
      if (!submitStatusRecord[selectedModelInfoStore.info.humanId]) {
        isCreatingModel = false
        showEditModelPage()
      }
    }, 300)
  }

  const showEditModelPage = () => {
    selectedEditCompNameStore.initSelectCompName()
    const humanId = selectedModelInfoStore.info.humanId
    breadcrumbMenusStore.addBreadMenu({
      value: humanId,
      label: submitNameRecord[humanId] || selectedModelInfoStore.info.humanName
    })

    delete submitNameRecord[humanId]
    delete submitStatusRecord[humanId]
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
      .fix-tab-wrapper {
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
