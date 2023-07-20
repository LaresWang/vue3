import { ref } from "vue"
import { getCaptchaInfo, getUserInfo } from "../../api/user"
import type { TOptBizType, TUserInfoResParams } from "../../types/user"
import useUserInfoStore from "../../stores/user"

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
    const marginTop = loginEle.offsetTop || 0
    const { top, left, right, bottom } = position
    let geetestEles = document.querySelectorAll<HTMLElement>(".geetest_box_wrapV4")
    if (!geetestEles.length) {
      geetestEles = document.querySelectorAll<HTMLElement>(".geetest_box_wrap")
    }
    // 极验弹窗宽度340px  left+340<width-50
    const width = document.documentElement.clientWidth
    if (left + 340 + 50 < width) {
      geetestEles.forEach((ele) => {
        ele.style.right = "inherit"
        ele.style.top = top + marginTop + "px"
        ele.style.left = left + "px"
        ele.style.transform = "none"
        ele.style.height = bottom-top +"px"
        ele.style.minHeight = "380px"
        ele.style.width = right-left + "px"
        ele.style.maxWidth = right-left + "px"
      })
    } else {
      geetestEles.forEach((ele) => {
        ele.style.left = "inherit"
        ele.style.top = top + marginTop + "px"
        ele.style.right = "50px"
        ele.style.transform = "none"
        ele.style.minHeight = "380px"
        ele.style.width = right-left + "px"
        ele.style.maxWidth = right-left + "px"

      })
    }
  } catch (e) {
    console.log(e)
  }
}

export const useGetUserInfo = (immediate = false) => {
  const userInfo = ref<TUserInfoResParams>()
  const { setUserInfo } = useUserInfoStore()

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
