import type { UploadRawFile } from "element-plus"

// http://wiki.voneyun.com/pages/viewpage.action?pageId=16680340
export type TQuickLoginReqParams = {
  mobile: string
  mobileRegion: string
  mobileCaptcha: string
}
export type TQuickLoginResParams = {
  token: string
  userKey: string
  userId: string
}

// http://wiki.voneyun.com/pages/viewpage.action?pageId=16680424
export type TQuickLoginSendSMSReqParams = {
  mobile: string
  lotNumber: string
  captchaOutput: string
  passToken: string
  genTime: string
}
export type TQuickLoginSendSMSResParams = {
  captchaNo: string
}

// http://wiki.voneyun.com/pages/viewpage.action?pageId=16680444
export type TLoginPWDReqParams = {
  mobile: string
  password: string
  lotNumber: string
  captchaOutput: string
  passToken: string
  genTime: string
}
export type TLoginPWDResParams = {
  token: string
  userKey: string
  userId: string
}

export type TPWDInputValues = Pick<TLoginPWDReqParams, "mobile" | "password">
// http://wiki.voneyun.com/pages/viewpage.action?pageId=16680437
export type TModifyPWDReqParams = {
  password: string
  confirmPassword: string
}

// http://wiki.voneyun.com/pages/viewpage.action?pageId=16680434
export type TUserInfoReqParams = {}
export type TCapitalDetail = {
  type: number
  name: string
  balance: string
}
export type TAssetsStoreDetail = {
  total: string
  regionId: string
  free: string
  used: string
}

export type TUserInfoResParams = {
  userName?: string
  passwordStatus?: number
  mobile?: string
  userAvatar?: string
  capitalDetailList?: Array<TCapitalDetail>
  assetsStoreDetail?: TAssetsStoreDetail
}

export type TOptBizType = 0 | 1 | 2 | 3

export type TCaptchaInfoReqParams = {
  optBizType: TOptBizType
}
export type TCaptchaInfoResParams = {
  captchaChannel: string
  captchaId: string
}

// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515701
export type TLoggedSendSMSReqParams = {
  mobile: string
  smsBizType: int
  lotNumber: string
  captchaOutput: string
  passToken: string
  genTime: string
  extend?: {
    sourceMobileCaptcha: string
  }
}
export type TLoggedSendSMSResParams = {
  captchaNo: stirng
}

// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515707
export type TVerifyLoggedSMSReqParams = {
  mobile?: string
  smsBizType: number
  mobileCaptcha: string
}

// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515716
export type TModifyMobileReqParams = {
  targetMobile: string
  targetMobileCaptcha: string
}

// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515720
export type TModifyUserNameReqParams = {
  name: string
}

// http://wiki.voneyun.com/pages/viewpage.action?pageId=22517384
export type TSetPWDReqParams = {
  password: string
  confirmPassword: string
  mobileCaptcha: string
}

// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515816
export type TResetPWDReqParams = {
  mobile: string
  password: string
  confirmPassword: string
  mobileCaptcha: string
}

// http://wiki.voneyun.com/pages/viewpage.action?pageId=61802514
export type TSendSMSUnloginReqParams = {
  mobile: string
  smsBizType: number
  lotNumber: string
  captchaOutput: string
  passToken: string
  genTime: string
}
export type TSendSMSUnloginResParams = {
  captchaNo: string
}

export type TSetSMSCodeApiPartialParams = {
  mobile?: string
  smsBizType?: number
}
// http://wiki.voneyun.com/pages/viewpage.action?pageId=22515705
export type TVerifyUnloginSMSReqParams = {
  mobile: string
  smsBizType: number
  mobileCaptcha: string
}

export type TAvatarReqParams = {
  avatarFile: UploadRawFile | FormData
}
// export type TResParams = {

// }

// export type TReqParams = {

// }
// export type TResParams = {

// }

// export type TReqParams = {

// }
// export type TResParams = {

// }
