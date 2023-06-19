import { ref } from "vue"
import type { TConnectStatus, TStatsRTC } from "@/types/player"
import useRtcHandlerStore from "@/stores/rtc"

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

  const onRtcBeforeSendMessage = (data: any) => {
    rtcHandlerStore.sendByApi(data)
    /**
     * type: "mousemove",
        coord: { x: coord.x, y: coord.x },
        deta: { x: delta.x, y: delta.y }
     */
    /** button mouse事件的button属性
     * delta mousewheel 的wheelDelta属性
     * 
     * type: "mousedown",
        coord: { x: coord.x, y: coord.x },
        button

        type: "mouseup",
        coord: { x: coord.x, y: coord.x },
        button

        type: "mousewheel",
        coord: { x: coord.x, y: coord.x },
        delta

        type: "mouseenter",
        type: "mouseleave",
     */

    /**
     * event 
     * //     altKey: e.altKey,
    //     bubbles: e.bubbles,
    //     cancelBubble: e.cancelBubble,
    //     cancelable: e.cancelable,
    //     charCode: e.charCode,
    //     code: e.code,
    //     composed: e.composed,
    //     ctrlKey: e.ctrlKey,
    //     defaultPrevented: e.defaultPrevented,
    //     detail: e.detail,
    //     eventPhase: e.eventPhase,
    //     isComposing: e.isComposing,
    //     key: e.key,
    //     keyCode: e.keyCode,
    //     location: e.location,
    //     metaKey: e.metaKey,
    //     repeat: e.repeat,
    //     returnValue: e.returnValue,
    //     shiftKey: e.shiftKey
     * 
     * 
     * type: "keydown",
        event: e

        type: "keyup",
        event: e

        type: "keypress",
        event: e
     */
  }

  return { connectStatus, canStartWebrtc, stats, onStatsChange, onConnectStatusChange, onReceiveData, onRtcRecieveMessage, onRtcBeforeSendMessage }
}
