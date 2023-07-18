<template>
  <div class="forget-pwd">
    <div class="forget-pwd-inner">
      <div v-if="rdata.step === 1">
        <div class="login-type-btns-group flex-start">
          <div class="login-type-btn flex-v pointer">
            <span class="title">{{ $t("user.t32") }}</span>
          </div>
        </div>
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
            />
            <div class="prefix-input-icon-wrapper flex-center">
              <img src="@/assets/imgs/icon_account_a.svg" />
            </div>
            <span
              v-if="rdata.mobileInfos.error"
              class="err-msg"
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
            />
            <div class="msg-code-btn flex-center">
              <CountDown
                v-if="isCountingDown"
                @done="countDownFinished"
              />
              <el-button
                v-else
                :disabled="!rdata.mobileInfos.ok"
                @click="getMsgCode({ mobile: rdata.loginInfo.mobile })"
              >
                <span>{{ $t("user.t7") }}</span>
              </el-button>
            </div>
            <div class="prefix-input-icon-wrapper flex-center">
              <img src="@/assets/imgs/icon_verify.svg" />
            </div>

            <span
              v-if="rdata.msgcodeInfos.error"
              class="err-msg"
            >
              {{ rdata.msgcodeInfos.error }}
            </span>
          </div>

          <!-- 密码组件 -->
          <div
            v-if="rdata.loginType === 2"
            class="input-item without-status-icon without-pb"
          >
            <PasswordInput @validate="validatePwd" />
          </div>
        </div>
        <div class="login-btn">
          <el-button
            type="primary"
            :disabled="rdata.nextBtnDisabled"
            @click="nextStep"
          >
            <!-- 登录/注册 -->
            {{ $t("user.t29") }}
          </el-button>
        </div>
      </div>
      <div
        v-if="rdata.step === 2"
        class="step2"
      >
        <div class="login-type-btns-group flex-start">
          <div class="login-type-btn flex-v pointer">
            <span class="title">{{ $t("user.t28") }}</span>
          </div>
        </div>
        <div class="set-pwd-inputs mt30">
          <div class="input-item">
            <!-- 密码 -->
            <div class="input-wrapper">
              <PasswordInput
                from="2"
                :placeholder="$t('user.t35')"
                @validate="validatePwd"
              />
            </div>
          </div>
          <div class="input-item">
            <!-- 确认密码 -->
            <div class="input-wrapper">
              <PasswordInput
                from="3"
                :compared-value="rdata.pwd"
                :placeholder="$t('user.t30')"
                @validate="validateRepwd"
              />
            </div>
          </div>
        </div>
        <div class="set-btns">
          <!-- 提交 -->
          <el-button
            type="primary"
            :disabled="rdata.disabled"
            @click="setPassword"
          >
            {{ $t("user.t14") }}
          </el-button>
        </div>
      </div>
      <div
        v-if="rdata.step != 3"
        class="flex-end"
      >
        <div
          class="to-login pointer"
          @click="logout"
        >
          {{ $t("user.t33") }}
        </div>
      </div>
      <div
        v-if="rdata.step === 3"
        class="step3"
      >
        <svg-icon name="icon_success" />
        <div class="desc">{{ $t("user.t34") }}</div>
        <div
          class="goLogin"
          @click="logout"
        >
          <div>{{ $t("user.t33") }}</div>
          <CountDown
            v-if="rdata.backCountingDown"
            class="count-down"
            :start-num="rdata.startNum"
            @done="backCountDownFinished"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, watch, onBeforeUnmount } from "vue"
  import { useRouter } from "vue-router"
  import { pwdReset, smsVerify } from "@/api/user"
  import { useCaptchaInit } from "@/hooks/user/forgetPassword"
  import { useCountDownStatus, useGetCaptchaId } from "@/hooks/user"
  import {
    validateMobileChange,
    validateMobileBlur,
    validateEmptyForMsgCodeBlur,
    validateEmptyForMsgCodeChange
    // validateEmptyForPasswordBlur,
    // validateEmptyForPasswordChange,
  } from "@/utils/validate"
  import PasswordInput from "@/components/PasswordInput.vue"
  import CountDown from "@/components/CountDown.vue"

  import { debounce } from "lodash-es"

  type TLoginInfoProps = "mobile" | "msgcode"
  type TRdata = {
    loginType: number // 1-短信验证码登录 2-密码登录
    loginInfo: {
      mobile?: string
      msgcode?: string
    }
    mobileInfos: {
      ok?: boolean
      error?: string
    }
    repwdInfos: {
      ok?: boolean
    }
    pwdInfos: {
      ok?: boolean
    }
    msgcodeInfos: {
      ok?: boolean
      error?: string
    }
    nextBtnDisabled: boolean
    disabled: boolean
    step: number
    pwd: string
    repwd: string
    startNum: number
    backCountingDown: boolean
  }

  const rdata = reactive<TRdata>({
    loginType: 1, // 1-短信验证码登录 2-密码登录
    loginInfo: {},
    mobileInfos: {},
    repwdInfos: {},
    pwdInfos: {},
    msgcodeInfos: {},
    nextBtnDisabled: true,
    disabled: true,
    step: 1,
    pwd: "",
    repwd: "",
    startNum: 3,
    backCountingDown: false
  })

  const router = useRouter()
  const { captchaId } = useGetCaptchaId(1)
  const { captchaNo, startInitGeetest, getMsgCode } = useCaptchaInit()
  const { isCountingDown, startCountDown, stopCountDown } = useCountDownStatus()

  watch(captchaId, (val) => {
    if (val) {
      startInitGeetest(val)
    }
  })

  watch(captchaNo, (val) => {
    if (val) {
      startCountDown()
    }
  })

  const nextStep = async () => {
    if (!rdata.loginInfo.mobile || !rdata.loginInfo.msgcode) {
      return
    }
    const params = {
      mobile: rdata.loginInfo.mobile,
      smsBizType: 1,
      mobileCaptcha: rdata.loginInfo.msgcode
    }
    // 验证手机验证码
    try {
      await smsVerify(params)
      rdata.step = 2
    } catch (e) {
      console.log(e)
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
    // this.validateAndSetInfos(validateEmptyForPasswordChange, prop);
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

  const setPasswordHandler = () => {
    // 开始调设置密码接口
    if (!rdata.pwdInfos.ok) {
      // 高亮密码输入框

      return
    }
    if (!rdata.repwdInfos.ok) {
      // 高亮确认密码输入框

      return
    }

    if (rdata.pwdInfos.ok && rdata.repwdInfos.ok) {
      pwdReset({
        password: rdata.pwd,
        confirmPassword: rdata.repwd,
        mobileCaptcha: rdata.loginInfo.msgcode!,
        mobile: rdata.loginInfo.mobile!
      })
        .then(() => {
          rdata.step = 3
          rdata.backCountingDown = true
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
  const setPassword = debounce(setPasswordHandler, 300)

  const updateConfirmBtnStatus = () => {
    if (rdata.pwdInfos.ok && rdata.repwdInfos.ok) {
      rdata.disabled = false
    } else {
      rdata.disabled = true
    }
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
      rdata.pwd = val
      rdata.pwdInfos.ok = true
    } else {
      rdata.pwdInfos.ok = false
    }
    updateConfirmBtnStatus()
  }

  const validateRepwd = (valid: boolean, value: string) => {
    if (valid) {
      rdata.repwd = value
      rdata.repwdInfos.ok = true
    } else {
      rdata.repwdInfos.ok = false
    }
    updateConfirmBtnStatus()
  }

  const updateLoginBtnStatus = () => {
    if (rdata.mobileInfos.ok && rdata.msgcodeInfos.ok) {
      rdata.nextBtnDisabled = false
    } else {
      rdata.nextBtnDisabled = true
    }
  }

  const logout = () => {
    router.push("/login")
    localStorage.setItem("loginType", "2")
  }

  const backCountDownFinished = () => {
    router.push("/login")
    localStorage.setItem("loginType", "2")
  }

  const countDownFinished = () => {
    stopCountDown()
  }

  onBeforeUnmount(() => {
    setPassword.cancel()
  })
</script>
<style lang="less">
  .forget-pwd {
    margin-top: 24px;
    width: 400px;

    .forget-pwd-inner {
      margin: 0 auto;
      text-align: center;
      color: var(--c-black-2);
      .login-type-btns-group {
        font-size: 16px;
        color: #999999;
        letter-spacing: 0;
        .login-type-btn {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 16px;
          color: var(--c-gray-1);
          margin-right: 28px;
          padding-bottom: 4px;
          border-bottom: 2px solid var(--c-blue-1);
          .title {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 16px;
            color: var(--c-black-2);
          }
        }
      }
      .login-inputs-area {
        .input-item {
          position: relative;
          padding: 0 0 20px 0;
          &.without-status-icon {
            // padding-right: 32px;
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
              bottom: 4px;
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
              &:hover {
                border-color: rgba(98, 93, 245, 0.2);
              }
              &:focus {
                border-color: var(--c-blue-1);
              }
            }
          }
          .msg-code-btn {
            position: absolute;
            right: 1px;
            top: 1px;
            min-width: 86px;
            height: 38px;
            background: var(--c-blue-1-light-1);
            border-radius: 4px;
            color: var(--c-blue-2);
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 14px;
            .el-button {
              border: none;
              background: transparent;
              font-size: 14px;
              color: var(--c-blue-2);
              letter-spacing: 0;
              padding: 0;
              height: 38px;
              line-height: 38px;
              text-align: center;
              span {
                font-weight: 400;
              }
            }
          }
          .icons-group {
            width: 32px;
          }
        }
      }
      .set-pwd-inputs {
        .el-input {
          flex: 1;
          input {
            height: 40px;
          }
        }
        .pwd-input {
          .pwd-input-inner {
            width: calc(100% - 2px);
            height: 38px;
            .input-ele {
              height: 36px;
            }
          }
        }
      }
      .to-login {
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: var(--c-blue-2);
        padding-top: 16px;
      }
      .step3 {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding-right: 32px;
        .svg-icon {
          width: 36px;
          height: 36px;
        }
        .desc {
          font-weight: 400;
          font-size: 16px;
          color: var(--c-black-2);
          padding: 16px 0 16px;
        }
        .goLogin {
          display: flex;
          align-items: center;
          padding-bottom: 40px;
          font-weight: 400;
          font-size: 14px;
          color: var(--c-blue-1);
          cursor: pointer;
          .count-down {
            padding-left: 8px;
            font-family: "PingFang SC";
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 22px;
            color: var(--c-black-0);
          }
        }
      }
      .set-btns {
        .el-button {
          height: 40px;
          width: 400px;
          padding: 0;
          span {
            font-size: 14px;
            font-weight: 500;
          }
        }
        .later-set {
          font-size: 12px;
        }
      }
      .login-btn {
        .el-button {
          width: 100%;
          height: 36px;
          padding: 0;
          span {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
  }
</style>
