import { reactive } from "vue"
import { defineStore } from "pinia"
import type { TUserInfoResParams } from "../types/user"

const useUserInfo = defineStore("userInfo", () => {
  const userInfo = reactive<TUserInfoResParams>({})
  const setUserInfo = (data: TUserInfoResParams) => {
    if (data.userAvatar) {
      data.userAvatar += `?t=${Date.now()}`
    }
    userInfo.mobile = data.mobile
    userInfo.userAvatar = data.userAvatar
    userInfo.userName = data.userName
    userInfo.assetsStoreDetail = data.assetsStoreDetail
    userInfo.capitalDetailList = data.capitalDetailList
    userInfo.passwordStatus = data.passwordStatus
  }

  return { userInfo, setUserInfo }
})

export default useUserInfo
