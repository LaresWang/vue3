import { ref } from "vue"
import { defineStore } from "pinia"
import { sendCommand } from "@/api/player"
import { useDeleteHumanModelStore, useCopyHumanModelStore } from "./human"
import { useLaunchInitInfosStore } from "./player"
import type { TRtcSDK } from "@/types/player"

//
const useRTCHandlersStore = defineStore("RTCHandlers", () => {
  const isReady = ref(false)
  const rtc = ref<TRtcSDK>()
  const launchInitInfosStore = useLaunchInitInfosStore()
  const deleteHumanModelStore = useDeleteHumanModelStore()
  const copyHumanModelStore = useCopyHumanModelStore()

  const ready = () => {
    isReady.value = true
  }

  const setRtc = (sdk: TRtcSDK) => {
    rtc.value = sdk
  }

  const sendByChannel = (da: string) => {
    if (isReady.value) {
      console.log("sendByChannel=====", da)
      const descriptorAsString = da

      // Add the UTF-16 JSON string to the array byte buffer, going two bytes at
      // a time.
      const data = new DataView(new ArrayBuffer(1 + 2 + 2 * descriptorAsString.length))
      let byteIdx = 0
      data.setUint8(byteIdx, 50)
      byteIdx++
      data.setUint16(byteIdx, descriptorAsString.length, true)
      byteIdx += 2
      for (let i = 0; i < descriptorAsString.length; i++) {
        data.setUint16(byteIdx, descriptorAsString.charCodeAt(i), true)
        byteIdx += 2
      }
      console.log(data)
      rtc.value!.sendDataToApp(data.buffer)
    }
  }

  const sendByApi = (data: string) => {
    const cmd = formatSendCommand(data)
    // 调接口
    sendCommand({
      command: cmd,
      instanceId: launchInitInfosStore.humanInstanceId,
      channelInstanceId: launchInitInfosStore.appInstanceId
    })
  }

  const receive = (data: any) => {
    resolveMessage(data)
    // TODO
    // deleteHumanModelStore.deleteDone()
    // copyHumanModelStore.copyDone()
  }

  return { rtc, ready, setRtc, sendByChannel, sendByApi, receive }
})

const resolveMessage = (data: any) => {
  console.log("onReceiveMessage", data)
}

const formatSendCommand = (data: string): string => {
  return ""
}

export default useRTCHandlersStore
