<template>
  <div
    class="model-item flex-v"
    @click="onSelect(props.infos)"
  >
    <div
      class="model-pic-frame flex-center pointer"
      :class="selectedModelInfoStore.selectedHumanModelId === props.infos.humanId ? 'selected' : ''"
    >
      <!-- <img
        v-if="loadNetPic"
        :src="props.infos.previewUrl"
        @error="loadPicError"
        alt=""
      />
      <img
        v-else
        src="@/assets/imgs/list_default_pic.png"
        alt=""
      /> -->
      <div
        class="loading-icon"
        v-if="isLoading"
      >
        <el-icon><Loading /></el-icon>
      </div>
      <img
        src="@/assets/svgs/icon_modal_avatar.svg"
        ref="avatar"
      />
    </div>
    <div class="model-name flex-start">
      <div
        class="model-name-inner flex-start"
        v-if="!props.isEditName"
      >
        <!-- <span class="single-line-text-ellipsis">{{ props.infos.humanName }}</span> -->
        <TextWrapper :text="modelName" />
        <svg-icon
          v-if="props.type !== EModelCatg.Buildin"
          class="pointer"
          name="icon_modify"
          @click="onEditName(props.infos.humanId)"
        />
      </div>
      <div
        v-else
        class="edit-name-area"
      >
        <el-input
          ref="input"
          class="edit-name"
          v-model="modelName"
          @blur="onBlur"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, onMounted, onUpdated } from "vue"
  import { Loading } from "@element-plus/icons-vue"
  import { modifyHumanName } from "@/api/human"
  import { useSelectedModelInfoStore } from "@/stores/human"
  import { EModelCatg } from "@/types/human.d"
  import type { THumanModelInfos } from "@/types/human"

  import TextWrapper from "@/components/TextWrapper.vue"

  type TModelItemProps = {
    infos: THumanModelInfos
    type: EModelCatg
    isEditName: boolean
    newName?: string
  }
  const props = defineProps<TModelItemProps>()
  const emits = defineEmits(["select", "submitName", "editName"])

  const isLoading = ref(true)
  const avatar = ref<HTMLImageElement>()
  const modelName = ref("")
  const input = ref()
  let loadingPicStatus = "0"

  const selectedModelInfoStore = useSelectedModelInfoStore()

  const loadingPic = (src: string) => {
    const img = new Image()
    loadingPicStatus = "1"
    img.onload = () => {
      loadingPicStatus = "2"
      if (avatar.value) {
        avatar.value.src = src
      }
      isLoading.value = false
    }

    img.onerror = () => {
      loadingPicStatus = "3"
      isLoading.value = false
    }

    img.src = src
  }

  watch(
    () => props,
    () => {
      modelName.value = props.newName || props.infos.humanName
      if (props.infos.previewUrl) {
        loadingPic(props.infos.previewUrl)
      }
      if (props.infos.humanName && !props.infos.previewUrl) {
        isLoading.value = false
      }
    },
    {
      immediate: true
    }
  )

  onMounted(() => {
    autoFocus()

    if (loadingPicStatus === "2" && avatar.value) {
      // 理论上不走这里的逻辑的，onmounted肯定在图片加载完成前触发
      avatar.value.src = props.infos.previewUrl
    }
  })

  onUpdated(() => {
    autoFocus()
  })

  const autoFocus = () => {
    if (props.isEditName) {
      input.value?.focus()
      // // 正对聚焦后不显示光标
      // if (typeof window.getSelection !== "undefined") {
      //   const selection = window.getSelection()
      //   selection?.selectAllChildren(input.value)
      // }
    }
  }

  const onSelect = (infos: THumanModelInfos) => {
    selectedModelInfoStore.setSelectedModelInfo({
      humanId: infos.humanId,
      humanName: infos.humanName,
      humanCatg: props.type,
      humanNo: infos.humanNo,
      gender: infos.gender
    })
  }

  const onEditName = (humanId: string) => {
    emits("editName", humanId)
  }

  const onBlur = async () => {
    emits("editName", "")
    console.log("onblur", modelName.value)
    if (props.infos.humanName === modelName.value || props.newName === modelName.value) {
      console.log("没有变化")
      return
    }

    emits("submitName", true, props.infos)
    try {
      await modifyHumanName({
        humanId: props.infos.humanId,
        name: modelName.value
      })
      emits("submitName", false, props.infos, modelName.value)
    } catch (e: any) {
      console.log("修改名称失败", e)
      if (e.code === "60006") {
        onEditName(props.infos.humanId)
      }
      modelName.value = props.newName || props.infos.humanName
      emits("submitName", false, props.infos)
    }
  }

  // const loadPicError = () => {
  //   loadNetPic.value = false
  // }
</script>
<style lang="less">
  .model-item {
    width: 165px;
    height: 200px;
    margin: 0 10px 16px 10px;
    // margin-right: 10px;
    color: var(--c-gray-1);
    .model-pic-frame {
      width: 100%;
      height: 165px;
      background: var(--c-gray-3);
      overflow: hidden;
      border-radius: 6px;
      border: 2px solid transparent;
      position: relative;
      .loading-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .el-icon {
          width: 30px;
          height: 30px;
          color: var(--c-gray-1);
          svg {
            width: 100%;
            height: 100%;
            animation: rotate linear 5s infinite;
          }
        }
      }
      img {
        height: 100%;
        width: 100%;
      }
      &.selected {
        border-color: var(--c-blue-1);
      }
    }
    .model-name {
      width: 100%;
      height: 30px;
      font-size: 14px;
      font-weight: 600;
      .model-name-inner {
        width: 100%;
        .svg-icon {
          width: 16px;
          height: 16px;
          margin-left: 8px;
          flex-shrink: 0;
          display: none;
        }
        &:hover .svg-icon {
          display: inline-block;
        }
        .text-wrapper span {
          font-weight: 600;
        }
      }
      .edit-name-area {
        height: 100%;
        border: 1px solid var(--c-blue-1);
        .edit-name {
          height: 100%;
          .el-input__wrapper {
            height: 100%;
            padding: 0 10px;
            background-color: transparent;
            box-shadow: none;
            .el-input__inner {
              height: 100%;
              border: none;
              font-size: 14px;
              color: var(--c-white-1);
            }
          }
        }
      }
    }
  }
</style>
