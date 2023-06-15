import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { saveHumanModel, deleteHumanModel, deleteHumanModelResult, copyHumanModel, copyHumanModelResult } from "@/api/human"
import type { EModelCatg, TSelectedHumanModelInfo, TSelectedPresetInfo } from "../types/human"
import { getImgDataFromVideo, transferB64toBlob } from "@/utils/screenShot"
import { showUserModelLists } from "@/utils/showModelList"
import type { TEmptyObj } from "@/types"

// 强制刷新数字人列表
const useRefreshHumanListsStore = defineStore("refreshHumanLists", () => {
  const refresh = ref(false)
  const setRefresh = () => {
    refresh.value = true
    showUserModelLists()
  }
  const resetRefresh = () => {
    refresh.value = false
  }

  return { refresh, setRefresh, resetRefresh }
})

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
  const param = new FormData()
  const refreshHumanListsStore = useRefreshHumanListsStore()
  const selectedModelInfoStore = useSelectedModelInfoStore()

  const startSaving = async (previewImgData: Blob) => {
    param.append("humanId", selectedModelInfoStore.info.humanId)
    param.append("previewUrl", previewImgData)

    try {
      const res = await saveHumanModel(param)
      console.log("保存成功", res)
      refreshHumanListsStore.setRefresh()
    } catch (e) {
      console.log("保存失败")
      refreshHumanListsStore.resetRefresh()
      // refreshHumanListsStore.setRefresh()
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

  const save = () => {
    isSaving.value = true
    startScreenShot()
  }

  return { isSaving, save }
})

// 删除数字人
const useDeleteHumanModelStore = defineStore("deleteHumanModel", () => {
  // 一次只能删除一个数字人，等删除完成后才能进行下一个数字人的删除操作
  const isDeleting = ref(false)
  let isDeletingId = ""
  const refreshHumanListsStore = useRefreshHumanListsStore()

  const reset = () => {
    isDeleting.value = false
    isDeletingId = ""
  }

  const startDelete = async (humanId: string) => {
    isDeleting.value = true
    isDeletingId = humanId
    try {
      await deleteHumanModel({ humanId })
    } catch (e) {
      console.error(e)
      reset()
    }
  }

  const deleteDone = async (humanId: string, result: boolean) => {
    if (humanId === isDeletingId) {
      try {
        await deleteHumanModelResult({
          humanId,
          result
        })
        reset()
        refreshHumanListsStore.setRefresh()
      } catch (e) {
        console.error(e)
        reset()
      }
    }
  }

  return { isDeleting, startDelete, deleteDone }
})

// 复制数字人
const useCopyHumanModelStore = defineStore("copyHumanModel", () => {
  // 一次只能复制一个数字人，等复制完成后才能进行下一个数字人的复制操作
  const isCopying = ref(false)
  let copyInfo: TEmptyObj = {}
  const refreshHumanListsStore = useRefreshHumanListsStore()

  const reset = () => {
    isCopying.value = false
    copyInfo = {}
  }

  const startCopy = async (humanId: string, catg: EModelCatg) => {
    isCopying.value = true
    try {
      const res = await copyHumanModel({
        sourceHumanId: humanId,
        source: catg
      })
      copyInfo = res
    } catch (e) {
      console.error(e)
      reset()
    }
  }

  const copyDone = async (humanId: string, result: boolean) => {
    if (humanId === copyInfo.humanId) {
      try {
        await copyHumanModelResult({
          humanId,
          result
        })
        reset()
        refreshHumanListsStore.setRefresh()
      } catch (e) {
        console.error(e)
        reset()
      }
    }
  }

  return { isCopying, startCopy, copyDone }
})

export {
  useRefreshHumanListsStore,
  useSelectedModelInfoStore,
  useSelectedEmotionInfoStore,
  useSelectedActionInfoStore,
  useSelectedBodyPresetStore,
  useSaveHumanModelStore,
  useDeleteHumanModelStore,
  useCopyHumanModelStore
}
