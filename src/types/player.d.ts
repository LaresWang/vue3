export type THeatBeatReqParams = {
  instanceId: string
}
export type THeatBeatResParams = Record<string, any>

export type TConnectStatus = "wsconnect" | "startCreateWebRtc" | "offer" | "answer" | "candidate" | "done" | "close" | "error" | "dcclosed"

export enum ELaunchStatus {
  Launching,
  Success,
  Fail,
  Close
}

export type TStartLaunchHumanReqParams = {
  humanId: string
  platform: EModelCatg
}

export type TStartLaunchHumanResParams = {
  instanceId: string
}

export type TLaunchStatusReqParams = {
  instanceId: string
  humanId: string
}

export type TLaunchStatusResParams = {
  status: ELaunchStatus
  channelInstanceId: string
}

export type TStatsRTC = {
  duration: string
  resolution: string
  delay: string
  framerate: string
  bitrate: string
  packetslostrate: string
}
