<template>
  <div
    class="models-buildin"
    v-show="props.show"
  >
    <div class="models-buildin-inner flex-between">
      <template
        v-for="model in buildinModels"
        :key="model.humanId"
      >
        <Modeltem
          :infos="model"
          :type="EModelCatg.Buildin"
          :isEditName="editModelId === model.humanId"
          @editName="onEditName"
          @submitName="onSubmitName"
        />
      </template>
    </div>
    <NoMoreLists />
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue"
  import { getPlatformHumanLists } from "@/api/human"
  import { useSelectedModelInfoStore } from "@/stores/human"
  import { EModelCatg } from "@/types/human.d"
  import type { THumanModelInfos } from "@/types/human"

  import Modeltem from "./Modeltem.vue"
  import NoMoreLists from "./NoMoreLists.vue"

  const props = defineProps<{
    show: boolean
  }>()
  const emits = defineEmits(["submitName"])

  const selectedModelInfoStore = useSelectedModelInfoStore()
  const editModelId = ref("")
  const buildinModels = ref<THumanModelInfos[]>([])

  watchEffect(async () => {
    if (props.show && !buildinModels.value.length) {
      const res = await getPlatformHumanLists()
      console.log(res)
      buildinModels.value = res

      if (!selectedModelInfoStore.info.humanId) {
        selectedModelInfoStore.setSelectedModelInfo({
          humanId: res[0].humanId,
          humanName: res[0].humanName,
          humanCatg: EModelCatg.Buildin,
          humanNo: res[0].humanNo
        })
      }
    }
  })

  watchEffect(() => {
    if (props.show && buildinModels.value.length) {
      selectedModelInfoStore.setSelectedModelInfo({
        humanId: buildinModels.value[0].humanId,
        humanName: buildinModels.value[0].humanName,
        humanCatg: EModelCatg.Buildin,
        humanNo: buildinModels.value[0].humanNo
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
  .models-buildin {
    height: 100%;
    overflow: auto;
    padding: 0 10px;
    .models-buildin-inner {
      flex-flow: row wrap;
    }
  }
</style>
