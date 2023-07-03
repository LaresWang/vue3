// 数字人相关
import request from "./request"
import type {
  THumanModelInfos,
  TUserHUmanResParams,
  TPageReqParams,
  TEmotionCatg,
  TEmotionParams,
  TActionReqParams,
  TActionParams,
  TEditHumanConfigResParams,
  TModifyHumanNameReqParams,
  TModifyHumanNameResParams,
  TSaveHumanModelResParams,
  TDeleteHumanReqParams,
  TDeleteHumanResultReqParams,
  TCopyHumanReqParams,
  TCopyHumanResParams,
  TCopyHumanResultReqParams
} from "../types/human"

// import { buildinModels, userModels, editModelConfig, emotionLists, actionLists } from "./mock"
import { emotionLists } from "./mock"

// 平台数字人模版列表
// http://wiki.voneyun.com/pages/viewpage.action?pageId=61802669
export const getPlatformHumanLists = function () {
  // return Promise.resolve(buildinModels)
  // return new Promise<THumanModelInfos[]>((res) => {
  //   res(buildinModels.slice(0, 3))
  // })
  return request.post<THumanModelInfos[]>("platform/human/template/list")
}

// 用户数字人列表
// http://wiki.voneyun.com/pages/viewpage.action?pageId=61802671
export const getUserHumanLists = function (params: TPageReqParams) {
  // return new Promise<TUserHUmanResParams>((res) => {
  //   const { pageNo, pageSize } = params
  //   const totalRow = userModels.length
  //   const totalPage = Math.ceil(totalRow / pageSize)
  //   const rows = userModels.slice((pageNo - 1) * pageSize, pageNo * pageSize)
  //   res({
  //     pageNo,
  //     pageSize,
  //     totalRow,
  //     totalPage,
  //     rows
  //   })
  // })
  return request.post<TUserHUmanResParams>("user/human/page", params)
}

// 数字人素材-表情
// http://wiki.voneyun.com/pages/viewpage.action?pageId=61803532
export const getHumanEmotionLists = function (params: TEmotionCatg) {
  // return new Promise<TEmotionParams[]>((res) => {
  //   if (params.category === 0) {
  //     res(JSON.parse(JSON.stringify(emotionLists)))
  //   } else {
  //     res(JSON.parse(JSON.stringify(emotionLists.reverse())))
  //   }
  // })
  return request.post<TEmotionParams[]>("user/human/material/face/list", params)
}

// 数字人素材-动作
// http://wiki.voneyun.com/pages/viewpage.action?pageId=61803546
export const getHumanActionLists = function (params: TActionReqParams) {
  // console.log(params)
  // return Promise.resolve(actionLists)
  return request.post<TActionParams[]>("user/human/material/action/list", params)
}

// 数字人捏脸配置
// http://wiki.voneyun.com/pages/viewpage.action?pageId=61803609
export const getHumanHeaderEditConfig = function (): Promise<TEditHumanConfigResParams | undefined> {
  // return Promise.resolve(editModelConfig)
  return request.post("user/human/face/config").then((res) => {
    try {
      if (typeof res === "string") {
        const temp = JSON.parse(res) as TEditHumanConfigResParams
        return temp
      }
    } catch (e) {
      return
    }
  })
}
// 获取预设列表
export const getBodyPresetLists = function () {
  return Promise.resolve(emotionLists)
}
// 修改数字人名称
export const modifyHumanName = function (params: TModifyHumanNameReqParams) {
  return request.post<TModifyHumanNameResParams>("user/human/name/modify", params)
}
// 保存数字人
export const saveHumanModel = function (params: FormData) {
  return request.post<TSaveHumanModelResParams>("user/human/modify", params)
}
// 删除数字人
export const deleteHumanModel = function (params: TDeleteHumanReqParams) {
  return request.post("user/human/remove", params)
}
// 删除结果
export const deleteHumanModelResult = function (params: TDeleteHumanResultReqParams) {
  return request.post("user/human/remove/result", params)
}
// 复制数字人
export const copyHumanModel = function (params: TCopyHumanReqParams) {
  return request.post<TCopyHumanResParams>("user/human/copy", params)
}
// 复制结果
export const copyHumanModelResult = function (params: TCopyHumanResultReqParams) {
  return request.post("user/human/copy/result", params)
}
