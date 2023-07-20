import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { sendCommand } from "@/api/player"
import { useLaunchInitInfosStore } from "./player"
import useUserInfoStore from "./user"
import { useIOMethodStore } from "./io"
import useOperateRes from "@/hooks/human/operateRes"
import type { TCMD, TKeyboardData, TKeyboardEvent, TMouseData, TRtcSDK } from "@/types/player"
import { EIOMethod, EKeyboardType, EMouseType, EUESpecialKeyCode } from "@/types/player.d"
import type { TObj } from "@/types"
import { genUUID } from "@/utils/tools"

//
const useRTCHandlersStore = defineStore("RTCHandlers", () => {
  const isReady = ref(false)
  const canInteract = ref(true)
  const rtc = ref<TRtcSDK>()
  const launchInitInfosStore = useLaunchInitInfosStore()
  const userInfoStore = useUserInfoStore()
  const IOMethodStore = useIOMethodStore()
  const operateRes = useOperateRes()

  const userId = computed(() => userInfoStore.userInfo?.userId)

  const ready = () => {
    isReady.value = true
  }

  const setRtc = (sdk: TRtcSDK) => {
    rtc.value = sdk
  }

  const send = (data: TMouseData | TKeyboardData | TCMD, force?: boolean) => {
    if (!canInteract.value && !force && (isTMouseData(data) || isTKeyboardData(data))) {
      return
    }

    const msg = formatSendCommand(data, {
      taskId: genUUID(),
      userId: userId.value!
    })
    console.log("=======", msg)
    if (IOMethodStore.method === EIOMethod.Rtc) {
      if (isReady.value) {
        console.log("webrtc send")
        sendByChannel(msg)
      }
    } else {
      console.log("api send")
      sendByApi(msg)
    }
  }

  const sendByChannel = (data: string) => {
    //
    rtc.value!.sendDataToApp(JSON.parse(data))
  }

  const sendByApi = (cmd: string) => {
    if (!launchInitInfosStore.humanInstanceId || !launchInitInfosStore.appInstanceId) {
      return
    }
    // 调接口
    sendCommand({
      command: cmd,
      instanceId: launchInitInfosStore.humanInstanceId,
      channelInstanceId: launchInitInfosStore.appInstanceId
    })
  }

  const receive = (data: number[]) => {
    const msg = resolveMessage(data)
    if (msg && typeof msg === "object" && msg.taskId) {
      operateRes.messageHandler(msg)
    }
  }

  const setInteractStatus = (status: boolean) => {
    canInteract.value = status
    rtc.value?.setOperateAuth(status)
  }

  return { rtc, ready, setRtc, send, receive, setInteractStatus }
})

const resolveMessage = (data: number[]) => {
  const view = new Uint8Array(data)
  // console.log(view[0])
  if (view[0] === 1) {
    // 1 代表是response
    try {
      console.log(new TextDecoder("utf-16").decode(view.slice(1)))
      const res = JSON.parse(new TextDecoder("utf-16").decode(view.slice(1)))

      console.log("onReceiveMessage res", res)
      return res
    } catch (e) {
      console.log(e)
    }
  }
}

const formatSendCommand = (data: TMouseData | TKeyboardData | TCMD, extralInfo: { userId: string; taskId: string }): string => {
  let res: TObj = {}
  if (isTMouseData(data)) {
    console.log("鼠标", data.coord)
    res = {
      ...extralInfo,
      ...data
    }
  } else if (isTKeyboardData(data)) {
    console.log("键盘", data.event)
    res = {
      ...extralInfo,
      inputKeyName: data.event.key, // 按键具体名称  区分大小写
      inputKeyNo: getKeyCode(data.event),
      inputType: data.type,
      repeat: data.event.repeat
    }
  } else {
    console.log("指令", data.commandId)
    res = { ...extralInfo, ...data }
  }

  return JSON.stringify(res)
}

const getKeyCode = (e: TKeyboardEvent) => {
  // UE
  if (e.keyCode === EUESpecialKeyCode.Shift && e.code === "ShiftRight") return EUESpecialKeyCode.RightShift
  else if (e.keyCode === EUESpecialKeyCode.Control && e.code === "ControlRight") return EUESpecialKeyCode.RightControl
  else if (e.keyCode === EUESpecialKeyCode.Alt && e.code === "AltRight") return EUESpecialKeyCode.RightAlt
  else return e.keyCode
}

const isTMouseData = (data: TMouseData | TKeyboardData | TCMD): data is TMouseData => {
  if (typeof (<TMouseData>data).type !== "undefined") {
    return Object.values(EMouseType).includes((<TMouseData>data).type)
  }
  return false
}

const isTKeyboardData = (data: TMouseData | TKeyboardData | TCMD): data is TKeyboardData => {
  if (typeof (<TKeyboardData>data).type !== "undefined") {
    return Object.values(EKeyboardType).includes((<TKeyboardData>data).type)
  }
  return false
}

export default useRTCHandlersStore
