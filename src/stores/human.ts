import { ref, computed } from "vue"
import { defineStore } from "pinia"
import useOperateModel from "@/hooks/human/operate"
import { saveHumanModel, deleteHumanModel, deleteHumanModelResult, copyHumanModel, copyHumanModelResult } from "@/api/human"
import {
  EModelCatg,
  type EOperateModelType,
  type TCopyHumanResParams,
  type THumanCopyCallback,
  type TOperateResult,
  type TSelectedHumanModelInfo,
  type TSelectedPresetInfo
} from "../types/human"
import { EModelCatg as ModelCatg, EOperateModelType as OperateType } from "@/types/human.d"
import { getImgDataFromVideo, transferB64toBlob } from "@/utils/screenShot"
import { showModelLists } from "@/utils/showModelList"
import type { TObjGeneric } from "@/types"
import { genUUID } from "@/utils/tools"
import { EKeyboardType } from "@/types/player.d"

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

  const operate = useOperateModel()
  const selectedHumanModelId = computed(() => info.value.humanId)

  const setSelectedModelInfo = (params: TSelectedHumanModelInfo) => {
    if (info.value.humanNo === params.humanNo) {
      return
    }

    info.value = params
    operate.selectModel(params)
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
    name: "",
    cmdCode: ""
  })

  const operate = useOperateModel()
  const selectedModelInfoStore = useSelectedModelInfoStore()

  const setSelectedEmotionInfo = (params: TSelectedPresetInfo) => {
    info.value = params
    operate.selectEmotion({
      ...params,
      humanNo: selectedModelInfoStore.info.humanNo
    })
  }

  const clearSelectedEmotionInfo = () => {
    info.value = {
      id: "",
      name: "",
      cmdCode: ""
    }
  }

  return { info, setSelectedEmotionInfo, clearSelectedEmotionInfo }
})

// 点击选择动作
const useSelectedActionInfoStore = defineStore("selectedActionInfo", () => {
  const info = ref<TSelectedPresetInfo>({
    id: "",
    name: "",
    cmdCode: ""
  })

  const operate = useOperateModel()
  const selectedModelInfoStore = useSelectedModelInfoStore()

  const setSelectedActionInfo = (params: TSelectedPresetInfo) => {
    info.value = params
    operate.selectAction({
      ...params,
      humanNo: selectedModelInfoStore.info.humanNo
    })
  }

  const clearSelectedActionInfo = () => {
    info.value = {
      id: "",
      name: "",
      cmdCode: ""
    }
  }

  return { info, setSelectedActionInfo, clearSelectedActionInfo }
})

// 点击选择预设列表
const useSelectedBodyPresetStore = defineStore("selectedBodyPresetInfo", () => {
  const info = ref<TSelectedPresetInfo>({
    id: "",
    name: "",
    cmdCode: ""
  })

  const setSelectedBodyPresetInfo = (params: TSelectedPresetInfo) => {
    info.value = params
  }

  const clearSelectedBodyPresetInfo = () => {
    info.value = {
      id: "",
      name: "",
      cmdCode: ""
    }
  }

  return { info, setSelectedBodyPresetInfo, clearSelectedBodyPresetInfo }
})

// 点击保存数字人
const useSaveHumanModelStore = defineStore("saveHumanModel", () => {
  const isSaving = ref(false)
  const saveTaskId = ref("")
  const showHeaderTaskId = ref("")
  let isSaveHumanId = ""
  let isSaveHumanNo = ""

  const operate = useOperateModel()
  const refreshHumanListsStore = useRefreshHumanListsStore()
  const selectedModelInfoStore = useSelectedModelInfoStore()
  const copyHumanModelStore = useCopyHumanModelStore()

  const startSaving = async (previewImgData: Blob) => {
    const param = new FormData()
    param.append("humanId", isSaveHumanId)
    param.append("humanNo", isSaveHumanNo)
    param.append("avatarFile", previewImgData)
    try {
      const res = await saveHumanModel(param)
      console.log("保存成功", res)
      refreshHumanListsStore.refreshUserModelLists(OperateType.Save)
    } catch (e) {
      console.log("保存失败")
      refreshHumanListsStore.resetRefresh()
    } finally {
      isSaving.value = false
    }
  }

  const startScreenShot = () => {
    const b64 = getImgDataFromVideo("streamingVideo", "video-container")
    if (!b64) {
      console.log("获取截图数据异常")
      isSaving.value = false
      return
    }
    // const img = document.getElementById("shotcut") as HTMLImageElement
    // img && (img.src = b64)
    const blobData = transferB64toBlob(b64)

    startSaving(blobData)
  }

  const showHeaderAreaDone = (params: TOperateResult) => {
    console.log("显示头部镜头", params)
    if (params.humanNo === isSaveHumanNo) {
      startScreenShot()
      // if (params.result === true) {
      //   startScreenShot()
      // } else {
      //   isSaving.value = false
      // }
    }
  }

  const showHeaderArea = () => {
    showHeaderTaskId.value = genUUID()
    // TODO 发指令显示头部镜头，准备截图
    // 发送显示头部的快捷键 按键数字1
    /**
     * isTrusted: true
      altKey: false
      bubbles: true
      cancelBubble: false
      cancelable: true
      charCode: 0
      code: "Digit1"
      composed: true
      ctrlKey: false
      currentTarget: null
      defaultPrevented: false
      detail: 0
      eventPhase: 0
      isComposing: false
      key: "1"
      keyCode: 49
      location: 0
      metaKey: false
      repeat: false
      returnValue: true
      shiftKey: false
      sourceCapabilities: InputDeviceCapabilities {firesTouchEvents: false}
      srcElement: body
      target: body
      timeStamp: 63264
      type: "keyup"
     */
    operate.sendCmd({
      type: EKeyboardType.Keydown,
      event: {
        key: "1",
        keyCode: 49,
        code: "Digit1",
        repeat: false
      },
      taskId: showHeaderTaskId.value
    })
    setTimeout(() => {
      operate.sendCmd({
        type: EKeyboardType.Keyup,
        event: {
          key: "1",
          keyCode: 49,
          code: "Digit1",
          repeat: false
        },
        taskId: "-1"
      })
    }, 300)
  }

  // UE端保存结束
  const saveDone = (params: TOperateResult) => {
    console.log("UE保存处理结束:", params)
    if (params.humanNo === isSaveHumanNo) {
      if (params.result === true) {
        // 不用前端发切换镜头指令了，UE端收到保存指令自动切换到面部镜头，收到保存指令响应后可直接截图
        // showHeaderArea()

        // 开始截图然后调后端保存接口
        startScreenShot()
      } else {
        isSaving.value = false
      }
    }
  }
  // 如果是内置模版过来的话需要先复制，然后再保存
  // 待UE端处理完后再发指令显示头部区域，然后截图上传
  const save = () => {
    isSaving.value = true

    if (selectedModelInfoStore.info.humanCatg === ModelCatg.Buildin) {
      // 先走复制逻辑  然后再走接下来的保存逻辑
      copyHumanModelStore.startCopy(
        selectedModelInfoStore.info.humanId,
        selectedModelInfoStore.info.humanCatg,
        selectedModelInfoStore.info.humanNo,
        (params) => {
          if (typeof params === "string") {
            console.log("保存失败")
            console.log(params)
            isSaving.value = false
          } else {
            saveTaskId.value = genUUID()
            isSaveHumanNo = params.humanNo
            isSaveHumanId = params.humanId
            // 直接发指令给UE保存数据
            operate.saveModel({
              humanNo: isSaveHumanNo,
              taskId: saveTaskId.value,
              platform: ModelCatg.User,
              gender: selectedModelInfoStore.info.gender!,
              name: params.humanName
            })
          }
        }
      )
    } else {
      saveTaskId.value = genUUID()
      isSaveHumanNo = selectedModelInfoStore.info.humanNo
      isSaveHumanId = selectedModelInfoStore.info.humanId
      // 直接发指令给UE保存数据
      operate.saveModel({
        humanNo: isSaveHumanNo,
        taskId: saveTaskId.value,
        platform: selectedModelInfoStore.info.humanCatg!,
        gender: selectedModelInfoStore.info.gender!,
        name: selectedModelInfoStore.info.humanName
      })
    }
  }

  return { isSaving, saveTaskId, showHeaderTaskId, save, saveDone, showHeaderAreaDone }
})

// 删除数字人
const useDeleteHumanModelStore = defineStore("deleteHumanModel", () => {
  // 一次只能删除一个数字人，等删除完成后才能进行下一个数字人的删除操作
  const isDeleting = ref(false)
  const deleteTaskId = ref("")
  let isDeletingId = ""
  let isDeletingNo = ""

  // const operate = useOperateModel()
  const refreshHumanListsStore = useRefreshHumanListsStore()

  const reset = () => {
    isDeleting.value = false
    isDeletingId = ""
    isDeletingNo = ""
  }

  const startDelete = async (humanId: string, humanNo: string, platform: EModelCatg) => {
    isDeleting.value = true
    isDeletingId = humanId
    isDeletingNo = humanNo
    deleteTaskId.value = genUUID()
    try {
      await deleteHumanModel({ humanId, humanNo, platform, taskId: deleteTaskId.value })
      // 发送指令
      // 在调用删除接口后是否需要继续调用删除指令
      // operate.deleteModel({
      //   humanNo,
      //   taskId: deleteTaskId.value,
      //   platform
      // })

      // 后端逻辑删除处理   不用发指令了
      reset()
      refreshHumanListsStore.refreshUserModelLists(OperateType.Delete)
    } catch (e) {
      console.error(e)
      reset()
    }
  }

  const deleteDone = async (params: TOperateResult) => {
    if (params.humanNo === isDeletingNo) {
      try {
        await deleteHumanModelResult({
          humanId: isDeletingId,
          result: params.result
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
  let copyInfo: TCopyHumanResParams = {
    humanId: "",
    humanNo: "",
    humanName: ""
  }
  const copyCbs: TObjGeneric<THumanCopyCallback> = {}

  const operate = useOperateModel()
  const refreshHumanListsStore = useRefreshHumanListsStore()

  const reset = () => {
    isCopying.value = false
    copyInfo = {
      humanId: "",
      humanNo: "",
      humanName: ""
    }
  }

  const startCopy = async (humanId: string, platform: EModelCatg, humanNo: string, cb?: THumanCopyCallback) => {
    isCopying.value = true
    copyTaskId.value = genUUID()
    try {
      const res = await copyHumanModel({
        sourceHumanId: humanId,
        source: platform,
        sourceHumanNo: humanNo,
        taskId: copyTaskId.value
      })
      copyInfo = res

      if (cb) {
        copyCbs[res.humanNo] = cb
      }
      // TODO 待确定 在调用f复制接口后是否需要继续调用复制指令
      operate.copyModel({
        sourceHumanNo: humanNo,
        humanNo: res.humanNo,
        taskId: copyTaskId.value,
        platform
      })
    } catch (e: any) {
      console.error(e)

      if (cb) {
        cb("保存时复制前异常：" + e.msg || e.message)
        if (copyInfo.humanNo) {
          delete copyCbs[copyInfo.humanNo]
        }
      }

      reset()
    }
  }

  const copyDone = async (params: TOperateResult) => {
    if (params.humanNo === copyInfo.humanNo) {
      try {
        await copyHumanModelResult({
          humanId: copyInfo.humanId,
          humanNo: copyInfo.humanNo,
          result: params.result
        })

        // 保存前的copy这里不走刷新列表逻辑，保存完成后会刷新的
        if (copyCbs[copyInfo.humanNo]) {
          if (params.result) {
            copyCbs[copyInfo.humanNo](copyInfo)
          } else {
            copyCbs[copyInfo.humanNo]("保存前复制不成功")
          }
          delete copyCbs[copyInfo.humanNo]
        } else {
          refreshHumanListsStore.refreshUserModelLists(OperateType.Copy)
        }
        reset()
      } catch (e: any) {
        console.error(e)
        reset()
        if (copyCbs[copyInfo.humanNo]) {
          copyCbs[copyInfo.humanNo]("保存时复制后异常：" + e.msg || e.message)
          delete copyCbs[copyInfo.humanNo]
        }
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
