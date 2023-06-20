import { ref } from "vue"
import type { TConnectStatus, TKeyboardData, TMouseData, TStatsRTC } from "@/types/player"
import { EIOMethod } from "@/types/player.d"
import useRtcHandlerStore from "@/stores/rtc"
import { useIOMethodStore } from "@/stores/io"

const wsHandler = (code: number) => {
  switch (code) {
    case 1006:
      console.log("异常断开")

      break
    case 4001:
    case 4002:
      break
    case 4004:
    case 4006:
      break
  }
}

export const usePlayerHandlers = () => {
  const connectStatus = ref<TConnectStatus>()
  const canStartWebrtc = ref(false)
  const loadingProgress = ref(0)
  const stats = ref<TStatsRTC>()
  const rtcHandlerStore = useRtcHandlerStore()
  const IOMethodStore = useIOMethodStore()

  const onStatsChange = (info: TStatsRTC) => {
    stats.value = info
  }

  const onConnectStatusChange = (type: TConnectStatus, params?: number | boolean) => {
    console.log("链接状态变更", type, params)
    // wsconnect startCreateWebRtc offer  answer candidate  done close  customerclose managerclose  error
    // 在计算连接进度时 只需关注 wsconnect startCreateWebRtc offer  answer candidate  done
    // close是主动关闭事件，和被动关闭 后期应该会有特别的提示
    // 在处理错误时只需关注error
    // startCreateWebRtc -> params 为bool值 isUnity
    // close -> params 为异常code
    connectStatus.value = type
    switch (type) {
      case "wsconnect":
        console.log("ws 链接完成")
        loadingProgress.value = 20
        break
      case "startCreateWebRtc":
        loadingProgress.value = 30
        // isUnity = params
        canStartWebrtc.value = true
        break
      case "offer":
        loadingProgress.value = 50
        break
      case "answer":
        loadingProgress.value = 80
        break
      case "done":
        loadingProgress.value = 100
        rtcHandlerStore.ready()
        break
      case "error":
        // this.wsError = true
        // clearInterval(this.statusTimmer)
        break
      case "close":
        // this.wscloseHandle(params)
        break
      case "dcclosed":
        console.log("dcclosed")
        // this.dccloseHandle()
        break
    }
  }

  const onReceiveData = (data: { code: string; data: any }) => {
    console.log(data)
  }

  const onRtcRecieveMessage = (data: any) => {
    rtcHandlerStore.receive(data)
  }

  const onRtcBeforeSendMessage = (data: TMouseData | TKeyboardData) => {
    // EIOMethod.Rtc 的话这里直接忽略，数据会从sdk里直接发出去的
    if (IOMethodStore.method === EIOMethod.Api) {
      rtcHandlerStore.send(data)
    }
  }

  return { connectStatus, canStartWebrtc, stats, onStatsChange, onConnectStatusChange, onReceiveData, onRtcRecieveMessage, onRtcBeforeSendMessage }
}
