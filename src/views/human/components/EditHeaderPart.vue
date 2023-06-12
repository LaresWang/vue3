<template>
  <div class="edit-header">
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
    <div class="edit-header-options">
      <EditSliderGroups :data="editConfig[activeTabValue]" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue"
  import { getHumanHeaderEditConfig } from "@/api/human"
  import type { TBodyPartPositionDetail } from "@/types/human"

  import EditSliderGroups from "./EditSliderGroups.vue"
  console.log("editheader")

  type THeaderPartsTab = {
    label: string
    value: string
  }
  type THeaderPartEditConfig = {
    [x: string]: TBodyPartPositionDetail[]
  }

  const tabDatas = ref<THeaderPartsTab[]>([])
  const editConfig = ref<THeaderPartEditConfig>({})
  const activeTabValue = ref("")

  watchEffect(async () => {
    console.log()
    const res = await getHumanHeaderEditConfig()
    if (res.body_parts && res.body_parts.length) {
      const tabs: THeaderPartsTab[] = []
      const config: THeaderPartEditConfig = {}
      for (let i = 0; i < res.body_parts.length; i++) {
        const obj = res.body_parts[i]
        tabs.push({
          value: obj.code,
          label: obj.name
        })
        config[obj.code] = obj.detail
      }

      tabDatas.value = tabs
      editConfig.value = config
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
</script>
<style lang="less">
  .edit-header {
    color: var(--c-gray-1);
    height: 100%;
    background: var(--c-black-10);
    .fix-edit-header-tabs {
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
          height: 1px;
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
    .edit-header-options {
      margin-top: 2px;
      padding: 0 12px;
      background: var(--c-black-5);
    }
  }
</style>
