// 此文件主要作用是避免 /stores/rtc 与 /stores/human循环引用
import { useDeleteHumanModelStore, useCopyHumanModelStore } from "@/stores/human"
import type { TOperateResult } from "@/types/human"

export default () => {
  const deleteHumanModelStore = useDeleteHumanModelStore()
  const copyHumanModelStore = useCopyHumanModelStore()

  const messageHandler = (params: TOperateResult) => {
    switch (params.taskId) {
      case deleteHumanModelStore.deleteTaskId:
        deleteHumanModelStore.deleteDone(params)
        break

      case copyHumanModelStore.copyTaskId:
        copyHumanModelStore.copyDone(params)
        break
    }
  }

  return { messageHandler }
}
