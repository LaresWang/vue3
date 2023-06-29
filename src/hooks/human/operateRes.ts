// 此文件主要作用是避免 /stores/rtc 与 /stores/human循环引用
import { useSaveHumanModelStore, useDeleteHumanModelStore, useCopyHumanModelStore } from "@/stores/human"
import useRecordEditStore from "@/stores/recordEdit"
import type { TOperateResult } from "@/types/human"
import { EBodyParts } from "@/types/human.d"

export default () => {
  const deleteHumanModelStore = useDeleteHumanModelStore()
  const copyHumanModelStore = useCopyHumanModelStore()
  const saveHumanModelStore = useSaveHumanModelStore()
  const recordEditStore = useRecordEditStore()

  const messageHandler = (params: TOperateResult) => {
    switch (params.taskId) {
      case deleteHumanModelStore.deleteTaskId:
        deleteHumanModelStore.deleteDone(params)
        break
      case copyHumanModelStore.copyTaskId:
        copyHumanModelStore.copyDone(params)
        break
      case saveHumanModelStore.saveTaskId:
        saveHumanModelStore.saveDone(params)
        break
      case saveHumanModelStore.showHeaderTaskId:
        saveHumanModelStore.showHeaderAreaDone(params)
        break
      default:
        editorBodyTaskHandler(params)
    }
  }

  const editorBodyTaskHandler = (params: TOperateResult) => {
    const record = recordEditStore.record[params.humanNo]
    // 寻找对应的taskId
    if (!record) {
      return
    }
    // 先寻找表情动作任务id，看能否匹配上
    switch (params.taskId) {
      case record.staticEmotionTaskId:
        recordEditStore.updateStaticEmotionTask(params)
        break
      case record.dynamicEmotionTaskId:
        recordEditStore.updateDynamicEmotionTask(params)
        break
      case record.actionTaskId:
        recordEditStore.updateActionTask(params)
        break
      default:
        editorSubBodyTaskHandler(params)
    }
  }

  const editorSubBodyTaskHandler = (params: TOperateResult) => {
    const header = recordEditStore.record[params.humanNo]![EBodyParts.Header]
    if (header?.presetsTaskIds?.includes(params.taskId)) {
      recordEditStore.updateHeaderPresetTask(params)
      return
    }

    if (header?.microAdjustTaskIds?.includes(params.taskId)) {
      recordEditStore.updateHeaderAdjustTask(params)
      return
    }
  }

  return { messageHandler }
}
