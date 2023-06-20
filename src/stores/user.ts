import { ref } from "vue"
import { defineStore } from "pinia"
import type { TUserInfoResParams } from "../types/user"

const useUserInfoStore = defineStore("userInfo", () => {
  const userInfo = ref<TUserInfoResParams>()

  const setUserInfo = (data: TUserInfoResParams) => {
    if (data.userAvatar) {
      data.userAvatar += `?t=${Date.now()}`
    }
    userInfo.value = data
    userInfo.value.userId = localStorage.getItem("userId") || ""
  }

  return { userInfo, setUserInfo }
})

export default useUserInfoStore
