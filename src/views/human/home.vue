<template>
  <div class="human-home flex-between">
    <div class="human-edit-area flex-between">
      <div class="edit-left-area">
        <!-- 根据导航栏上的编辑按钮动态切换左边的菜单组件 -->
        <BodySummaryParts
          v-show="breadcrumbMenusStore.breadMenus.length > 1 && selectedEditCompNameStore.selectedCompName === EEditCompName.EditHeaderPart"
        />
      </div>
      <div class="edit-right-area">
        <!-- 根据 默认显示模型列表， 导航栏上的编辑按钮动态切换下面的组件 -->
        <!-- 这里放置 模型列表/模型编辑/表情/动作 组件切换 -->
        <HumanModelLists v-show="breadcrumbMenusStore.breadMenus.length < 2" />
        <component
          v-show="breadcrumbMenusStore.breadMenus.length > 1"
          :is="comps[selectedEditCompNameStore.selectedCompName]"
        ></component>
        <!-- <EditHeaderPart />
        <EditEmotions />
        <EditActions /> -->
      </div>
    </div>
    <div class="human-player-area">
      <Player />
    </div>
    <AbnormalTip />
  </div>
</template>
<script setup lang="ts">
  import { watchEffect } from "vue"
  import { getUserHumanLists, getPlatformHumanLists } from "@/api/human"
  import { startLaunchHuman } from "@/api/player"
  import { useBreadcrumbMenusStore, useSelectedEditCompNameStore } from "@/stores/menus"
  import { HumanModelCatgs } from "@/utils/const"
  import { EEditCompName } from "@/types/menus.d"
  import type { THumanModelInfos, EModelCatg } from "@/types/human"
  import { EModelCatg as ModelCatg } from "@/types/human.d"
  import { useLaunchInitInfosStore } from "@/stores/player"
  import { useSelectedModelInfoStore } from "@/stores/human"
  import useAbnormalTipStore from "@/stores/abnormalTip"

  import HumanModelLists from "./components/HumanModelLists.vue"
  import BodySummaryParts from "./components/BodySummaryParts.vue"
  import EditEmpty from "./components/EditEmpty.vue"
  import EditHeaderPart from "./components/EditHeaderPart.vue"
  import EditEmotions from "./components/EditEmotions.vue"
  import EditActions from "./components/EditActions.vue"
  import Player from "./components/Player.vue"
  import AbnormalTip from "./components/AbnormalTip.vue"

  const abnormalTipStore = useAbnormalTipStore()
  const breadcrumbMenusStore = useBreadcrumbMenusStore()
  const selectedEditCompNameStore = useSelectedEditCompNameStore()
  const launchInitInfosStore = useLaunchInitInfosStore()
  const selectedModelInfoStore = useSelectedModelInfoStore()

  const comps = {
    [EEditCompName.EditEmpty]: EditEmpty,
    [EEditCompName.EditHeaderPart]: EditHeaderPart,
    [EEditCompName.EditEmotions]: EditEmotions,
    [EEditCompName.EditActions]: EditActions
  }

  watchEffect(async () => {
    if (!breadcrumbMenusStore.breadMenus.length) {
      // 如果用户模型列表有数据则默认显示用户列表，HumanModelCatgs[1]
      // 否则默认显示内置模型列表 HumanModelCatgs[0]
      // addBreadMenu(HumanModelCatgs[0])
      try {
        const results = await Promise.all([
          getPlatformHumanLists(),
          getUserHumanLists({
            pageNo: 1,
            pageSize: 1
          })
        ])

        console.log(results)
        let info: THumanModelInfos | null
        let catg: EModelCatg | undefined

        if (results[1].rows?.length) {
          breadcrumbMenusStore.addBreadMenu({ ...HumanModelCatgs[1], canJump: true })
          info = results[1].rows[0]
          catg = ModelCatg.User
        } else {
          breadcrumbMenusStore.addBreadMenu({ ...HumanModelCatgs[0], canJump: true })
          info = results[0][0]
          catg = ModelCatg.Buildin
        }

        selectedModelInfoStore.setSelectedModelInfo(
          {
            humanId: info.humanId,
            humanName: info.humanName,
            humanCatg: catg,
            humanNo: info.humanNo,
            gender: info.gender
          },
          {
            forceUpdate: true,
            noSendDirect: true
          }
        )

        const res = await startLaunchHuman({
          humanId: info.humanId,
          humanNo: info.humanNo,
          platform: catg
        })

        launchInitInfosStore.setHumanInfos(res.bizId, res.instanceId, info)
      } catch (e: any) {
        // console.error(e)
        // TODO 文案待定
        abnormalTipStore.setTipInfo({
          show: true,
          content: e.msg || e.message || "没有数字人模型数据"
        })
      }
    }
  })
</script>
<style lang="less">
  .human-home {
    width: 100%;
    height: 100%;
    padding-top: 4px;
    .human-edit-area {
      flex: 1;
      height: 100%;
      flex-shrink: 0;
      overflow-x: hidden;
      .edit-left-area {
        width: 85px;
        height: 100%;
        padding-right: 2px;
      }
      .edit-right-area {
        flex: 1;
        height: 100%;
        min-width: 0;
        overflow: hidden;
      }
    }
    .human-player-area {
      width: var(--right-area-width);
      height: 100%;
      color: var(--c-white-1);
    }
  }
</style>
