<template>
  <div
    class="models-user"
    v-show="props.show"
  >
    <div
      class="models-user-inner flex-start"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="noMoreLists"
      infinite-scroll-distance="20"
    >
      <template
        v-for="model in userModels"
        :key="model.humanId"
      >
        <Modeltem
          :infos="model"
          :type="EModelCatg.User"
          :isEditName="editModelId === model.humanId"
          @editName="onEditName"
          @submitName="onSubmitName"
        />
      </template>
    </div>
    <NoMoreLists v-if="!loading && noMoreLists" />
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, watchEffect } from "vue"
  import { useSelectedModelInfoStore, useRefreshHumanListsStore } from "@/stores/human"
  import { getUserHumanLists } from "@/api/human"
  import { EModelCatg, EOperateModelType } from "@/types/human.d"
  import type { THumanModelInfos } from "@/types/human"

  import Modeltem from "./Modeltem.vue"
  import NoMoreLists from "./NoMoreLists.vue"

  const props = defineProps<{
    show: boolean
  }>()
  const emits = defineEmits(["submitName"])

  const selectedModelInfoStore = useSelectedModelInfoStore()
  const refreshHumanListsStore = useRefreshHumanListsStore()
  const pageSize = 10
  const pageNo = ref(0)
  const editModelId = ref("")
  const loading = ref(false)
  const noMoreLists = ref(false)
  const userModels = ref<THumanModelInfos[]>([])
  console.log(0)
  watch(pageNo, async () => {
    loading.value = true
    noMoreLists.value = true
    console.log("get list", pageNo.value)
    const pageNoLoading = pageNo.value
    const res = await getUserHumanLists({
      pageSize,
      pageNo: pageNoLoading
    })
    console.log(res)
    if (res.pageNo === pageNoLoading && res.rows.length) {
      userModels.value = userModels.value.concat(res.rows)

      if (!selectedModelInfoStore.info.humanId) {
        selectedModelInfoStore.setSelectedModelInfo({
          humanId: res.rows[0].humanId,
          humanName: res.rows[0].humanName,
          humanCatg: EModelCatg.User,
          humanNo: res.rows[0].humanNo,
          gender: res.rows[0].gender
        })
      }
    }

    if (res.rows.length < pageSize || res.totalPage === pageNoLoading) {
      noMoreLists.value = true
    } else {
      noMoreLists.value = false
    }
    loading.value = false

    // 表示用户数字人列表数量为0，删完了
    if (pageNoLoading === 1 && res.totalRow === 0 && refreshHumanListsStore.refreshReason === EOperateModelType.Delete) {
      // 自动跳到平台模型列表
      refreshHumanListsStore.refreshBuildinModelLists()
    }
    refreshHumanListsStore.resetRefreshReason()
  })

  const loadMore = (page?: number) => {
    console.log("0000", page, Date.now())
    if (page && page < pageNo.value) {
      return
    }
    console.log("1111", page)
    pageNo.value++
  }

  watchEffect(() => {
    if (props.show && pageNo.value === 0) {
      loadMore(1)
    }
  })

  watchEffect(() => {
    if (props.show && userModels.value.length) {
      selectedModelInfoStore.setSelectedModelInfo({
        humanId: userModels.value[0].humanId,
        humanName: userModels.value[0].humanName,
        humanCatg: EModelCatg.User,
        humanNo: userModels.value[0].humanNo,
        gender: userModels.value[0].gender
      })
    }
  })

  const onEditName = (humanId: string) => {
    editModelId.value = humanId
  }

  const onSubmitName = (isSubmiting: boolean, infos: THumanModelInfos, name?: string) => {
    emits("submitName", isSubmiting, infos, name)
  }
</script>
<style lang="less">
  .models-user {
    height: 100%;
    overflow: hidden auto;
    padding-right: 10px;
    .models-user-inner {
      width: calc(100% + 20px);
      flex-flow: row wrap;
    }
  }
</style>
