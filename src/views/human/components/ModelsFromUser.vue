<template>
  <div
    class="models-user"
    v-show="props.show"
  >
    <div
      class="models-user-inner flex-between"
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
        />
      </template>
    </div>
    <NoMoreLists v-if="!loading && noMoreLists" />
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, watchEffect } from "vue"
  import { getUserHumanLists } from "@/api/human"
  import { EModelCatg } from "@/types/human.d"
  import type { THumanModelInfos } from "@/types/human"

  import Modeltem from "./Modeltem.vue"
  import NoMoreLists from "./NoMoreLists.vue"

  const props = defineProps<{
    show: boolean
  }>()

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
    }

    if (res.rows.length < pageSize || res.totalPage === pageNoLoading) {
      noMoreLists.value = true
    } else {
      noMoreLists.value = false
    }
    loading.value = false
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

  const onEditName = (humanId: string) => {
    editModelId.value = humanId
  }
</script>
<style lang="less">
  .models-user {
    height: 100%;
    overflow: auto;
    padding: 0 10px;
    .models-user-inner {
      flex-flow: row wrap;
    }
  }
</style>
