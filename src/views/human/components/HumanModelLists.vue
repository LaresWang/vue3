<!-- 平台内置数字人模型/用户创建的数字人模型 -->
<template>
  <div class="human-models flex-v">
    <div class="model-tab-area flex-center">
      <div class="fix-tab-wrapper flex-center">
        <div
          v-for="item in HumanModelCatgs"
          :key="item.value"
          class="tab-item flex-center"
          :class="breadcrumbMenusStore.currentModelCat === item.value ? 'active' : 'pointer'"
          @click="changeModelList(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <div
      class="model-lists"
      :class="breadcrumbMenusStore.currentModelCat === EModelCatg.Buildin ? 'builin-lists' : ''"
    >
      <ModelsFromBuildin
        :key="modelBuildinKey"
        :show="breadcrumbMenusStore.currentModelCat === EModelCatg.Buildin"
        @submitName="onSubmitName"
      />
      <ModelsFromUser
        :key="modelUserKey"
        :show="breadcrumbMenusStore.currentModelCat === EModelCatg.User"
        @submitName="onSubmitName"
      />
    </div>
    <div class="model-operate-area fix-model-operate-area flex-between">
      <div
        class="icons-group flex-center"
        v-if="breadcrumbMenusStore.currentModelCat === EModelCatg.User"
      >
        <div
          class="icon-wrapper flex-center"
          :class="deleteHumanModelStore.isDeleting ? 'forbidden' : 'pointer'"
          @click="deleteModel"
        >
          <svg-icon name="icon_delete" />
        </div>
        <div
          class="icon-wrapper flex-center pointer"
          :class="copyHumanModelStore.isCopying ? '' : 'pointer'"
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
      <div v-else></div>
      <el-button
        class="operate-btn"
        type="primary"
        @click="createModel"
      >
        {{ breadcrumbMenusStore.currentModelCat === EModelCatg.User ? $t("edit.t3") : $t("edit.t14") }}
      </el-button>
    </div>
    <Modal
      v-model:show="showModal"
      :title="modalInfo?.title"
      :content="modalInfo?.content"
      :type="modalInfo?.type"
      @confirm="confirmModal"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue"
  import { HumanModelCatgs } from "@/utils/const"
  import { useSelectedModelInfoStore, useRefreshHumanListsStore, useCopyHumanModelStore, useDeleteHumanModelStore } from "@/stores/human"
  import { useBreadcrumbMenusStore, useSelectedEditCompNameStore } from "@/stores/menus"
  import { EModelCatg } from "@/types/human.d"
  import type { TModal, TObj } from "@/types"
  import type { THumanModelInfos } from "@/types/human"
  import type { TBreadcrumbMenu } from "@/types/menus"
  import message from "@/utils/message"
  import { t } from "@/locale"

  import ModelsFromBuildin from "./ModelsFromBuildin.vue"
  import ModelsFromUser from "./ModelsFromUser.vue"
  import Modal from "@/components/Modal.vue"

  const modelUserKey = ref(0)
  const modelBuildinKey = ref(0)
  const showModal = ref(false)
  const modalInfo = ref<TModal>()
  const refreshHumanListsStore = useRefreshHumanListsStore()
  const breadcrumbMenusStore = useBreadcrumbMenusStore()
  const selectedEditCompNameStore = useSelectedEditCompNameStore()
  const selectedModelInfoStore = useSelectedModelInfoStore()
  const copyHumanModelStore = useCopyHumanModelStore()
  const deleteHumanModelStore = useDeleteHumanModelStore()

  watchEffect(() => {
    if (refreshHumanListsStore.refreshCount && refreshHumanListsStore.refreshListType === EModelCatg.User) {
      refreshHumanListsStore.resetRefresh()
      // 强制刷新组件
      modelUserKey.value++
    } else if (refreshHumanListsStore.refreshCount && refreshHumanListsStore.refreshListType === EModelCatg.Buildin) {
      refreshHumanListsStore.resetRefresh()
      modelBuildinKey.value++
    }
  })

  const changeModelList = (item: TBreadcrumbMenu) => {
    if (breadcrumbMenusStore.currentModelCat === item.value) {
      return
    }

    selectedModelInfoStore.clearSelectedModelInfo()
    breadcrumbMenusStore.updateRootMenu({
      ...item,
      canJump: true
    })
  }

  // 不排除有多个模型正在修改name，接口响应很慢，然后用户修改了多个模型名称
  let submitStatusRecord: TObj = {}
  let submitNameRecord: TObj = {}
  const onSubmitName = (isSubmiting: boolean, infos: THumanModelInfos, name?: string) => {
    submitStatusRecord[infos.humanId] = isSubmiting
    if (name) {
      submitNameRecord[infos.humanId] = name
    }
    if (!isSubmiting && isCreatingModel && infos.humanId === selectedModelInfoStore.info.humanId) {
      isCreatingModel = false
      showEditModelPage()
    }
  }

  let isCreatingModel = false
  const createModel = () => {
    if (isCreatingModel) {
      return
    }
    isCreatingModel = true

    if (!selectedModelInfoStore.info.humanName || selectedModelInfoStore.info.humanCatg !== breadcrumbMenusStore.currentModelCat) {
      message("请先选择数字人", "warning")
      isCreatingModel = false
      return
    }
    // 在点击创建的时候可能会触发修改名称输入框的blur事件，需要等修改提交响应结果后再进入下一步
    setTimeout(() => {
      if (!submitStatusRecord[selectedModelInfoStore.info.humanId] && isCreatingModel) {
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

    // delete submitNameRecord[humanId]
    // delete submitStatusRecord[humanId]
  }

  const deleteModel = () => {
    console.log("deleteModel")
    if (deleteHumanModelStore.isDeleting) {
      return
    }

    if (!selectedModelInfoStore.info.humanName || selectedModelInfoStore.info.humanCatg !== breadcrumbMenusStore.currentModelCat) {
      message("请先选择数字人", "warning")
      // isDeleting = false
      return
    }
    showModal.value = true
    modalInfo.value = {
      title: t("edit.t11"),
      content: t("edit.t12", { value: selectedModelInfoStore.info.humanName }),
      type: 0
    }
  }

  const confirmModal = () => {
    showModal.value = false
    deleteHumanModelStore.startDelete(
      selectedModelInfoStore.info.humanId,
      selectedModelInfoStore.info.humanNo,
      selectedModelInfoStore.info.humanCatg!
    )
  }

  const copyModel = () => {
    console.log("copyModel")
    if (copyHumanModelStore.isCopying) {
      return
    }

    if (!selectedModelInfoStore.info.humanName || selectedModelInfoStore.info.humanCatg !== breadcrumbMenusStore.currentModelCat) {
      message("请先选择数字人", "warning")
      return
    }
    copyHumanModelStore.startCopy(selectedModelInfoStore.info.humanId, selectedModelInfoStore.info.humanCatg, selectedModelInfoStore.info.humanNo)
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
          border-radius: 4px;
          &.active {
            background: var(--c-black-6);
          }
        }
      }
    }
    .model-lists {
      width: 100%;
      flex: 1;
      padding: 24px 5px 0 5px;
      min-height: 0;
      overflow: hidden;
      &.builin-lists {
        padding-top: 0;
      }
    }
    .model-operate-area {
      padding: 0 20px 0 8px;
      .icons-group {
        .icon-wrapper {
          margin-left: 8px;
        }
      }
    }
    .fix-model-operate-area {
      width: 100%;
      height: 56px;

      background: var(--c-black-5);
      .icons-group {
        .icon-wrapper {
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
        width: 72px;
        height: 28px;
      }
    }
  }
</style>
