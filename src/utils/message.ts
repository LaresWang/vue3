import { ElMessage, type Message, type messageType } from "element-plus"
import IconSuccess from "@/components/IconSuccess.vue"
import IconError from "@/components/IconError.vue"
import IconInfo from "@/components/IconInfo.vue"
import type { TObj } from "@/types"

type TMessageExtralOptions = {
  duration?: number
  defaultIcon?: boolean
  showClose?: boolean
}

export default (
  msg: string,
  msgType: messageType = "success",
  option: TMessageExtralOptions = {
    duration: 3000,
    defaultIcon: false,
    showClose: false
  }
) => {
  ElMessage.closeAll()

  const msgOption: TObj = {
    message: msg,
    type: msgType,
    duration: option.duration
  }

  if (option.defaultIcon) {
    msgOption.type = msgType
  } else {
    msgOption.customClass = msgType + " fix-message"
    msgOption.showClose = true
    switch (msgType) {
      case "success":
        msgOption.icon = IconSuccess
        break
      case "error":
        msgOption.icon = IconError
        break
      case "info":
        msgOption.icon = IconInfo
        break
    }
  }

  ElMessage(msgOption)
}

export const oriMessage: Message = ElMessage
