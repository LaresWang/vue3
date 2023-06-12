import { ref, computed } from "vue"
import { defineStore } from "pinia"
import type { TSelectedHumanModelInfo } from "../types/human"

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

export { useSelectedModelInfoStore }
