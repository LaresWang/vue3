// 此文件主要作用是不让/stores/rtc 与 /stores/human循环引用
import useRTCHandlersStore from "@/stores/rtc"
import useRecordEditStore from "@/stores/recordEdit"
import type { EGender, EModelCatg, TSelectedHumanModelInfo, TSelectedPresetInfo } from "@/types/human"
import { EBodyParts } from "@/types/human.d"
import { OPERATE_CMD_CODES } from "@/utils/const"
import { genUUID } from "@/utils/tools"
import type { TCMD, TKeyboardData, TMouseData } from "@/types/player"

export default () => {
  const rtcHandlerStore = useRTCHandlersStore()
  const recordEditStore = useRecordEditStore()
  // 保存数字人
  const saveModel = (params: { humanNo: string; taskId: string; platform: EModelCatg; name: string; gender: EGender; oriHumanNo?: string }) => {
    console.log("在这里发送保存数字人指令")
    const info = recordEditStore.getValidWholeEditInfo(params.oriHumanNo || params.humanNo)
    rtcHandlerStore.send({
      commandId: OPERATE_CMD_CODES.Save, // 保存数字人没有指令
      humanNo: params.humanNo,
      taskId: params.taskId,
      platform: params.platform,
      name: params.name,
      gender: params.gender,
      faceup_config: info[EBodyParts.Header]?.microAdjust || []
    })
  }
  // 复制数字人
  const copyModel = (params: { sourceHumanNo: string; humanNo: string; taskId: string; platform: EModelCatg }) => {
    rtcHandlerStore.send({
      commandId: OPERATE_CMD_CODES.Copy,
      sourceHumanNo: params.sourceHumanNo,
      humanNo: params.humanNo,
      taskId: params.taskId,
      platform: params.platform
    })
  }
  // 删除数字人
  const deleteModel = (params: { humanNo: string; taskId: string; platform: EModelCatg }) => {
    rtcHandlerStore.send({
      commandId: OPERATE_CMD_CODES.Delete,
      humanNo: params.humanNo,
      taskId: params.taskId,
      platform: params.platform
    })
  }
  // 选择数字人切换数字人
  const selectModel = (params: TSelectedHumanModelInfo) => {
    rtcHandlerStore.send({
      commandId: OPERATE_CMD_CODES.Show,
      humanNo: params.humanNo,
      platform: params.humanCatg
    })
  }
  // 撤销编辑，恢复至初始状态
  const resetModel = (params: { humanNo: string; taskId: string; platform: EModelCatg }) => {
    rtcHandlerStore.send({
      commandId: OPERATE_CMD_CODES.Reset,
      humanNo: params.humanNo,
      taskId: params.taskId,
      platform: params.platform
    })
  }
  // 选择表情
  const selectEmotion = (params: TSelectedPresetInfo & { humanNo: string }) => {
    rtcHandlerStore.send({
      commandId: params.cmdCode,
      humanNo: params.humanNo
    })
  }
  // 选择动作
  const selectAction = (params: TSelectedPresetInfo & { humanNo: string }) => {
    rtcHandlerStore.send({
      commandId: params.cmdCode,
      humanNo: params.humanNo
    })
  }

  // 头部预设
  const presetHeader = () => {}
  // 滑块拖动调整头部细节
  const microAdjustHeader = (params: { humanNo: string; commandId: string; commandValue: number }) => {
    const taskId = genUUID()
    const param = {
      humanNo: params.humanNo,
      commandId: params.commandId,
      commandValue: params.commandValue,
      taskId
    }
    recordEditStore.addHeaderAdjustTask(param)
    rtcHandlerStore.send(param)
  }

  const deleteEditRecord = (humanNo: string) => {
    recordEditStore.deleteRecord(humanNo)
  }

  const sendCmd = (params: TMouseData | TKeyboardData | TCMD) => {
    rtcHandlerStore.send(params)
  }

  return {
    saveModel,
    copyModel,
    deleteModel,
    selectModel,
    resetModel,
    selectEmotion,
    selectAction,
    presetHeader,
    microAdjustHeader,
    deleteEditRecord,
    sendCmd
  }
}
