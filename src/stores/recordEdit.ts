// 编辑数字人记录
import { ref } from "vue"
import { defineStore } from "pinia"
import type { TEditItem, TEditRecords, TMicroAdjustItem, TOperateResult, TWholeEditRecord } from "@/types/human"
import { EBodyParts } from "@/types/human.d"
import type { TObjGeneric } from "@/types"

const useRecordEditStore = defineStore("recordEdit", () => {
  const originHeaderMicroAdjustRecord: TObjGeneric<TMicroAdjustItem[]> = {}
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

  const setOriginHeaderEditConfig = (humanNo: string, params: { microAdjust: TMicroAdjustItem[] }) => {
    originHeaderMicroAdjustRecord[humanNo] = params.microAdjust || []
  }

  const getValidWholeEditInfo = (humanNo: string): TWholeEditRecord => {
    // if (!record.value[humanNo]) {
    //   return {}
    // }
    const res: TWholeEditRecord = {}
    const info = record.value[humanNo]
    if (info) {
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
    }

    console.log("mergeMicroAdjust")
    if (originHeaderMicroAdjustRecord[humanNo]?.length) {
      if (!res[EBodyParts.Header]) {
        res[EBodyParts.Header] = {}
      }
      res[EBodyParts.Header].microAdjust = mergeMicroAdjust(res[EBodyParts.Header].microAdjust, originHeaderMicroAdjustRecord[humanNo])
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
    setOriginHeaderEditConfig,
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
    const taskCmds: string[] = []
    for (let i = infos.length - 1; i >= 0; i--) {
      if (taskCmds.includes(infos[i].commandId)) {
        infos.splice(i, 1)
      } else {
        taskCmds.push(infos[i].commandId)
      }
    }
  }
  return infos
}

const mergeMicroAdjust = (current: TMicroAdjustItem[] | undefined, origin: TMicroAdjustItem[] | undefined): TMicroAdjustItem[] | undefined => {
  if (!current || !current.length) {
    return origin
  }

  if (!origin || !origin.length) {
    return current
  }

  const res = [...current]
  // 开始合并， 如果current与origin同时存在则取current
  const currentCmds: TObjGeneric<number> = {}
  const originCmds: TObjGeneric<number> = {}
  for (let i = 0; i < current.length; i++) {
    currentCmds[current[i].commandId] = i
  }
  for (let j = 0; j < origin.length; j++) {
    originCmds[origin[j].commandId] = j
  }

  for (const cmd in originCmds) {
    if (typeof currentCmds[cmd] === "undefined") {
      res.push(origin[originCmds[cmd]])
    }
  }

  return res
}

export default useRecordEditStore
