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
          :isSelected="selectedModeId === model.humanId"
          :isEditName="editModelId === model.humanId"
          @select="onSelectModel"
          @editName="onEditName"
        />
      </template>
    </div>
    <NoMoreLists />
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue"
  import { getPlatformHumanLists } from "@/api/human"
  import { EModelCatg } from "@/types/human.d"
  import type { THumanModelInfos } from "@/types/human"

  import Modeltem from "./Modeltem.vue"
  import NoMoreLists from "./NoMoreLists.vue"

  const props = defineProps<{
    show: boolean
  }>()

  const emits = defineEmits(["select"])

  const selectedModeId = ref("")
  const editModelId = ref("")
  const buildinModels = ref<THumanModelInfos[]>([])

  watchEffect(async () => {
    if (props.show && !buildinModels.value.length) {
      const res = await getPlatformHumanLists()
      console.log(res)
      buildinModels.value = res
    }
  })

  const onSelectModel = (infos: THumanModelInfos) => {
    selectedModeId.value = infos.humanId
    emits("select", infos, EModelCatg.Buildin)
  }

  const onEditName = (humanId: string) => {
    editModelId.value = humanId
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
