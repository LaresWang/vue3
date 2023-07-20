<template>
  <div class="edit-emotions flex-v">
    <div class="fix-edit-emotions-tabs flex-start">
      <div
        v-for="tab in HumanEmotionCatgs"
        :key="tab.value"
        class="edit-header-tab flex-center"
        :class="activeTabValue === tab.value ? 'active' : 'pointer'"
        @click="clickTab(tab.value)"
      >
        <span>{{ tab.label }}</span>
        <span class="tab-border"></span>
      </div>
    </div>
    <div class="emotion-lists-wrapper">
      <div
        v-show="activeTabValue === EEmotionCatg.Static"
        class="emotion-lists-inner-wrapper"
      >
        <div class="emotion-lists-inner flex-between">
          <div
            class="emotion-list"
            v-for="item in staicEmotionLists"
            :key="item.id"
          >
            <PresetList
              :infos="item"
              :isSelected="selectedEmotionInfoStore.info.id === item.id"
              @select="onSelectEmotion"
            />
          </div>
        </div>
      </div>

      <div
        v-show="activeTabValue === EEmotionCatg.Dynamic"
        class="emotion-lists-inner-wrapper"
      >
        <div class="emotion-lists-inner flex-between">
          <div
            class="emotion-list"
            v-for="item in dynamicEmotionLists"
            :key="item.id"
          >
            <PresetList
              :infos="item"
              :isSelected="selectedEmotionInfoStore.info.id === item.id"
              @select="onSelectEmotion"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue"
  import { getHumanEmotionLists } from "@/api/human"
  import { useSelectedEmotionInfoStore, useSelectedModelInfoStore } from "@/stores/human"
  import { EEmotionCatg } from "@/types/human.d"
  import type { TEmotionParams, TPresetListInfo } from "@/types/human"
  import { formatPresetListsData } from "@/hooks/human/presetLists"
  import { HumanEmotionCatgs } from "@/utils/const"

  import PresetList from "./PresetList.vue"

  const selectedEmotionInfoStore = useSelectedEmotionInfoStore()
  const selectedModelInfoStore = useSelectedModelInfoStore()
  const activeTabValue = ref(EEmotionCatg.Static)
  const staicEmotionLists = ref<TPresetListInfo[]>([])
  const dynamicEmotionLists = ref<TPresetListInfo[]>([])

  const getEmotionsLists = async (catg: EEmotionCatg) => {
    const res = await getHumanEmotionLists({ category: catg, gender: selectedModelInfoStore.info.gender! })
    if (catg === EEmotionCatg.Static) {
      staicEmotionLists.value = formatPresetListsData<TEmotionParams>(res)
    } else if (catg === EEmotionCatg.Dynamic) {
      dynamicEmotionLists.value = formatPresetListsData<TEmotionParams>(res)
    }
  }

  watchEffect(() => {
    getEmotionsLists(EEmotionCatg.Static)
    getEmotionsLists(EEmotionCatg.Dynamic)
  })

  const clickTab = (value: EEmotionCatg) => {
    if (activeTabValue.value === value) {
      return
    }
    activeTabValue.value = value
  }

  const onSelectEmotion = (info: TPresetListInfo) => {
    selectedEmotionInfoStore.setSelectedEmotionInfo({
      id: info.id,
      name: info.name,
      cmdCode: info.cmdCode
    })
  }
</script>
<style lang="less">
  .edit-emotions {
    width: 100%;
    height: 100%;
    color: var(--c-gray-1);
    background: var(--c-black-10);
    .fix-edit-emotions-tabs {
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
    .emotion-lists-wrapper {
      flex: 1;
      width: 100%;
      min-height: 0;
      overflow: hidden;
      .emotion-lists-inner-wrapper {
        padding: 24px 20px 0 20px;
        width: 100%;
        height: 100%;
        overflow: auto;
        .emotion-lists-inner {
          flex-flow: row wrap;

          .emotion-list {
            width: 108px;
            height: 138px;
            margin-bottom: 15px;
            .preset-pic-frame {
              width: 107px;
              height: 107px;
              flex: none;
            }
          }
        }
      }
    }
  }
</style>
