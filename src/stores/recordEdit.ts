// 编辑数字人记录
import { ref } from "vue"
import { defineStore } from "pinia"
import type { TEditItem, TEditRecords, TMicroAdjustItem, TOperateResult, TWholeEditRecord } from "@/types/human"
import { EBodyParts } from "@/types/human.d"

const useRecordEditStore = defineStore("recordEdit", () => {
  const record = ref<TEditRecords>({})

  const addStaticEmotionTask = () => {}
  const updateStaticEmotionTask = (params: TOperateResult) => {
    console.log(params)
  }

  const addDynamicEmotionTask = () => {}
  const updateDynamicEmotionTask = (params: TOperateResult) => {
    console.log(params)
  }

  const addActionTask = () => {}
  const updateActionTask = (params: TOperateResult) => {
    console.log(params)
  }

  const addHeaderPresetTask = (params: TEditItem & { humanNo: string }) => {
    if (!record.value[params.humanNo]) {
      record.value[params.humanNo] = {}
    }

    if (!record.value[params.humanNo][EBodyParts.Header]) {
      record.value[params.humanNo][EBodyParts.Header] = {}
    }

    if (!record.value[params.humanNo][EBodyParts.Header]!.presets) {
      record.value[params.humanNo][EBodyParts.Header]!.presets = []
      record.value[params.humanNo][EBodyParts.Header]!.presetsTaskIds = []
    }

    record.value[params.humanNo][EBodyParts.Header]!.presets!.push(params)
    record.value[params.humanNo][EBodyParts.Header]!.presetsTaskIds!.push(params.taskId)
  }
  const updateHeaderPresetTask = (params: TOperateResult) => {
    console.log(params)
  }

  const addHeaderAdjustTask = (params: TMicroAdjustItem & { humanNo: string }) => {
    if (!record.value[params.humanNo]) {
      record.value[params.humanNo] = {}
    }

    if (!record.value[params.humanNo][EBodyParts.Header]) {
      record.value[params.humanNo][EBodyParts.Header] = {}
    }

    if (!record.value[params.humanNo][EBodyParts.Header]!.microAdjust) {
      record.value[params.humanNo][EBodyParts.Header]!.microAdjust = []
      record.value[params.humanNo][EBodyParts.Header]!.microAdjustTaskIds = []
    }

    record.value[params.humanNo][EBodyParts.Header]!.microAdjust!.push(params)
    record.value[params.humanNo][EBodyParts.Header]!.microAdjustTaskIds!.push(params.taskId)
  }
  const updateHeaderAdjustTask = (params: TOperateResult) => {
    const { humanNo, taskId, result, msg } = params
    const header = record.value[humanNo][EBodyParts.Header]
    const index = header?.microAdjustTaskIds?.indexOf(taskId)
    if (typeof index === "number" && index > -1) {
      if (header!.microAdjust![index].taskId === taskId) {
        header!.microAdjust![index].result = result
        header!.microAdjust![index].msg = msg
      } else {
        const info = header!.microAdjust!.find((item) => item.taskId === taskId)
        if (info) {
          info.result = result
          info.msg = msg
        }
      }
    }
  }

  const getValidWholeEditInfo = (humanNo: string): TWholeEditRecord => {
    if (!record.value[humanNo]) {
      return {}
    }
    const res: TWholeEditRecord = {}
    const info = record.value[humanNo]
    // 剔除result不为true的任务
    // 重复的指令需要去重，保留最后一个
    if (info.action?.result) {
      res.action = info.action
    }
    if (info.staticEmotion?.result) {
      res.staticEmotion = info.staticEmotion
    }
    if (info.dynamicEmotion?.result) {
      res.dynamicEmotion = info.dynamicEmotion
    }

    const header = info[EBodyParts.Header]
    if (header) {
      res[EBodyParts.Header] = {}
      if (header.presets) {
        const infos = removeInvalidItem(header.presets)
        res[EBodyParts.Header].presets = infos
      }

      if (header.microAdjust) {
        const infos = removeInvalidItem(header.microAdjust)
        res[EBodyParts.Header].microAdjust = infos
      }
    }

    return res
  }

  const deleteRecord = (humanNo: string) => {
    delete record.value[humanNo]
  }

  return {
    record,
    addStaticEmotionTask,
    addDynamicEmotionTask,
    addActionTask,
    addHeaderPresetTask,
    addHeaderAdjustTask,
    updateStaticEmotionTask,
    updateDynamicEmotionTask,
    updateActionTask,
    updateHeaderPresetTask,
    updateHeaderAdjustTask,
    getValidWholeEditInfo,
    deleteRecord
  }
})

const removeInvalidItem = <T extends TEditItem | TMicroAdjustItem>(data: T[]): T[] => {
  const infos = data.filter((item) => item.result)
  if (infos.length) {
    const taskId: string[] = []
    for (let i = infos.length - 1; i >= 0; i--) {
      if (taskId.includes(infos[i].taskId)) {
        infos.splice(i, 1)
      }
    }
  }
  return infos
}

export default useRecordEditStore
