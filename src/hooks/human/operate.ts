// 此文件主要作用是不让/stores/rtc 与 /stores/human循环引用
import useRTCHandlersStore from "@/stores/rtc"
import type { EModelCatg, TSelectedHumanModelInfo, TSelectedPresetInfo } from "@/types/human"
import { OPERATE_CMD_CODES } from "@/utils/const"

export default () => {
  const rtcHandlerStore = useRTCHandlersStore()

  const saveModel = () => {
    console.log("在这里发送保存数字人指令")
  }

  const copyModel = (params: { humanNo: string; taskId: string; platform: EModelCatg }) => {
    rtcHandlerStore.send({
      commandId: OPERATE_CMD_CODES.Copy,
      humanNo: params.humanNo,
      taskId: params.taskId,
      platform: params.platform
    })
  }

  const deleteModel = (params: { humanNo: string; taskId: string; platform: EModelCatg }) => {
    rtcHandlerStore.send({
      commandId: OPERATE_CMD_CODES.Delete,
      humanNo: params.humanNo,
      taskId: params.taskId,
      platform: params.platform
    })
  }

  const selectModel = (params: TSelectedHumanModelInfo) => {
    rtcHandlerStore.send({
      commandId: OPERATE_CMD_CODES.Show,
      humanNo: params.humanNo,
      platform: params.humanCatg
    })
  }

  const selectEmotion = (params: TSelectedPresetInfo & { humanNo: string }) => {
    rtcHandlerStore.send({
      commandId: params.cmdCode,
      humanNo: params.humanNo
    })
  }

  const selectAction = (params: TSelectedPresetInfo & { humanNo: string }) => {
    rtcHandlerStore.send({
      commandId: params.cmdCode,
      humanNo: params.humanNo
    })
  }

  return { saveModel, copyModel, deleteModel, selectModel, selectEmotion, selectAction }
}
