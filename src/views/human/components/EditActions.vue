<template>
  <div class="edit-actions flex-v">
    <div class="fix-edit-actions-tabs flex-start">
      <div
        v-for="tab in HumanActionCatgs"
        :key="tab.value"
        class="edit-header-tab flex-center"
        :class="'active'"
      >
        <span>{{ tab.label }}</span>
        <span class="tab-border"></span>
      </div>
    </div>
    <div class="action-lists-wrapper">
      <div class="action-lists-inner-wrapper">
        <div class="action-lists-inner flex-between">
          <div
            class="action-list"
            v-for="item in actionLists"
            :key="item.id"
          >
            <PresetList
              :infos="item"
              :isSelected="selectedActionInfoStore.info.id === item.id"
              @select="onSelectAction"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue"
  import { getHumanActionLists } from "@/api/human"
  import { useSelectedActionInfoStore } from "@/stores/human"

  import type { TActionParams, TPresetListInfo } from "@/types/human"
  import { formatPresetListsData } from "@/hooks/human/presetLists"
  import { HumanActionCatgs } from "@/utils/const"

  import PresetList from "./PresetList.vue"

  const selectedActionInfoStore = useSelectedActionInfoStore()
  const actionLists = ref<TPresetListInfo[]>([])

  const getActionLists = async () => {
    const res = await getHumanActionLists()
    actionLists.value = formatPresetListsData<TActionParams>(res)
  }

  watchEffect(() => {
    getActionLists()
  })

  const onSelectAction = (info: TPresetListInfo) => {
    selectedActionInfoStore.setSelectedActionInfo({
      id: info.id,
      name: info.name
    })
    // TODO 调指令接口
  }
</script>
<style lang="less">
  .edit-actions {
    width: 100%;
    height: 100%;
    color: var(--c-gray-1);
    background: var(--c-black-10);
    .fix-edit-actions-tabs {
      width: 100%;
      height: 48px;
      padding: 0 16px;
      font-size: 14px;
      font-weight: 500;
      overflow: auto;
      background: var(--c-black-5);
      .edit-header-tab {
        height: 100%;
        margin: 0 8px;
        position: relative;
        flex-shrink: 0;
        .tab-border {
          height: 2px;
          width: 100%;
          position: absolute;
          bottom: 0;
        }
        &:hover {
          color: var(--c-blue-1);
        }
        &.active {
          color: var(--c-blue-1);
          .tab-border {
            background: var(--c-blue-1);
          }
        }
      }
    }
    .action-lists-wrapper {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      .action-lists-inner-wrapper {
        padding: 0 20px;
        width: 100%;
        height: 100%;
        overflow: auto;
        .action-lists-inner {
          flex-flow: row wrap;

          .action-list {
            width: 108px;
            height: 138px;
            margin-top: 15px;
          }
        }
      }
    }
  }
</style>
