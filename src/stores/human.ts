import { ref, computed } from "vue"
import { defineStore } from "pinia"
import useRTCHandlersStore from "./rtc"
import { saveHumanModel, deleteHumanModel, deleteHumanModelResult, copyHumanModel, copyHumanModelResult } from "@/api/human"
import type { EModelCatg, EOperateModelType, TSelectedHumanModelInfo, TSelectedPresetInfo } from "../types/human"
import { EModelCatg as ModelCatg, EOperateModelType as OperateType } from "@/types/human.d"
import { getImgDataFromVideo, transferB64toBlob } from "@/utils/screenShot"
import { showModelLists } from "@/utils/showModelList"
import type { TObj } from "@/types"
import { genUUID } from "@/utils/tools"

// 强制刷新数字人列表
const useRefreshHumanListsStore = defineStore("refreshHumanLists", () => {
  const refreshListType = ref<ModelCatg>()
  const refreshReason = ref<EOperateModelType>()

  const refreshUserModelLists = (source?: EOperateModelType) => {
    refreshListType.value = ModelCatg.User
    if (source) {
      refreshReason.value = source
    } else {
      refreshReason.value = undefined
    }

    showModelLists(ModelCatg.User)
  }

  const refreshBuildinModelLists = () => {
    refreshListType.value = ModelCatg.Buildin
    showModelLists(ModelCatg.Buildin)
  }

  const resetRefresh = () => {
    refreshListType.value = undefined
  }

  const resetRefreshReason = () => {
    refreshReason.value = undefined
  }

  return { refreshListType, refreshReason, refreshUserModelLists, refreshBuildinModelLists, resetRefresh, resetRefreshReason }
})

// 点击选择数字人
const useSelectedModelInfoStore = defineStore("selectedModelInfo", () => {
  const info = ref<TSelectedHumanModelInfo>({
    humanCatg: undefined,
    humanId: "",
    humanNo: "",
    humanName: "",
    gender: undefined
  })

  const rtcHandlerStore = useRTCHandlersStore()
  const selectedHumanModelId = computed(() => info.value.humanId)

  const setSelectedModelInfo = (params: TSelectedHumanModelInfo) => {
    info.value = params

    rtcHandlerStore.send({
      commandId: "CMD0001",
      humanNo: params.humanNo,
      platform: params.humanCatg
    })
  }

  const clearSelectedModelInfo = () => {
    info.value = {
      humanCatg: undefined,
      humanId: "",
      humanName: "",
      humanNo: "",
      gender: undefined
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

  const rtcHandlerStore = useRTCHandlersStore()
  const selectedModelInfoStore = useSelectedModelInfoStore()

  const setSelectedEmotionInfo = (params: TSelectedPresetInfo) => {
    info.value = params
    // TODO 选择表情时发送的指令
    rtcHandlerStore.send({
      commandId: "CMD0001",
      humanNo: selectedModelInfoStore.info.humanNo
    })
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
  const rtcHandlerStore = useRTCHandlersStore()
  const selectedModelInfoStore = useSelectedModelInfoStore()

  const setSelectedActionInfo = (params: TSelectedPresetInfo) => {
    info.value = params
    // TODO 选择动作时发送的指令
    rtcHandlerStore.send({
      commandId: "CMD0001",
      humanNo: selectedModelInfoStore.info.humanNo
    })
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
      refreshHumanListsStore.refreshUserModelLists(OperateType.Save)
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
    // const img = document.getElementById("shotcut") as HTMLImageElement
    // img && (img.src = b64)
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
  const deleteTaskId = ref("")
  let isDeletingId = ""
  const refreshHumanListsStore = useRefreshHumanListsStore()

  const reset = () => {
    isDeleting.value = false
    isDeletingId = ""
  }

  const startDelete = async (humanId: string, humanNo: string, platform: EModelCatg) => {
    isDeleting.value = true
    isDeletingId = humanId
    deleteTaskId.value = genUUID()
    try {
      await deleteHumanModel({ humanId, humanNo, platform, taskId: deleteTaskId.value })
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
        refreshHumanListsStore.refreshUserModelLists(OperateType.Delete)
      } catch (e) {
        console.error(e)
        reset()
      }
    }
  }

  return { isDeleting, deleteTaskId, startDelete, deleteDone }
})

// 复制数字人
const useCopyHumanModelStore = defineStore("copyHumanModel", () => {
  // 一次只能复制一个数字人，等复制完成后才能进行下一个数字人的复制操作
  const isCopying = ref(false)
  const copyTaskId = ref("")
  let copyInfo: TObj = {}
  const refreshHumanListsStore = useRefreshHumanListsStore()

  const reset = () => {
    isCopying.value = false
    copyInfo = {}
  }

  const startCopy = async (humanId: string, catg: EModelCatg, humanNo: string) => {
    isCopying.value = true
    copyTaskId.value = genUUID()
    try {
      const res = await copyHumanModel({
        sourceHumanId: humanId,
        source: catg,
        sourceHumanNo: humanNo,
        taskId: copyTaskId.value
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
        refreshHumanListsStore.refreshUserModelLists(OperateType.Copy)
      } catch (e) {
        console.error(e)
        reset()
      }
    }
  }

  return { isCopying, copyTaskId, startCopy, copyDone }
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
