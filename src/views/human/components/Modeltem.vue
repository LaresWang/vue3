<template>
  <div
    class="model-item flex-v"
    @click="onSelect(props.infos)"
  >
    <div
      class="model-pic-frame"
      :class="selectedModelInfoStore.selectedHumanModelId === props.infos.humanId ? 'selected' : ''"
    >
      <img
        v-if="loadNetPic"
        :src="props.infos.previewUrl"
        @error="loadPicError"
        alt=""
      />
      <img
        v-else
        src="@/assets/imgs/list_default_pic.png"
        alt=""
      />
    </div>
    <div class="model-name flex-start">
      <div
        class="model-name-inner flex-start"
        v-if="!props.isEditName"
      >
        <span class="single-line-text-ellipsis">{{ props.infos.humanName }}</span>
        <svg-icon
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
  import { ref, watchEffect, onMounted, onUpdated } from "vue"
  import { modifyHumanName } from "@/api/human"
  import { useSelectedModelInfoStore } from "@/stores/human"
  import { EModelCatg } from "@/types/human.d"
  import type { THumanModelInfos } from "@/types/human"

  type TModelItemProps = {
    infos: THumanModelInfos
    type: EModelCatg
    isEditName: boolean
  }
  const props = defineProps<TModelItemProps>()
  const emits = defineEmits(["select", "submitName", "editName"])

  const loadNetPic = ref(true)
  const modelName = ref("")
  const input = ref()

  const selectedModelInfoStore = useSelectedModelInfoStore()

  watchEffect(() => {
    modelName.value = props.infos.humanName
    loadNetPic.value = props.infos.previewUrl ? true : false
  })

  onMounted(() => {
    autoFocus()
  })
  onUpdated(() => {
    autoFocus()
  })

  const autoFocus = () => {
    if (props.isEditName) {
      input.value?.focus()
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
    if (props.infos.humanName === modelName.value) {
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
    } catch (e) {
      console.log("修改名称失败", e)
      modelName.value = props.infos.humanName
      emits("submitName", false, props.infos)
    }
  }

  const loadPicError = () => {
    loadNetPic.value = false
  }
</script>
<style lang="less">
  .model-item {
    width: 165px;
    height: 200px;
    margin: 10px;
    // margin-right: 10px;
    color: var(--c-gray-1);
    .model-pic-frame {
      width: 100%;
      height: 165px;
      background: var(--c-gray-3);
      border-radius: 6px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      border: 1px solid transparent;
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
