import { ref, computed } from "vue"
import { defineStore } from "pinia"
import type { TSelectedHumanModelInfo, TSelectedPresetInfo } from "../types/human"

const useSelectedModelInfoStore = defineStore("selectedModelInfo", () => {
  const info = ref<TSelectedHumanModelInfo>({
    humanCatg: undefined,
    humanId: "",
    humanName: ""
  })

  const selectedHumanModelId = computed(() => info.value.humanId)

  const setSelectedModelInfo = (params: TSelectedHumanModelInfo) => {
    info.value = params
  }

  const clearSelectedModelInfo = () => {
    info.value = {
      humanCatg: undefined,
      humanId: "",
      humanName: ""
    }
  }

  return { info, selectedHumanModelId, setSelectedModelInfo, clearSelectedModelInfo }
})

const useSelectedEmotionInfoStore = defineStore("selectedEmotionInfo", () => {
  const info = ref<TSelectedPresetInfo>({
    id: "",
    name: ""
  })

  const setSelectedEmotionInfo = (params: TSelectedPresetInfo) => {
    info.value = params
  }

  const clearSelectedEmotionInfo = () => {
    info.value = {
      id: "",
      name: ""
    }
  }

  return { info, setSelectedEmotionInfo, clearSelectedEmotionInfo }
})

const useSelectedActionInfoStore = defineStore("selectedActionInfo", () => {
  const info = ref<TSelectedPresetInfo>({
    id: "",
    name: ""
  })

  const setSelectedActionInfo = (params: TSelectedPresetInfo) => {
    info.value = params
  }

  const clearSelectedActionInfo = () => {
    info.value = {
      id: "",
      name: ""
    }
  }

  return { info, setSelectedActionInfo, clearSelectedActionInfo }
})

export { useSelectedModelInfoStore, useSelectedEmotionInfoStore, useSelectedActionInfoStore }
