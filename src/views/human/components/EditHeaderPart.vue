<template>
  <div class="edit-header flex-v">
    <div class="fix-edit-header-tabs flex-start">
      <div
        v-for="tab in tabDatas"
        :key="tab.value"
        class="edit-header-tab flex-center"
        :class="activeTabValue === tab.value ? 'active' : 'pointer'"
        @click="clickTab(tab.value)"
      >
        <span>{{ tab.label }}</span>
        <span class="tab-border"></span>
      </div>
      <!-- <el-tabs
        v-model="activeTab"
        class="header-parts-tabs"
        @tab-click="clickTab"
      >
        <el-tab-pane
          v-for="tab in tabDatas"
          :label="tab.label"
          :name="tab.value"
          :key="tab.value"
        >
          {{ tab.label }}
        </el-tab-pane>
      </el-tabs> -->
    </div>
    <!-- <div
      class="preset-lists-wrapper"
      v-if="presetConfig[activeTabValue]"
    >
      <div class="preset-lists-inner-wrapper">
        <div class="preset-lists-inner flex-between">
          <div
            class="preset-list"
            v-for="item in presetConfig[activeTabValue]"
            :key="item.id"
          >
            <PresetList
              :infos="item"
              :isSelected="selectedBodyPresetStore.info.id === item.id"
              @select="onSelectPreset"
            />
          </div>
        </div>
      </div>
    </div> -->
    <div class="edit-header-options">
      <EditSliderGroups
        :data="editConfig[activeTabValue]"
        :bodyPart="EBodyParts.Header"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue"
  import { getHumanHeaderEditConfig, getBodyPresetLists } from "@/api/human"
  import { useSelectedBodyPresetStore } from "@/stores/human"
  import type { TBodyPartPositionDetail, TPresetListInfo } from "@/types/human"
  import { EBodyParts } from "@/types/human.d"
  import { formatPresetListsData } from "@/hooks/human/presetLists"

  import EditSliderGroups from "./EditSliderGroups.vue"
  // import PresetList from "./PresetList.vue"
  console.log("editheader")

  type THeaderPartsTab = {
    label: string
    value: string
  }
  type THeaderPartEditConfig = {
    [x: string]: TBodyPartPositionDetail[]
  }
  type TPresetListsConfig = {
    [x: string]: TPresetListInfo[]
  }

  const selectedBodyPresetStore = useSelectedBodyPresetStore()
  const tabDatas = ref<THeaderPartsTab[]>([])
  const editConfig = ref<THeaderPartEditConfig>({})
  const presetConfig = ref<TPresetListsConfig>({})
  const activeTabValue = ref("")

  watchEffect(async () => {
    console.log()
    const res = await getHumanHeaderEditConfig()
    if (res && res.body_parts && res.body_parts.length) {
      const tabs: THeaderPartsTab[] = []
      const config: THeaderPartEditConfig = {}
      const presets: TPresetListsConfig = {}
      // 现在只有捏脸数据
      const headerConfigs = res.body_parts[0].detail
      for (let i = 0; i < headerConfigs?.length; i++) {
        const obj = headerConfigs[i]
        tabs.push({
          value: obj.code,
          label: obj.name
        })
        config[obj.code] = obj.detail
        // TODO 按需加载？
        presets[obj.code] = formatPresetListsData(await getBodyPresetLists())
      }

      tabDatas.value = tabs
      editConfig.value = config
      presetConfig.value = presets
      activeTabValue.value = tabs[0].value
    }
  })

  const clickTab = (val: string) => {
    if (activeTabValue.value === val) {
      return
    }
    console.log(val)
    activeTabValue.value = val
  }

  const onSelectPreset = (info: TPresetListInfo) => {
    selectedBodyPresetStore.setSelectedBodyPresetInfo({
      id: info.id,
      name: info.name,
      cmdCode: info.cmdCode
    })
    // TODO 调指令接口
  }
</script>
<style lang="less">
  .edit-header {
    width: 100%;
    height: 100%;
    color: var(--c-gray-1);
    background: var(--c-black-10);
    .fix-edit-header-tabs {
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
    .preset-lists-wrapper {
      width: 100%;
      padding-top: 24px;
      max-height: 400px;
      overflow: hidden;
      .preset-lists-inner-wrapper {
        padding: 0 20px;
        width: 100%;
        height: 100%;
        overflow: auto;
        .preset-lists-inner {
          flex-flow: row wrap;

          .preset-list {
            width: 108px;
            height: 138px;
            margin-bottom: 20px;
          }
        }
      }
    }
    .edit-header-options {
      width: 100%;
      flex: 1;
      margin-top: 24px;
      min-height: 0;
      overflow: hidden;
    }
  }
</style>
