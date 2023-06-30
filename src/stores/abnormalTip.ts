import { ref } from "vue"
import { defineStore } from "pinia"
import type { TAbnormalTip } from "@/types"

const useAbnormalTipStore = defineStore("abnormalTip", () => {
  const info = ref<TAbnormalTip>()

  const setTipInfo = (params: TAbnormalTip) => {
    info.value = params
  }

  const show = () => {
    info.value && (info.value.show = true)
  }

  const hide = () => {
    info.value && (info.value.show = false)
  }

  return { info, setTipInfo, show, hide }
})

export default useAbnormalTipStore
