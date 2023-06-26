import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { sendCommand } from "@/api/player"
import { useDeleteHumanModelStore, useCopyHumanModelStore } from "./human"
import { useLaunchInitInfosStore } from "./player"
import useUserInfoStore from "./user"
import { useIOMethodStore } from "./io"
import type { TCMD, TKeyboardData, TMouseData, TRtcSDK } from "@/types/player"
import { EIOMethod, EKeyboardType, EMouseType } from "@/types/player.d"
import type { TObj } from "@/types"
import { genUUID } from "@/utils/tools"

//
const useRTCHandlersStore = defineStore("RTCHandlers", () => {
  const isReady = ref(false)
  const rtc = ref<TRtcSDK>()
  const launchInitInfosStore = useLaunchInitInfosStore()
  const userInfoStore = useUserInfoStore()
  const IOMethodStore = useIOMethodStore()
  const deleteHumanModelStore = useDeleteHumanModelStore()
  const copyHumanModelStore = useCopyHumanModelStore()

  const userId = computed(() => userInfoStore.userInfo?.userId)

  const ready = () => {
    isReady.value = true
  }

  const setRtc = (sdk: TRtcSDK) => {
    rtc.value = sdk
  }

  const send = (data: TMouseData | TKeyboardData | TCMD) => {
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
    // 调接口
    sendCommand({
      command: cmd,
      instanceId: launchInitInfosStore.humanInstanceId,
      channelInstanceId: launchInitInfosStore.appInstanceId
    })
  }

  const receive = (data: number[]) => {
    resolveMessage(data)
    // TODO
    // deleteHumanModelStore.deleteDone()
    // copyHumanModelStore.copyDone()
  }

  return { rtc, ready, setRtc, send, receive }
})

const resolveMessage = (data: number[]) => {
  const view = new Uint8Array(data)
  // console.log(view[0])
  if (view[0] === 1) {
    // 1 代表是response
    try {
      const res = JSON.parse(new TextDecoder("utf-16").decode(view.slice(1)))

      console.log("onReceiveMessage res", res)
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
      inputKeyName: data.event.key,
      inputKeyCode: data.event.keyCode,
      inputType: data.type
    }
  } else {
    console.log("指令", data.commandId)
    res = { ...extralInfo, ...data }
  }

  return JSON.stringify(res)
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
