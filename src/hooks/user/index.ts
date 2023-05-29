import { ref } from "vue"
import { getCaptchaInfo } from "../../api/user";
import type { TOptBizType } from "../../types/user"

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

const getCaptchaId = async (optBizType:TOptBizType, cb: Function) => {
  try {
    const res = await getCaptchaInfo({ optBizType});
    cb(res.captchaId)
  } catch (e) {
    console.log(e)
  }
}

export const useGetCaptchaId = (num: TOptBizType) => {
  const captchaId = ref("")
  getCaptchaId(num, (captchId: string)=>{
    captchaId.value = captchId
  })
  return { captchaId }
}

export const computedPosition = (selector: string) => {
  try {
    const loginEle = document.querySelector<HTMLElement>(selector);
    if (!loginEle) {
      return
    }
    const position = loginEle.getBoundingClientRect();
    const { top, left } = position;
    let geetestEles = document.querySelectorAll<HTMLElement>(".geetest_box_wrapV4");
    if (!geetestEles.length) {
      geetestEles = document.querySelectorAll<HTMLElement>(".geetest_box_wrap");
    }
    geetestEles.forEach((ele) => {
      ele.style.top = top + "px";
      ele.style.left = left + "px";
      ele.style.transform = "none";
      ele.style.minHeight = "380px";
    });
  } catch (e) {
    console.log(e);
  }
}