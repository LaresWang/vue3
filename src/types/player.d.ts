import type { EGender, EModelCatg } from "./human"

export type TConnectStatus = "wsconnect" | "startCreateWebRtc" | "offer" | "answer" | "candidate" | "done" | "close" | "error" | "dcclosed"

export enum ELaunchStatus {
  Launching,
  Success,
  Fail,
  Close
}

export enum EIOMethod {
  Api = "api",
  Rtc = "rtc"
}

export enum EMouseType {
  Mousedown = "mousedown",
  Mouseup = "mouseup",
  Mousemove = "mousemove",
  Mousewheel = "mousewheel",
  Mouseenter = "mouseenter",
  Mouseleave = "mouseleave"
}

export enum EKeyboardType {
  Keydown = "keydown",
  Keyup = "keyup",
  Keypress = "keypress"
}

export enum EUESpecialKeyCode {
  BackSpace = 8,
  Shift = 16,
  Control = 17,
  Alt = 18,
  RightShift = 253,
  RightControl = 254,
  RightAlt = 255
}

export type TStartLaunchHumanReqParams = {
  humanId: string
  platform: EModelCatg
}

export type TStartLaunchHumanResParams = {
  instanceId: string
  bizId: string
}

export type TLaunchStatusReqParams = {
  instanceId: string
  humanId: string
}

export type TLaunchStatusResParams = {
  status: ELaunchStatus
  channelInstanceId: string
}

export type TRtcSDK = typeof window.rtc

export type TStatsRTC = {
  duration: string
  resolution: string
  delay: string
  framerate: string
  bitrate: string
  packetslostrate: string
}

export type THumanCMDReqParams = {
  command: string
  instanceId: string
  channelInstanceId: string
}

/** 鼠标事件 */
export type TMouseMove = {
  type: Extract<EMouseType, EMouseType.Mousemove>
  delta: {
    x: number
    y: number
  }
}
export type TMousewheel = {
  type: Extract<EMouseType, EMouseType.Mousewheel>
  delta: number
}
export type TMouseupdown = {
  type: Extract<EMouseType, EMouseType.Mouseup | EMouseType.Mousedown>
  button: number
}

export type TMouseData = {
  coord: {
    x: number
    y: number
  }
} & (TMouseMove | TMousewheel | TMouseupdown)

/**
     * type: "mousemove",
        coord: { x: coord.x, y: coord.x },
        delta: { x: delta.x, y: delta.y }
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

/***键盘事件 */
export type TKeyboardEvent = Pick<KeyboardEvent, "keyCode" | "code" | "key" | "repeat">

export type TKeyboardData = {
  type: EKeyboardType
  event: TKeyboardEvent
  taskId?: string
}

export type TCMD = {
  commandId: string
  humanNo: string
  sourceHumanNo?: string // 复制
  platform?: EModelCatg // 复制删除
  commandValue?: number // 捏脸
  // 下面是保存数字人指令
  humanId?: string
  name?: string
  gender?: EGender
  faceup_config?: { commandId: string; commandValue: number | string }[]
  taskId?: string
}
