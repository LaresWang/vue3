<template>
  <div
    class="preset-item flex-v"
    @click="onSelect(props.infos)"
  >
    <div
      class="preset-pic-frame"
      :class="props.isSelected ? 'selected' : ''"
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
    <div class="preset-name flex-start">
      <span>{{ props.infos.name }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue"
  import type { TPresetListInfo } from "@/types/human"

  type TPresetListProps = {
    infos: TPresetListInfo
    isSelected: boolean
  }
  const props = defineProps<TPresetListProps>()
  const emits = defineEmits(["select"])

  const loadNetPic = ref(true)

  watchEffect(() => {
    loadNetPic.value = props.infos.previewUrl ? true : false
  })

  const onSelect = (infos: TPresetListInfo) => {
    emits("select", infos)
  }

  const loadPicError = () => {
    loadNetPic.value = false
  }
</script>
<style lang="less">
  .preset-item {
    width: 100%;
    height: 100%;
    margin: 0;
    // margin-right: 10px;
    color: var(--c-gray-1);
    .preset-pic-frame {
      width: 100%;
      flex: 1;
      background: var(--c-gray-3);
      border-radius: 6px;
      border: 1px solid transparent;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
      &.selected {
        border-color: var(--c-blue-1);
      }
    }
    .preset-name {
      width: 100%;
      margin-top: 10px;
      height: 20px;
      font-size: 14px;
    }
  }
</style>
