import { reactive } from "vue"
import { defineStore } from "pinia"
import type { TUserInfoResParams } from "../types/user"

const useUserInfo = defineStore("userInfo", () => {
  const info = reactive({ value: {} })
  const setUserInfo = (data: TUserInfoResParams) => {
    if (data.userAvatar) {
      data.userAvatar += `?t=${Date.now()}`
    }
    info.value = data
  }
  // TODO info.value / toRefs
  return { info, setUserInfo }
})

export default useUserInfo
