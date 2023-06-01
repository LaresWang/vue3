import { ref } from "vue"
import { getCaptchaInfo, getUserInfo } from "../../api/user"
import type { TOptBizType, TUserInfoResParams } from "../../types/user"
import useUserInfo from "../../stores/user"

export const useCountDownStatus = () => {
  const isCountingDown = ref(false)
  const startCountDown = () => {
    isCountingDown.value = true
  }
  const stopCountDown = () => {
    isCountingDown.value = false
  }

  return { isCountingDown, startCountDown, stopCountDown }
}

const getCaptchaId = async (optBizType: TOptBizType, cb: Function) => {
  try {
    // optBizType: 0-登录 1-找回密码 2-修改密码 3-修改手机号
    const res = await getCaptchaInfo({ optBizType })
    cb(res.captchaId)
  } catch (e) {
    console.log(e)
  }
}

export const useGetCaptchaId = (num: TOptBizType) => {
  const captchaId = ref("")
  getCaptchaId(num, (captchId: string) => {
    captchaId.value = captchId
  })
  return { captchaId }
}

export const computedPosition = (selector: string) => {
  try {
    const loginEle = document.querySelector<HTMLElement>(selector)
    if (!loginEle) {
      return
    }
    const position = loginEle.getBoundingClientRect()
    const { top, left } = position
    let geetestEles = document.querySelectorAll<HTMLElement>(".geetest_box_wrapV4")
    if (!geetestEles.length) {
      geetestEles = document.querySelectorAll<HTMLElement>(".geetest_box_wrap")
    }
    geetestEles.forEach((ele) => {
      ele.style.top = top + "px"
      ele.style.left = left + "px"
      ele.style.transform = "none"
      ele.style.minHeight = "380px"
    })
  } catch (e) {
    console.log(e)
  }
}

export const useGetUserInfo = (immediate = false) => {
  const userInfo = ref<TUserInfoResParams>()
  const { setUserInfo } = useUserInfo()

  const getUser = async () => {
    try {
      const res = await getUserInfo()
      userInfo.value = res
      setUserInfo(res)
      localStorage.setItem("userInfo", JSON.stringify(res))
    } catch (e) {
      console.log(e)
    }
  }
  if (immediate) {
    getUser()
  }

  return { userInfo, getUser }
}
