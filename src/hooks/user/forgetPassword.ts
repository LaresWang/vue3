import { ref } from "vue"

import { sendSMSCode } from "../../api/user"
import type { TSetSMSCodeApiPartialParams } from "../../types/user"
import { computedPosition } from "./index"
import message from "../../utils/message"
import { t } from "../../locale"

export const useCaptchaInit = () => {
  let captchaObj: any
  const captchaNo = ref("")

  let mobile = ""
  let smsBizType = 1
  const setSMSCodeParams = (options: TSetSMSCodeApiPartialParams) => {
    if (options.smsBizType) {
      smsBizType = options.smsBizType
    }
    if (options.mobile) {
      mobile = options.mobile
    }
  }

  const getMsgCode = (options: TSetSMSCodeApiPartialParams) => {
    setSMSCodeParams(options)
    captchaObj.showCaptcha()
    computedPosition(".nt-forget-pwd")
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
              mobile: mobile,
              smsBizType: smsBizType,
              lotNumber: result.lot_number,
              captchaOutput: result.captcha_output,
              passToken: result.pass_token,
              genTime: result.gen_time
            }).then((data) => {
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
