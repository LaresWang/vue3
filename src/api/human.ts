// 数字人相关
import request from "./request"
import type {
  TPlateFormHumanResParams,
  TUserHUmanResParams,
  TPageReqParams,
  TEmotionCatg,
  TEmotionParams,
  TActionParams,
  TEditHumanConfigResParams
} from "../types/human"

// 平台数字人模版列表
// http://wiki.voneyun.com/pages/viewpage.action?pageId=61802669
export const getPlatformHumanLists = function () {
  return request.post<TPlateFormHumanResParams>("platform/human/template/list")
}

// 用户数字人列表
// http://wiki.voneyun.com/pages/viewpage.action?pageId=61802671
export const getUserHumanLists = function (params: TPageReqParams) {
  return request.post<TUserHUmanResParams>("user/human/page", params)
}

// 数字人素材-表情
// http://wiki.voneyun.com/pages/viewpage.action?pageId=61803532
export const getHumanEmotionLists = function (params: TEmotionCatg) {
  return request.post<TEmotionParams[]>("user/human/material/face/list", params)
}

// 数字人素材-动作
// http://wiki.voneyun.com/pages/viewpage.action?pageId=61803546
export const getHumanActionLists = function () {
  return request.post<TActionParams[]>("user/human/material/action/list")
}

// 数字人捏脸配置
// http://wiki.voneyun.com/pages/viewpage.action?pageId=61803609
export const getHumanHeaderEditConfig = function () {
  return request.post<TEditHumanConfigResParams[]>("user/human/edit/config")
}
