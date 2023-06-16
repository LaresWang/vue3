import request from "./request"
import type {
  THeatBeatReqParams,
  THeatBeatResParams,
  TStartLaunchHumanReqParams,
  TStartLaunchHumanResParams,
  TLaunchStatusReqParams,
  TLaunchStatusResParams
} from "../types/player"

export const heartBeat = function (params: THeatBeatReqParams) {
  // return httpGet<THeatBeatResParams, TResRegularError>("instance/heartbeat", params).then((data) => {
  //   return getResData<THeatBeatResParams>(data, "code", true)
  // })
  return request.post<THeatBeatResParams>("instance/heartbeat", params)
}

// 启动数字人
export const startLaunchHuman = function (params: TStartLaunchHumanReqParams) {
  console.log(params)
  return Promise.resolve({
    instanceId: "111"
  })
  // return request.post<TStartLaunchHumanResParams>("user/human/start", params)
}
// 数字人启动状态
export const getLaunchStatus = function (params: TLaunchStatusReqParams) {
  console.log(params)
  return Promise.resolve({
    status: 1,
    channelInstanceId: "1111"
  })
  // return request.post<TLaunchStatusResParams>("user/human/start/status", params)
}
