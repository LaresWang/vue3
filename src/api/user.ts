// 用户相关接口
import request from "./request"
import type {
  TQuickLoginReqParams,
  TQuickLoginResParams,
  TQuickLoginSendSMSReqParams,
  TQuickLoginSendSMSResParams,
  TLoginPWDReqParams,
  TLoginPWDResParams,
  TModifyPWDReqParams,
  TUserInfoResParams,
  TCaptchaInfoReqParams,
  TCaptchaInfoResParams,
  TLoggedSendSMSReqParams,
  TLoggedSendSMSResParams,
  TVerifyLoggedSMSReqParams,
  TModifyMobileReqParams,
  TModifyUserNameReqParams,
  TSetPWDReqParams,
  TResetPWDReqParams,
  TSendSMSUnloginReqParams,
  TSendSMSUnloginResParams,
  TVerifyUnloginSMSReqParams,
} from "../types/user"

// // 一键登录
// // http://wiki.voneyun.com/pages/viewpage.action?pageId=16680340
export const loginBySMSCode = function (params: TQuickLoginReqParams) {
  return request.post<TQuickLoginResParams>("user/quicklogin", params);
};

// 发送一键登录手机验证码，
// http://wiki.voneyun.com/pages/viewpage.action?pageId=16680424
export const getSMSCode = function (params:TQuickLoginSendSMSReqParams) {
  return request.post<TQuickLoginSendSMSResParams>("sms/quicklogin/send", params)
};
// 密码登录
// http://wiki.voneyun.com/pages/viewpage.action?pageId=16680444
export const loginByPassword = function (params:TLoginPWDReqParams) {
  return request.post<TLoginPWDResParams>("user/login", params)
};

// // 密码设置、修改
// // http://wiki.voneyun.com/pages/viewpage.action?pageId=16680437
export const modifyPassword = function (params: TModifyPWDReqParams) {
  return request.post("user/password/modify", params)
};

// 退出
// http://wiki.voneyun.com/pages/viewpage.action?pageId=16680442
export const logout = function () {
  return request.post("user/logout")
};

// 获取登录人基本信息
// http://wiki.voneyun.com/pages/viewpage.action?pageId=16680434
export const getUserInfo = function () {
  return request.post<TUserInfoResParams>("user/info")
};

// // 稍后设置密码
// // http://wiki.voneyun.com/pages/viewpage.action?pageId=22511729
export const setPasswordLater = function () {
  return request.post("user/password/laterSetting")
};

// // 获取极验ID
export const getCaptchaInfo = function (params:TCaptchaInfoReqParams) {
  return request.post<TCaptchaInfoResParams>("user/login/getCaptchaInfo", params)
};

// // 上传用户头像
// export const uploadAvatar = function (params) {
//   return httpPost("user/avatar/setting", params, {
//     headers: {
//       "content-type": "multipart/form-data",
//     },
//   });
// };

// 登录后在设置页面设置前需要手机短信验证码
// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515701
export const getLoggedSMSCode = function (params: TLoggedSendSMSReqParams) {
  return request.post<TLoggedSendSMSResParams>("sms/sendOnLogged", params)
};

// 登录后在设置页面设置前进行当前手机号验证码校验
// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515707
export const verifyLoggedSMSCode = function (params:TVerifyLoggedSMSReqParams) {
  return request.post("sms/verifyOnLogged", params)
};

// 更换新手机号
// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515716
export const changeUserMobile = function (params: TModifyMobileReqParams) {
  return request.post("user/mobile/modify", params)
};

// 更新用户名
// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515720
export const changeUserName = function (params: TModifyUserNameReqParams) {
  return request.post("user/name/modify", params)
};

// 更新密码
// http://wiki.voneyun.com/pages/viewpage.action?pageId=22517384
export const changeUserPassword = function (params: TSetPWDReqParams) {
  return request.post("user/password/setting", params)
};

// 找回密码
// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515816
export const pwdReset = function (params: TResetPWDReqParams) {
  return request.post("user/password/reset", params)
};

// 发送手机验证码（未登录）
// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515699
export const sendSMSCode = function (params: TSendSMSUnloginReqParams) {
  return request.post<TSendSMSUnloginResParams>("sms/send", params)
};

// 验证手机验证码（未登录）
// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515705
export const smsVerify = function (params: TVerifyUnloginSMSReqParams) {
  return request.post("sms/verify", params)
};
// // 获取服务区存储信息
// export const serverregionGet = function (params) {
//   return httpPost("serverregion/get", params);
// };

// // 充值 。。。账户。。。

// // 余额 301-充值账户 302-信用账户 303-实时币账户 304-优惠券账户 ，多个逗号分隔
// export const getUserBalance = function (params) {
//   return httpPost("capital/balance", params);
// };

// // 充值列表
// export const getRechargePlans = function (params = {}) {
//   console.log(params);
//   return httpPost("recharge/options", params);
// };

// // 获取充值路由
// export const getRechargeUrl = function (params) {
//   console.log(params);
//   return httpPost("recharge/getPayConfig", params);
// };

// // 充值记录
// export const getRechargeRecords = function (params = {}) {
//   console.log(params);
//   return httpPost("recharge/list", params);
// };

// // TODO 导出充值记录
// export const getBizTypeList = function (params = {}) {
//   console.log(params);
//   return httpPost("common/bizTypeList", params);
// };

// // TODO 导出充值记录
// export const exportRechargeRecords = function (params = {}) {
//   console.log(params);
//   return httpPost("recharge/list/download", params, { responseType: "blob" });
// };

// // 消费明细
// export const getBills = function (params = {}) {
//   console.log(params);
//   return httpPost("consumption/list", params);
// };

// // 导出消费明细
// export const exportBills = function (params = {}) {
//   console.log(params);
//   return httpPost("consumption/download", params, { responseType: "blob" });
// };

// // TODO 支付二维码

// // 统计
// // 统计概要
// export const summaryStats = function (params) {
//   console.log(params);
//   return httpPost("statistics/detail", params);
// };

// // 根据时间统计
// export const statsByDateTime = function (params) {
//   console.log(params);
//   return httpPost("statistics/instance/time", params);
// };

// // 根据次数统计
// export const statsByCount = function (params) {
//   console.log(params);
//   return httpPost("statistics/instance/count", params);
// };

// // 获取指定日期的次数
// export const statsCountByDay = function (params) {
//   console.log(params);
//   return httpPost("statistics/instance/count/day", params);
// };

// // 统计明细
// export const statsLists = function (params) {
//   console.log(params);
//   return httpPost("statistics/instance/list", params);
// };

// // 导出统计明细
// export const exportStatsLists = function (params) {
//   return httpPost("statistics/instance/download", params, { responseType: "blob" });
// };
