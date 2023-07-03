import request from "./request"
import type {
  TStartLaunchHumanReqParams,
  TStartLaunchHumanResParams,
  TLaunchStatusReqParams,
  TLaunchStatusResParams,
  THumanCMDReqParams
} from "../types/player"

// 启动数字人
export const startLaunchHuman = function (params: TStartLaunchHumanReqParams) {
  // console.log(params)
  // return Promise.resolve({
  //   instanceId: "111"
  // })
  return request.post<TStartLaunchHumanResParams>("user/human/start", params)
}
// 数字人启动状态
export const getLaunchStatus = function (params: TLaunchStatusReqParams) {
  console.log(params)
  // return Promise.resolve({
  //   status: 1,
  //   channelInstanceId: "1111"
  // })
  return request.post<TLaunchStatusResParams>("user/human/start/status", params)
}

// 数字人指令
export const sendCommand = function (params: THumanCMDReqParams) {
  return request.post("user/human/control", params)
}
