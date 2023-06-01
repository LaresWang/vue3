import { ref } from "vue"
import { getLoggedSMSCode } from "@/api/user"
import type { TLoggedSendSMSReqParams } from "@/types/user"
import message from "@/utils/message"
import { t } from "@/locale"

type TSMSCodePartialParams = {
  mobile?: string
  codeType?: number
  sourceMobileCaptcha?: string
}
export const useCaptchaInitSet = () => {
  let captchaObj: any
  const captchaNo = ref("")

  let mobile = ""
  let codeType: number
  let sourceMobileCaptcha = ""

  const setSMSCodeParams = (options: TSMSCodePartialParams) => {
    if (options.codeType) {
      // codeType 1-设置手机号 3-设置密码
      codeType = options.codeType
    }
    if (options.mobile) {
      mobile = options.mobile
    } else {
      mobile = ""
    }
    if (options.sourceMobileCaptcha) {
      sourceMobileCaptcha = options.sourceMobileCaptcha
    } else {
      sourceMobileCaptcha = ""
    }
  }

  const getMsgCode = (options: TSMSCodePartialParams) => {
    setSMSCodeParams(options)
    captchaObj?.showCaptcha()
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
            /** result
             * {
                  "captcha_id": "a37103308ef6662774d5f985cea960c2",
                  "lot_number": "5fc9c1ac1d1842c58be14b640ea461c9",
                  "pass_token": "3e8686000e5a72b7a8496cc0685d6a86b40901c4399ce2a8df2658da39be62e7",
                  "gen_time": "1659929545",
                  "captcha_output": "5iURjie-guomskqy5I........."
              }
             */
            const params: TLoggedSendSMSReqParams = {
              lotNumber: result.lot_number,
              captchaOutput: result.captcha_output,
              passToken: result.pass_token,
              genTime: result.gen_time,
              mobile,
              // 如果this.mobile存在 说明是给新手机号发验证码，this.codeType 1-设置手机号 3-设置密码
              // smsBizType 2-修改设置密码 3-更改手机号原手机号 4-更换新手机号新手机号
              smsBizType: mobile ? 4 : codeType === 3 ? 2 : 3
            }
            mobile && (params.extend = { sourceMobileCaptcha })
            getLoggedSMSCode(params).then((data) => {
              mobile = ""
              codeType = 0
              // 待接口成功调用后显示提示语和执行倒计时操作
              captchaNo.value = data.captchaNo
              message(t("user.t19", { value: data.captchaNo }))
            })
          })
          .onError(() => {
            //重置验证码
            console.log("errr")
            captcha && captcha.reset()
          })
      }
    )
  }

  return { captchaNo, startInitGeetest, getMsgCode }
}
