import { ref } from "vue"

import { loginByPassword, sendSMSCode } from "../../api/user"
import type { TPWDInputValues } from "../../types/user"
import { computedPosition } from "./index"
import { loginDone } from "../../utils/jump"
import message from "../../utils/message"
import { t } from "../../locale"

export const useCaptchaInitSMS = () => {
  let captchaObj: any
  const captchaNo = ref("")

  let mobile = ""

  const getMsgCode = (mb: string) => {
    mobile = mb
    captchaObj.showCaptcha()
    computedPosition(".login-register")
  }

  const startInitGeetest = (captchaId: string) => {
    window.initGeetest4(
      {
        captchaId,
        product: "bind"
      },
      (captcha) => {
        // captcha为验证码实例
        // captcha.appendTo("#captcha"); // 调用appendTo将验证码插入到页的某一个元素中，这个元素用户可以自定义
        captcha
          .onReady(() => {
            //验证码ready之后才能调用showCaptcha方法显示验证码
            captchaObj = captcha
          })
          .onSuccess(() => {
            const result = captcha.getValidate()
            console.log(result)
            sendSMSCode({
              lotNumber: result.lot_number,
              captchaOutput: result.captcha_output,
              passToken: result.pass_token,
              genTime: result.gen_time,
              mobile,
              smsBizType: 0
            }).then((data) => {
              // 待接口成功调用后显示提示语和执行倒计时操作
              captchaNo.value = data.captchaNo
              message(t("user.t19", { value: data.captchaNo }))
            })
          })
          .onError(() => {
            //重置验证码
            console.log("errr")
            captcha.reset()
          })
      }
    )
  }

  return { captchaNo, startInitGeetest, getMsgCode }
}

export const useCaptchaInitPWD = () => {
  let captchaObj: any
  const isLoging = ref(false)
  let loginCb: Function | null = null

  let pwdLoginPartialParams: TPWDInputValues

  const loginByPwd = (options: TPWDInputValues, cb?: Function) => {
    pwdLoginPartialParams = options
    captchaObj.showCaptcha()
    computedPosition(".login-register")
    if (cb) {
      loginCb = cb
    }
  }

  const setLogingStatus = (status: boolean) => {
    isLoging.value = status
  }

  const startInitGeetest = (captchaId: string) => {
    window.initGeetest4(
      {
        captchaId,
        product: "bind"
      },
      (captcha) => {
        // captcha为验证码实例
        // captcha.appendTo("#captcha"); // 调用appendTo将验证码插入到页的某一个元素中，这个元素用户可以自定义
        captcha
          .onReady(() => {
            //验证码ready之后才能调用showCaptcha方法显示验证码
            captchaObj = captcha
          })
          .onSuccess(() => {
            isLoging.value = true
            const result = captcha.getValidate()
            loginByPassword({
              lotNumber: result.lot_number,
              captchaOutput: result.captcha_output,
              passToken: result.pass_token,
              genTime: result.gen_time,
              ...pwdLoginPartialParams
            })
              .then((data) => {
                loginDone(data)
                isLoging.value = false
                if (typeof loginCb === "function") {
                  loginCb(true)
                }
              })
              .catch((e) => {
                console.log(e)
                isLoging.value = false
                loginCb = null
              })
          })
          .onError(() => {
            //重置验证码
            console.log("errr")
            captcha.reset()
          })
      }
    )
  }

  return { isLoging, startInitGeetest, loginByPwd, setLogingStatus }
}
