import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { saveHumanModel } from "@/api/human"
import { useBreadcrumbMenusStore } from "./menus"
import type { TSelectedHumanModelInfo, TSelectedPresetInfo } from "../types/human"
import { getImgDataFromVideo, transferB64toBlob } from "@/utils/screenShot"
import { HumanModelCatgs } from "@/utils/const"
import { EModelCatg } from "@/types/human.d"

// 点击选择数字人
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

// 点击选择表情
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

// 点击选择动作
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

// 点击选择预设列表
const useSelectedBodyPresetStore = defineStore("selectedBodyPresetInfo", () => {
  const info = ref<TSelectedPresetInfo>({
    id: "",
    name: ""
  })

  const setSelectedBodyPresetInfo = (params: TSelectedPresetInfo) => {
    info.value = params
  }

  const clearSelectedBodyPresetInfo = () => {
    info.value = {
      id: "",
      name: ""
    }
  }

  return { info, setSelectedBodyPresetInfo, clearSelectedBodyPresetInfo }
})

// 点击保存数字人
const useSaveHumanModelStore = defineStore("saveHumanModel", () => {
  const isSaving = ref(false)
  const result = ref("")
  const param = new FormData()
  const selectedModelInfoStore = useSelectedModelInfoStore()
  const breadcrumbMenusStore = useBreadcrumbMenusStore()

  const startSaving = async (previewImgData: Blob) => {
    param.append("humanId", selectedModelInfoStore.info.humanId)
    param.append("previewUrl", previewImgData)

    try {
      const res = await saveHumanModel(param)
      console.log("保存成功", res)
      result.value = "ok"
      jumpModelList()
    } catch (e) {
      console.log("保存失败")
      result.value = "error"
    } finally {
      isSaving.value = false
    }
  }

  const startScreenShot = () => {
    const b64 = getImgDataFromVideo("streamingVideo")
    if (!b64) {
      console.log("获取数据异常")
      isSaving.value = false
      return
    }

    const blobData = transferB64toBlob(b64)

    startSaving(blobData)
  }

  const jumpModelList = () => {
    // 显示我的数字人tab
    const item = HumanModelCatgs.find((info) => info.value === EModelCatg.User)
    breadcrumbMenusStore.updateRootMenu({
      ...item!,
      canJump: true
    })
    // 清楚编辑前选中的模型，加载列表后再发送指令显示 第一个模型
    selectedModelInfoStore.clearSelectedModelInfo()
  }

  const save = () => {
    isSaving.value = true
    startScreenShot()
  }

  const resetResult = () => {
    result.value = ""
  }

  return { isSaving, result, resetResult, save }
})

export { useSelectedModelInfoStore, useSelectedEmotionInfoStore, useSelectedActionInfoStore, useSelectedBodyPresetStore, useSaveHumanModelStore }
