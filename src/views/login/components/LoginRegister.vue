<template>
  <div class="login-register">
    <div class="login-register-title">{{ $t("common.welcome_text") }}</div>
    <div class="login-register-inner">
      <div class="login-type-btns-group flex-start">
        <div
          class="login-type-btn flex-v pointer"
          :class="rdata.loginType === 1 ? 'active' : ''"
          @click="toggleLoginType(1)"
        >
          <span class="pb4">{{ $t("user.t9") }}</span>
        </div>
        <div
          class="login-type-btn flex-v pointer"
          :class="rdata.loginType === 2 ? 'active' : ''"
          @click="toggleLoginType(2)"
        >
          <span class="pb4">{{ $t("user.t8") }}</span>
        </div>
      </div>
      <!-- 登录/注册 -->
      <!-- {{ $t("t18") }} -->
      <div class="login-inputs-area mt30">
        <!-- 输入手机号 -->
        <div
          class="input-item flex-start without-status-icon"
          :class="rdata.mobileInfos.error ? 'is-error' : ''"
        >
          <el-input
            v-model="rdata.loginInfo.mobile"
            :placeholder="$t('user.t1')"
            @focus="focus('mobile')"
            @input="change('mobile')"
            @blur="blur('mobile')"
            @keyup.enter="login"
          />
          <div class="prefix-input-icon-wrapper flex-center">
            <!-- <svg-icon name="icon_verify" /> -->
            <img src="@/assets/imgs/icon_account_a.svg" />
          </div>
          <span
            v-if="rdata.mobileInfos.error"
            class="err-msg fix-err-msg"
          >
            {{ rdata.mobileInfos.error }}
          </span>
        </div>

        <!-- 短信验证码 -->
        <div
          v-show="rdata.loginType === 1"
          class="input-item with-button without-status-icon"
          :class="rdata.msgcodeInfos.error ? 'is-error' : ''"
        >
          <el-input
            v-model="rdata.loginInfo.msgcode"
            :placeholder="captchaNo ? $t('user.t22', { value: captchaNo }) : $t('user.t2')"
            @focus="focus('msgcode')"
            @input="change('msgcode')"
            @blur="blur('msgcode')"
            @keyup.enter="login"
          />
          <div class="msg-code-btn flex-center">
            <CountDown
              v-if="isCountingDown"
              @done="countDownFinished"
            />
            <el-button
              v-else
              :disabled="!rdata.mobileInfos.ok"
              @click="getMsgCode(rdata.loginInfo.mobile!)"
            >
              <span>{{ $t("user.t7") }}</span>
            </el-button>
          </div>
          <div class="prefix-input-icon-wrapper flex-center">
            <img src="@/assets/imgs/icon_verify.svg" />
            <!-- <svg-icon
            /> -->
          </div>

          <span
            v-if="rdata.msgcodeInfos.error"
            class="err-msg fix-err-msg"
          >
            {{ rdata.msgcodeInfos.error }}
          </span>
        </div>
        <!-- 密码组件 -->
        <div
          v-if="rdata.loginType === 2"
          class="input-item without-status-icon without-pb"
        >
          <PasswordInput
            @validate="validatePwd"
            @enterPress="login"
          />
          <div class="flex-end">
            <div
              class="forget-p pointer"
              @click="forget"
            >
              {{ $t("user.t31") }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="login-btn"
        :class="rdata.loginType === 2 ? 'pwd' : ''"
      >
        <el-button
          type="primary"
          :disabled="rdata.loginBtnDisabled"
          @click="login"
        >
          <!-- 登录/注册 -->
          {{ $t("user.t18") }}
        </el-button>
      </div>

      <div class="policy-clause flex-center">
        <span>{{ $t("user.t20") }}</span>
        <span
          class="blue-font pointer"
          @click="goPage('/agreement')"
        >
          {{ $t("user.t23") }}</span
        >
        <!-- <span class="blue-font pointer">{{ $t("t24") }}</span> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { watch, reactive, onMounted } from "vue"
  import { useRouter } from "vue-router"
  import { loginBySMSCode } from "@/api/user"
  import { useCaptchaInitPWD, useCaptchaInitSMS } from "@/hooks/user/login"
  import { useCountDownStatus, useGetCaptchaId } from "@/hooks/user"

  import {
    validateMobileChange,
    validateMobileBlur,
    validateEmptyForMsgCodeBlur,
    validateEmptyForMsgCodeChange
    // validateEmptyForPasswordBlur,
    // validateEmptyForPasswordChange,
  } from "@/utils/validate"

  import { openUrlWithAElement } from "@/utils/jump"
  import { loginDone } from "@/utils/jump"

  import PasswordInput from "@/components/PasswordInput.vue"
  import CountDown from "@/components/CountDown.vue"

  type TLoginInfoProps = "mobile" | "msgcode"
  type TRdata = {
    loginType: number // 1-短信验证码登录 2-密码登录
    loginInfo: {
      mobile?: string
      msgcode?: string
      pwd?: string
    }
    mobileInfos: {
      ok?: boolean
      error?: string
    }
    pwdInfos: {
      ok?: boolean
    }
    msgcodeInfos: {
      ok?: boolean
      error?: string
    }
    loginBtnDisabled: boolean
  }

  const rdata = reactive<TRdata>({
    loginType: parseInt(localStorage.getItem("loginType") || "1"), // 1-短信验证码登录 2-密码登录
    loginInfo: {},
    mobileInfos: {},
    pwdInfos: {},
    msgcodeInfos: {},
    loginBtnDisabled: true
  })

  const uRouter = useRouter()
  const { captchaId } = useGetCaptchaId(0)
  const { captchaNo, getMsgCode, startInitGeetest: initGeetestSMS } = useCaptchaInitSMS()
  const { isLoging, loginByPwd, startInitGeetest: initGeetestPWD, setLogingStatus } = useCaptchaInitPWD()
  const { isCountingDown, startCountDown, stopCountDown } = useCountDownStatus()

  watch(captchaId, (val) => {
    if (val) {
      initGeetestSMS(val)
      initGeetestPWD(val)
    }
  })

  watch(captchaNo, (val) => {
    if (val) {
      startCountDown()
    }
  })

  onMounted(() => {
    if (rdata.loginType === 2) {
      localStorage.removeItem("loginType")
    }
  })

  const toggleLoginType = (type: number) => {
    // 切换的时候需要把密码和验证码清空
    if (rdata.loginType !== type) {
      rdata.loginType = type
      if (type === 1) {
        rdata.loginInfo.pwd = ""
        rdata.pwdInfos = {}
      } else {
        rdata.loginInfo.msgcode = ""
        rdata.msgcodeInfos = {}
      }
      if (!rdata.loginInfo.mobile) {
        rdata.mobileInfos = {}
      }
      updateLoginBtnStatus()
    }
  }

  const login = () => {
    // TODO enter.native 修饰符用不了，注意测试enter事件
    // https://segmentfault.com/q/1010000043709882
    if (rdata.loginBtnDisabled || isLoging.value) {
      return
    }
    if (rdata.loginType === 1) {
      setLogingStatus(true)
      loginBySMSCode({
        mobile: rdata.loginInfo.mobile!,
        mobileRegion: "86",
        mobileCaptcha: rdata.loginInfo.msgcode!
      })
        .then((data) => {
          loginDone(data)
        })
        .catch((e) => {
          console.log(e)
          setLogingStatus(false)
        })
      // this.loginJump({});
    } else {
      // 密码登录时点击登录先弹出图形验证码
      loginByPwd({
        mobile: rdata.loginInfo.mobile!,
        password: rdata.loginInfo.pwd!
      })
    }
  }

  const focus = (prop: TLoginInfoProps) => {
    const fullProp = (prop + "Infos") as "msgcodeInfos" | "mobileInfos"
    rdata[fullProp].error = ""
  }

  const change = (prop: TLoginInfoProps) => {
    if (prop === "mobile") {
      validateAndSetInfos(validateMobileChange, prop)
    } else if (prop === "msgcode") {
      validateAndSetInfos(validateEmptyForMsgCodeChange, prop)
    }
    // else if (prop === "pwd") {
    //   // this.validateAndSetInfos(validateEmptyForPasswordChange, prop);
    // }
  }

  const blur = (prop: TLoginInfoProps) => {
    if (prop === "mobile") {
      validateAndSetInfos(validateMobileBlur, prop)
    } else if (prop === "msgcode") {
      validateAndSetInfos(validateEmptyForMsgCodeBlur, prop)
    }
    // else if (prop === "pwd") {
    //   // this.validateAndSetInfos(validateEmptyForPasswordBlur, prop);
    // }
  }

  const validateAndSetInfos = (validate: Function, prop: TLoginInfoProps) => {
    const ret = validate(rdata.loginInfo[prop])
    const fullProp = (prop + "Infos") as "msgcodeInfos" | "mobileInfos"
    rdata[fullProp] = {
      error: ret.error,
      ok: ret.ok
    }

    if (ret.reviseValue) {
      rdata.loginInfo[prop] = ret.reviseValue
    }
    if (ret.clear) {
      rdata.loginInfo[prop] = undefined
    }
    updateLoginBtnStatus()
  }

  const validatePwd = (valid: boolean, val: string) => {
    if (valid) {
      rdata.loginInfo.pwd = val
      rdata.pwdInfos.ok = true
    } else {
      rdata.pwdInfos.ok = false
    }
    updateLoginBtnStatus()
  }

  const updateLoginBtnStatus = () => {
    if (rdata.mobileInfos.ok && (rdata.loginType === 1 ? rdata.msgcodeInfos.ok : rdata.pwdInfos.ok)) {
      rdata.loginBtnDisabled = false
    } else {
      rdata.loginBtnDisabled = true
    }
  }

  const forget = () => {
    uRouter.push("/forgetPassword")
  }

  const goPage = (path: string) => {
    openUrlWithAElement(location.origin + path, "_blank")
  }

  const countDownFinished = () => {
    stopCountDown()
  }
</script>
<style lang="less">
  .login-register {
    margin-top: 24px;
    width: 400px;
    height: 420px;
    .login-register-title {
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 600;
      font-size: 40px;
      line-height: 56px;
      color: var(--c-black-2);
      padding-bottom: 64px;
    }
    .login-register-inner {
      margin: 0 auto;
      text-align: center;
      color: #333;
      .login-type-btns-group {
        font-size: 16px;
        letter-spacing: 0;
        .login-type-btn {
          margin-right: 28px;
          font-weight: 500;
          color: var(--c-black-2);
          &.active {
            color: var(--c-blue-1);
            border-bottom: 2px solid var(--c-blue-1);
          }
        }
      }
      .login-inputs-area {
        .input-item {
          position: relative;
          padding-bottom: 20px;
          .prefix-input-icon-wrapper {
            padding-bottom: 0;
            top: 14px;
            height: auto;
          }
          &.without-status-icon {
            height: 60px;
          }
          &.without-pb {
            padding-bottom: 0;
          }
          &.with-button {
            .el-input__inner {
              padding-right: 100px;
            }
          }
          &.is-error {
            .el-input__inner {
              border-color: var(--c-red-1);
            }
            .err-msg {
              position: absolute;
              left: 0;
              bottom: 2px;
              line-height: 1;
              font-size: 12px;
              color: var(--c-red-2);
              letter-spacing: 0;
            }
          }
          .el-input {
            flex: 1;
            input {
              height: 40px;
            }
          }
          .pwd-input {
            .pwd-input-inner {
              height: 40px;
              .input-ele {
                height: 32px;
              }
            }
          }
          .msg-code-btn {
            position: absolute;
            right: 0;
            top: 0;
            min-width: 86px;
            height: 40px;
            background: var(--c-blue-1-light-1);
            border-radius: 4px;
            font-size: 14px;
            color: var(--c-blue-2);
            .el-button {
              border: none;
              background: transparent;
              font-size: 14px;
              color: var(--c-blue-2);
              letter-spacing: 0;
              padding: 0;
              height: 40px;
              line-height: 40px;
              text-align: center;
              span {
                font-weight: 400;
              }
            }
          }
          .forget-p {
            color: var(--c-blue-1);
            font-family: "PingFang SC";
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
          }
        }
      }
      .login-btn {
        &.pwd {
          margin-top: 40px;
        }
        .el-button {
          width: 100%;
          height: 40px;
          padding: 0;
          span {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
      .third-party-login {
        padding-right: 32px;
        height: 20px;
        font-size: 12px;
        margin-top: 25px;
        .divide-line {
          width: 103px;
          height: 1px;
          &.line-left {
            background-image: linear-gradient(64deg, rgba(203, 215, 230, 0) 0%, #d9d9d9 95%);
          }
          &.line-right {
            background-image: linear-gradient(270deg, rgba(203, 215, 230, 0) 0%, #d9d9d9 100%);
          }
        }
      }
      .third-party-icons {
        padding-right: 32px;
        img {
          width: 32px;
          margin-right: 40px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .policy-clause {
        font-size: 12px;
        padding-top: 20px;
        display: flex;
        justify-content: flex-end;
        color: var(--c-gray-1);
        .blue-font {
          color: var(--c-blue-2);
        }
      }
    }
  }
</style>
